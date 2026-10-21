package com.smarttracker.dao;

import com.smarttracker.model.StudySession;
import com.smarttracker.util.DBConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class StudySessionDAO {

    public boolean create(StudySession s) {
        String sql = "INSERT INTO study_sessions (student_id, subject_id, topic_id, study_date, start_time, end_time, duration_minutes, notes, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, s.getStudentId());
            ps.setInt(2, s.getSubjectId());
            if (s.getTopicId() != null) {
                ps.setInt(3, s.getTopicId());
            } else {
                ps.setNull(3, Types.INTEGER);
            }
            ps.setDate(4, s.getStudyDate());
            ps.setTime(5, s.getStartTime());
            ps.setTime(6, s.getEndTime());
            ps.setInt(7, s.getDurationMinutes());
            ps.setString(8, s.getNotes());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public List<StudySession> findByStudentId(int studentId, int limit) {
        List<StudySession> list = new ArrayList<>();
        String sql = "SELECT ss.*, s.name as subject_name, t.topic_name " +
                     "FROM study_sessions ss " +
                     "JOIN subjects s ON ss.subject_id = s.id " +
                     "LEFT JOIN topics t ON ss.topic_id = t.id " +
                     "WHERE ss.student_id = ? " +
                     "ORDER BY ss.study_date DESC, ss.start_time DESC LIMIT ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, limit > 0 ? limit : 100);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    StudySession s = new StudySession();
                    s.setId(rs.getInt("id"));
                    s.setStudentId(rs.getInt("student_id"));
                    s.setSubjectId(rs.getInt("subject_id"));
                    int topId = rs.getInt("topic_id");
                    if (!rs.wasNull()) s.setTopicId(topId);
                    s.setStudyDate(rs.getDate("study_date"));
                    s.setStartTime(rs.getTime("start_time"));
                    s.setEndTime(rs.getTime("end_time"));
                    s.setDurationMinutes(rs.getInt("duration_minutes"));
                    s.setNotes(rs.getString("notes"));
                    s.setCreatedAt(rs.getTimestamp("created_at"));
                    s.setSubjectName(rs.getString("subject_name"));
                    s.setTopicName(rs.getString("topic_name"));
                    list.add(s);
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] findByStudentId error: " + e.getMessage());
        }
        return list;
    }

    public double getTodayHours(int studentId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 FROM study_sessions WHERE student_id = ? AND study_date = CURDATE()";
        return querySingleDouble(sql, studentId);
    }

    public double getWeeklyHours(int studentId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 FROM study_sessions WHERE student_id = ? AND study_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        return querySingleDouble(sql, studentId);
    }

    public double getTotalHours(int studentId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 FROM study_sessions WHERE student_id = ?";
        return querySingleDouble(sql, studentId);
    }

    public int[] calculateStreaks(int studentId) {
        int currentStreak = 0;
        int longestStreak = 0;

        String sql = "SELECT DISTINCT study_date FROM study_sessions WHERE student_id = ? ORDER BY study_date DESC";
        List<LocalDate> dates = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Date d = rs.getDate("study_date");
                    if (d != null) dates.add(d.toLocalDate());
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] calculateStreaks error: " + e.getMessage());
            return new int[]{0, 0};
        }

        if (dates.isEmpty()) return new int[]{0, 0};

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate first = dates.get(0);

        if (first.equals(today) || first.equals(yesterday)) {
            LocalDate expected = first;
            for (LocalDate d : dates) {
                if (d.equals(expected)) {
                    currentStreak++;
                    expected = expected.minusDays(1);
                } else if (d.isBefore(expected)) {
                    break;
                }
            }
        }

        int temp = 0;
        LocalDate prev = null;
        for (int i = dates.size() - 1; i >= 0; i--) {
            LocalDate d = dates.get(i);
            if (prev == null || d.equals(prev.plusDays(1))) {
                temp++;
            } else {
                temp = 1;
            }
            if (temp > longestStreak) longestStreak = temp;
            prev = d;
        }

        return new int[]{currentStreak, longestStreak};
    }

    public int countTotalSessions() {
        String sql = "SELECT COUNT(*) FROM study_sessions";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] countTotalSessions error: " + e.getMessage());
        }
        return 0;
    }

    private double querySingleDouble(String sql, int studentId) {
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Math.round(rs.getDouble(1) * 10.0) / 10.0;
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] querySingleDouble error: " + e.getMessage());
        }
        return 0.0;
    }
}
