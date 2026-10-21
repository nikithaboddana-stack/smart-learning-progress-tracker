package com.smarttracker.dao;

import com.smarttracker.model.StudentSubject;
import com.smarttracker.model.Subject;
import com.smarttracker.model.Topic;
import com.smarttracker.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SubjectDAO {

    public List<Subject> findAllMasterSubjects() {
        List<Subject> list = new ArrayList<>();
        String sql = "SELECT * FROM subjects ORDER BY code ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Subject s = new Subject();
                s.setId(rs.getInt("id"));
                s.setName(rs.getString("name"));
                s.setCode(rs.getString("code"));
                s.setFaculty(rs.getString("faculty"));
                s.setDepartment(rs.getString("department"));
                s.setCredits(rs.getInt("credits"));
                s.setCreatedAt(rs.getTimestamp("created_at"));
                list.add(s);
            }
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] findAllMasterSubjects error: " + e.getMessage());
        }
        return list;
    }

    public boolean createMasterSubject(Subject s) {
        String sql = "INSERT INTO subjects (name, code, faculty, department, credits) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, s.getName());
            ps.setString(2, s.getCode());
            ps.setString(3, s.getFaculty());
            ps.setString(4, s.getDepartment());
            ps.setInt(5, s.getCredits());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] createMasterSubject error: " + e.getMessage());
        }
        return false;
    }

    public boolean updateMasterSubject(Subject s) {
        String sql = "UPDATE subjects SET name = ?, code = ?, faculty = ?, department = ?, credits = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, s.getName());
            ps.setString(2, s.getCode());
            ps.setString(3, s.getFaculty());
            ps.setString(4, s.getDepartment());
            ps.setInt(5, s.getCredits());
            ps.setInt(6, s.getId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] updateMasterSubject error: " + e.getMessage());
        }
        return false;
    }

    public boolean deleteMasterSubject(int id) {
        String sql = "DELETE FROM subjects WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] deleteMasterSubject error: " + e.getMessage());
        }
        return false;
    }

    public List<StudentSubject> findStudentSubjects(int studentId) {
        List<StudentSubject> list = new ArrayList<>();
        String sql = "SELECT ss.*, s.name as subject_name, s.code as subject_code, s.faculty, s.credits, " +
                     "COUNT(DISTINCT t.id) as total_topics, " +
                     "SUM(CASE WHEN stp.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_topics, " +
                     "IFNULL((SELECT AVG(tr.percentage) FROM test_results tr JOIN tests ts ON tr.test_id = ts.id WHERE ts.subject_id = s.id AND tr.student_id = ?), 0) as avg_test_pct " +
                     "FROM student_subjects ss " +
                     "JOIN subjects s ON ss.subject_id = s.id " +
                     "LEFT JOIN topics t ON s.id = t.subject_id " +
                     "LEFT JOIN student_topic_progress stp ON (t.id = stp.topic_id AND stp.student_id = ?) " +
                     "WHERE ss.student_id = ? " +
                     "GROUP BY ss.id " +
                     "ORDER BY CASE ss.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, s.name ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, studentId);
            ps.setInt(3, studentId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    StudentSubject ss = new StudentSubject();
                    ss.setId(rs.getInt("id"));
                    ss.setStudentId(rs.getInt("student_id"));
                    ss.setSubjectId(rs.getInt("subject_id"));
                    ss.setTargetPercentage(rs.getDouble("target_percentage"));
                    ss.setPriority(rs.getString("priority"));
                    ss.setEnrolledAt(rs.getTimestamp("enrolled_at"));
                    ss.setSubjectName(rs.getString("subject_name"));
                    ss.setSubjectCode(rs.getString("subject_code"));
                    ss.setFaculty(rs.getString("faculty"));
                    ss.setCredits(rs.getInt("credits"));
                    ss.setTotalTopics(rs.getInt("total_topics"));
                    ss.setCompletedTopics(rs.getInt("completed_topics"));
                    ss.setCurrentPercentage(Math.round(rs.getDouble("avg_test_pct") * 10.0) / 10.0);
                    list.add(ss);
                }
            }
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] findStudentSubjects error: " + e.getMessage());
        }
        return list;
    }

    public boolean enrollStudentSubject(int studentId, int subjectId, double target, String priority) {
        String sql = "INSERT INTO student_subjects (student_id, subject_id, target_percentage, priority) VALUES (?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE target_percentage = VALUES(target_percentage), priority = VALUES(priority)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, subjectId);
            ps.setDouble(3, target);
            ps.setString(4, priority);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] enrollStudentSubject error: " + e.getMessage());
        }
        return false;
    }

    public boolean removeStudentSubject(int studentId, int subjectId) {
        String sql = "DELETE FROM student_subjects WHERE student_id = ? AND subject_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, subjectId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] removeStudentSubject error: " + e.getMessage());
        }
        return false;
    }

    public List<Topic> findTopicsBySubjectId(int subjectId, int studentId) {
        List<Topic> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name, " +
                     "IFNULL(stp.status, 'NOT_STARTED') as student_status, " +
                     "IFNULL(stp.progress_percentage, 0.0) as student_progress, " +
                     "IFNULL(stp.confidence_level, 3) as student_confidence, " +
                     "IFNULL(stp.revision_count, 0) as student_revisions, " +
                     "stp.last_revised " +
                     "FROM topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "LEFT JOIN student_topic_progress stp ON (t.id = stp.topic_id AND stp.student_id = ?) " +
                     "WHERE t.subject_id = ? ORDER BY t.id ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, subjectId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Topic t = new Topic();
                    t.setId(rs.getInt("id"));
                    t.setSubjectId(rs.getInt("subject_id"));
                    t.setTopicName(rs.getString("topic_name"));
                    t.setDifficulty(rs.getString("difficulty"));
                    t.setSubjectName(rs.getString("subject_name"));
                    t.setStatus(rs.getString("student_status"));
                    t.setProgressPercentage(rs.getDouble("student_progress"));
                    t.setConfidenceLevel(rs.getInt("student_confidence"));
                    t.setRevisionCount(rs.getInt("student_revisions"));
                    t.setLastRevised(rs.getDate("last_revised"));
                    list.add(t);
                }
            }
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] findTopicsBySubjectId error: " + e.getMessage());
        }
        return list;
    }

    public boolean updateTopicProgress(int studentId, int topicId, String status, double progress, int confidence) {
        String sql = "INSERT INTO student_topic_progress (student_id, topic_id, status, progress_percentage, confidence_level, last_revised) " +
                     "VALUES (?, ?, ?, ?, ?, CURDATE()) " +
                     "ON DUPLICATE KEY UPDATE status = VALUES(status), progress_percentage = VALUES(progress_percentage), " +
                     "confidence_level = VALUES(confidence_level), last_revised = CURDATE()";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, topicId);
            ps.setString(3, status);
            ps.setDouble(4, progress);
            ps.setInt(5, confidence);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] updateTopicProgress error: " + e.getMessage());
        }
        return false;
    }

    public int countSubjects() {
        String sql = "SELECT COUNT(*) FROM subjects";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] countSubjects error: " + e.getMessage());
        }
        return 0;
    }
}
