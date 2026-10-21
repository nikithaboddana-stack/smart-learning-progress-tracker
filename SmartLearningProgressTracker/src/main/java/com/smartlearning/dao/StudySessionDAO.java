package com.smartlearning.dao;

import com.smartlearning.model.StudySession;
import com.smartlearning.util.DBConnection;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for StudySession entity.
 * Calculates study hours, analytics, and dynamic streaks.
 */
public class StudySessionDAO {

    public boolean create(StudySession session) {
        String sql = "INSERT INTO study_sessions (user_id, subject_id, topic_id, study_date, " +
                     "start_time, end_time, duration_minutes, notes, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, session.getUserId());
            ps.setInt(2, session.getSubjectId());
            if (session.getTopicId() != null) {
                ps.setInt(3, session.getTopicId());
            } else {
                ps.setNull(3, Types.INTEGER);
            }
            ps.setDate(4, session.getStudyDate());
            ps.setTime(5, session.getStartTime());
            ps.setTime(6, session.getEndTime());
            ps.setInt(7, session.getDurationMinutes());
            ps.setString(8, session.getNotes());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        session.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int id, int userId) {
        String sql = "DELETE FROM study_sessions WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] delete error: " + e.getMessage());
        }
        return false;
    }

    public List<StudySession> findByUserId(int userId, int limit) {
        List<StudySession> list = new ArrayList<>();
        String sql = "SELECT ss.*, s.name as subject_name, t.name as topic_name " +
                     "FROM study_sessions ss " +
                     "JOIN subjects s ON ss.subject_id = s.id " +
                     "LEFT JOIN topics t ON ss.topic_id = t.id " +
                     "WHERE ss.user_id = ? " +
                     "ORDER BY ss.study_date DESC, ss.start_time DESC LIMIT ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            ps.setInt(2, limit > 0 ? limit : 100);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    StudySession s = new StudySession();
                    s.setId(rs.getInt("id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setSubjectId(rs.getInt("subject_id"));
                    int topId = rs.getInt("topic_id");
                    if (!rs.wasNull()) {
                        s.setTopicId(topId);
                    }
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
            System.err.println("[StudySessionDAO] findByUserId error: " + e.getMessage());
        }
        return list;
    }

    public double getTodayHours(int userId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 as total_hrs " +
                     "FROM study_sessions WHERE user_id = ? AND study_date = CURDATE()";
        return querySingleDouble(sql, userId);
    }

    public double getWeeklyHours(int userId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 as total_hrs " +
                     "FROM study_sessions WHERE user_id = ? AND study_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        return querySingleDouble(sql, userId);
    }

    public double getMonthlyHours(int userId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 as total_hrs " +
                     "FROM study_sessions WHERE user_id = ? AND study_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        return querySingleDouble(sql, userId);
    }

    public double getTotalHours(int userId) {
        String sql = "SELECT IFNULL(SUM(duration_minutes), 0) / 60.0 as total_hrs " +
                     "FROM study_sessions WHERE user_id = ?";
        return querySingleDouble(sql, userId);
    }

    /**
     * Calculates current and longest study streak dynamically from distinct study dates.
     * @return int array [currentStreak, longestStreak]
     */
    public int[] calculateStreaks(int userId) {
        int currentStreak = 0;
        int longestStreak = 0;

        String sql = "SELECT DISTINCT study_date FROM study_sessions " +
                     "WHERE user_id = ? ORDER BY study_date DESC";

        List<LocalDate> dates = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Date d = rs.getDate("study_date");
                    if (d != null) {
                        dates.add(d.toLocalDate());
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudySessionDAO] calculateStreaks error: " + e.getMessage());
            return new int[]{0, 0};
        }

        if (dates.isEmpty()) {
            return new int[]{0, 0};
        }

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        LocalDate first = dates.get(0);

        // Check if streak is active (studied today or yesterday)
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
        } else {
            currentStreak = 0;
        }

        // Calculate all-time longest streak
        int tempStreak = 0;
        LocalDate previousDate = null;

        // Iterate backwards from oldest to newest for longest streak
        for (int i = dates.size() - 1; i >= 0; i--) {
            LocalDate d = dates.get(i);
            if (previousDate == null) {
                tempStreak = 1;
            } else if (d.equals(previousDate.plusDays(1))) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
            previousDate = d;
        }

        return new int[]{currentStreak, longestStreak};
    }

    private double querySingleDouble(String sql, int userId) {
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
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
