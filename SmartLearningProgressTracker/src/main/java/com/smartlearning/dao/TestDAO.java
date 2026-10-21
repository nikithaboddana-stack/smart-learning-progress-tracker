package com.smartlearning.dao;

import com.smartlearning.model.TestRecord;
import com.smartlearning.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Data Access Object for Test/Quiz entity.
 */
public class TestDAO {

    public boolean create(TestRecord test) {
        String sql = "INSERT INTO tests (user_id, subject_id, topic_id, test_name, test_date, " +
                     "marks_obtained, total_marks, notes, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, test.getUserId());
            ps.setInt(2, test.getSubjectId());
            if (test.getTopicId() != null) {
                ps.setInt(3, test.getTopicId());
            } else {
                ps.setNull(3, Types.INTEGER);
            }
            ps.setString(4, test.getTestName());
            ps.setDate(5, test.getTestDate());
            ps.setDouble(6, test.getMarksObtained());
            ps.setDouble(7, test.getTotalMarks());
            ps.setString(8, test.getNotes());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        test.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean update(TestRecord test) {
        String sql = "UPDATE tests SET subject_id = ?, topic_id = ?, test_name = ?, test_date = ?, " +
                     "marks_obtained = ?, total_marks = ?, notes = ? " +
                     "WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, test.getSubjectId());
            if (test.getTopicId() != null) {
                ps.setInt(2, test.getTopicId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setString(3, test.getTestName());
            ps.setDate(4, test.getTestDate());
            ps.setDouble(5, test.getMarksObtained());
            ps.setDouble(6, test.getTotalMarks());
            ps.setString(7, test.getNotes());
            ps.setInt(8, test.getId());
            ps.setInt(9, test.getUserId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TestDAO] update error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int id, int userId) {
        String sql = "DELETE FROM tests WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TestDAO] delete error: " + e.getMessage());
        }
        return false;
    }

    public TestRecord findById(int id, int userId) {
        String sql = "SELECT t.*, s.name as subject_name, tp.name as topic_name " +
                     "FROM tests t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "LEFT JOIN topics tp ON t.topic_id = tp.id " +
                     "WHERE t.id = ? AND t.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToTest(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] findById error: " + e.getMessage());
        }
        return null;
    }

    public List<TestRecord> findByUserId(int userId) {
        List<TestRecord> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name, tp.name as topic_name " +
                     "FROM tests t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "LEFT JOIN topics tp ON t.topic_id = tp.id " +
                     "WHERE t.user_id = ? " +
                     "ORDER BY t.test_date DESC, t.id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTest(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] findByUserId error: " + e.getMessage());
        }
        return list;
    }

    public double getAverageScore(int userId) {
        String sql = "SELECT IFNULL(AVG(percentage), 0) FROM tests WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Math.round(rs.getDouble(1) * 10.0) / 10.0;
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] getAverageScore error: " + e.getMessage());
        }
        return 0.0;
    }

    public Map<String, Double> getSubjectAverages(int userId) {
        Map<String, Double> map = new HashMap<>();
        String sql = "SELECT s.name, IFNULL(AVG(t.percentage), 0) as avg_score " +
                     "FROM subjects s " +
                     "JOIN tests t ON s.id = t.subject_id " +
                     "WHERE t.user_id = ? " +
                     "GROUP BY s.id, s.name";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    map.put(rs.getString("name"), Math.round(rs.getDouble("avg_score") * 10.0) / 10.0);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TestDAO] getSubjectAverages error: " + e.getMessage());
        }
        return map;
    }

    private TestRecord mapResultSetToTest(ResultSet rs) throws SQLException {
        TestRecord t = new TestRecord();
        t.setId(rs.getInt("id"));
        t.setUserId(rs.getInt("user_id"));
        t.setSubjectId(rs.getInt("subject_id"));
        int topId = rs.getInt("topic_id");
        if (!rs.wasNull()) {
            t.setTopicId(topId);
        }
        t.setTestName(rs.getString("test_name"));
        t.setTestDate(rs.getDate("test_date"));
        t.setMarksObtained(rs.getDouble("marks_obtained"));
        t.setTotalMarks(rs.getDouble("total_marks"));
        t.setPercentage(Math.round(rs.getDouble("percentage") * 10.0) / 10.0);
        t.setNotes(rs.getString("notes"));
        t.setCreatedAt(rs.getTimestamp("created_at"));
        t.setSubjectName(rs.getString("subject_name"));
        t.setTopicName(rs.getString("topic_name"));
        return t;
    }
}
