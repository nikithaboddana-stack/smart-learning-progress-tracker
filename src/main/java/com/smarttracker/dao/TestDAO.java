package com.smarttracker.dao;

import com.smarttracker.model.Test;
import com.smarttracker.model.TestResult;
import com.smarttracker.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TestDAO {

    public List<Test> findAllTests() {
        List<Test> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name, s.code as subject_code " +
                     "FROM tests t JOIN subjects s ON t.subject_id = s.id ORDER BY t.test_date DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Test t = new Test();
                t.setId(rs.getInt("id"));
                t.setSubjectId(rs.getInt("subject_id"));
                t.setTestName(rs.getString("test_name"));
                t.setTestDate(rs.getDate("test_date"));
                t.setMaxMarks(rs.getDouble("max_marks"));
                t.setTestType(rs.getString("test_type"));
                t.setSubjectName(rs.getString("subject_name"));
                t.setSubjectCode(rs.getString("subject_code"));
                list.add(t);
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] findAllTests error: " + e.getMessage());
        }
        return list;
    }

    public List<Test> findUpcomingTestsForStudent(int studentId, int limit) {
        List<Test> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name, s.code as subject_code " +
                     "FROM tests t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "JOIN student_subjects ss ON s.id = ss.subject_id " +
                     "WHERE ss.student_id = ? AND t.test_date >= CURDATE() " +
                     "ORDER BY t.test_date ASC LIMIT ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, limit);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Test t = new Test();
                    t.setId(rs.getInt("id"));
                    t.setSubjectId(rs.getInt("subject_id"));
                    t.setTestName(rs.getString("test_name"));
                    t.setTestDate(rs.getDate("test_date"));
                    t.setMaxMarks(rs.getDouble("max_marks"));
                    t.setTestType(rs.getString("test_type"));
                    t.setSubjectName(rs.getString("subject_name"));
                    t.setSubjectCode(rs.getString("subject_code"));
                    list.add(t);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] findUpcomingTestsForStudent error: " + e.getMessage());
        }
        return list;
    }

    public List<TestResult> findStudentTestResults(int studentId) {
        List<TestResult> list = new ArrayList<>();
        String sql = "SELECT tr.*, t.test_name, t.test_date, t.max_marks, s.name as subject_name, s.code as subject_code " +
                     "FROM test_results tr " +
                     "JOIN tests t ON tr.test_id = t.id " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE tr.student_id = ? " +
                     "ORDER BY t.test_date DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    TestResult r = new TestResult();
                    r.setId(rs.getInt("id"));
                    r.setTestId(rs.getInt("test_id"));
                    r.setStudentId(rs.getInt("student_id"));
                    r.setMarksObtained(rs.getDouble("marks_obtained"));
                    r.setPercentage(rs.getDouble("percentage"));
                    r.setFeedback(rs.getString("feedback"));
                    r.setRecordedAt(rs.getTimestamp("recorded_at"));
                    r.setTestName(rs.getString("test_name"));
                    r.setTestDate(rs.getDate("test_date"));
                    r.setMaxMarks(rs.getDouble("max_marks"));
                    r.setSubjectName(rs.getString("subject_name"));
                    r.setSubjectCode(rs.getString("subject_code"));
                    list.add(r);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] findStudentTestResults error: " + e.getMessage());
        }
        return list;
    }

    public boolean recordTestResult(int testId, int studentId, double marksObtained, String feedback) {
        String sql = "INSERT INTO test_results (test_id, student_id, marks_obtained, percentage, feedback, recorded_at) " +
                     "SELECT ?, ?, ?, (? / max_marks) * 100, ?, NOW() FROM tests WHERE id = ? " +
                     "ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained), percentage = VALUES(percentage), feedback = VALUES(feedback)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, testId);
            ps.setInt(2, studentId);
            ps.setDouble(3, marksObtained);
            ps.setDouble(4, marksObtained);
            ps.setString(5, feedback);
            ps.setInt(6, testId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TestDAO] recordTestResult error: " + e.getMessage());
        }
        return false;
    }

    public boolean createTest(Test test) {
        String sql = "INSERT INTO tests (subject_id, test_name, test_date, max_marks, test_type, created_by, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, test.getSubjectId());
            ps.setString(2, test.getTestName());
            ps.setDate(3, test.getTestDate());
            ps.setDouble(4, test.getMaxMarks());
            ps.setString(5, test.getTestType());
            if (test.getCreatedBy() != null) {
                ps.setInt(6, test.getCreatedBy());
            } else {
                ps.setNull(6, Types.INTEGER);
            }

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TestDAO] createTest error: " + e.getMessage());
        }
        return false;
    }

    public double calculateStudentAverage(int studentId) {
        String sql = "SELECT IFNULL(AVG(percentage), 0.0) FROM test_results WHERE student_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Math.round(rs.getDouble(1) * 10.0) / 10.0;
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] calculateStudentAverage error: " + e.getMessage());
        }
        return 0.0;
    }

    public double calculateInstitutionalAverage() {
        String sql = "SELECT IFNULL(AVG(percentage), 0.0) FROM test_results";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return Math.round(rs.getDouble(1) * 10.0) / 10.0;
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] calculateInstitutionalAverage error: " + e.getMessage());
        }
        return 0.0;
    }

    public int countTests() {
        String sql = "SELECT COUNT(*) FROM tests";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("[TestDAO] countTests error: " + e.getMessage());
        }
        return 0;
    }
}
