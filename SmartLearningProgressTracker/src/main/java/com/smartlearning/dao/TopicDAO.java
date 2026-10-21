package com.smartlearning.dao;

import com.smartlearning.model.Topic;
import com.smartlearning.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Topic entity.
 */
public class TopicDAO {

    public boolean create(Topic topic) {
        String sql = "INSERT INTO topics (subject_id, name, description, difficulty, status, " +
                     "progress_percentage, confidence_level, last_studied, revision_count, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, topic.getSubjectId());
            ps.setString(2, topic.getName());
            ps.setString(3, topic.getDescription());
            ps.setString(4, topic.getDifficulty());
            ps.setString(5, topic.getStatus());
            ps.setDouble(6, topic.getProgressPercentage());
            ps.setInt(7, topic.getConfidenceLevel());
            ps.setDate(8, topic.getLastStudied());
            ps.setInt(9, topic.getRevisionCount());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        topic.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[TopicDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean update(Topic topic, int userId) {
        String sql = "UPDATE topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "SET t.name = ?, t.description = ?, t.difficulty = ?, t.status = ?, " +
                     "t.progress_percentage = ?, t.confidence_level = ?, t.last_studied = ?, t.revision_count = ? " +
                     "WHERE t.id = ? AND s.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, topic.getName());
            ps.setString(2, topic.getDescription());
            ps.setString(3, topic.getDifficulty());
            ps.setString(4, topic.getStatus());
            ps.setDouble(5, topic.getProgressPercentage());
            ps.setInt(6, topic.getConfidenceLevel());
            ps.setDate(7, topic.getLastStudied());
            ps.setInt(8, topic.getRevisionCount());
            ps.setInt(9, topic.getId());
            ps.setInt(10, userId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TopicDAO] update error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int id, int userId) {
        String sql = "DELETE t FROM topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE t.id = ? AND s.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TopicDAO] delete error: " + e.getMessage());
        }
        return false;
    }

    public Topic findById(int id, int userId) {
        String sql = "SELECT t.*, s.name as subject_name " +
                     "FROM topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE t.id = ? AND s.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToTopic(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TopicDAO] findById error: " + e.getMessage());
        }
        return null;
    }

    public List<Topic> findBySubjectId(int subjectId, int userId) {
        List<Topic> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name " +
                     "FROM topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE t.subject_id = ? AND s.user_id = ? " +
                     "ORDER BY t.id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, subjectId);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTopic(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TopicDAO] findBySubjectId error: " + e.getMessage());
        }
        return list;
    }

    public List<Topic> findByUserId(int userId) {
        List<Topic> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name " +
                     "FROM topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE s.user_id = ? " +
                     "ORDER BY s.name ASC, t.id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTopic(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TopicDAO] findByUserId error: " + e.getMessage());
        }
        return list;
    }

    public boolean updateProgress(int topicId, int userId, double progress, String status, int confidence) {
        String sql = "UPDATE topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "SET t.progress_percentage = ?, t.status = ?, t.confidence_level = ?, t.last_studied = CURDATE() " +
                     "WHERE t.id = ? AND s.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setDouble(1, progress);
            ps.setString(2, status);
            ps.setInt(3, confidence);
            ps.setInt(4, topicId);
            ps.setInt(5, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TopicDAO] updateProgress error: " + e.getMessage());
        }
        return false;
    }

    public boolean incrementRevision(int topicId, int userId) {
        String sql = "UPDATE topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "SET t.revision_count = t.revision_count + 1, t.last_studied = CURDATE() " +
                     "WHERE t.id = ? AND s.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, topicId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TopicDAO] incrementRevision error: " + e.getMessage());
        }
        return false;
    }

    public List<Topic> getWeakTopics(int userId) {
        List<Topic> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name " +
                     "FROM topics t " +
                     "JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE s.user_id = ? AND (t.confidence_level <= 2 OR t.progress_percentage < 50.00) " +
                     "ORDER BY t.confidence_level ASC, t.progress_percentage ASC LIMIT 10";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTopic(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TopicDAO] getWeakTopics error: " + e.getMessage());
        }
        return list;
    }

    private Topic mapResultSetToTopic(ResultSet rs) throws SQLException {
        Topic t = new Topic();
        t.setId(rs.getInt("id"));
        t.setSubjectId(rs.getInt("subject_id"));
        t.setName(rs.getString("name"));
        t.setDescription(rs.getString("description"));
        t.setDifficulty(rs.getString("difficulty"));
        t.setStatus(rs.getString("status"));
        t.setProgressPercentage(rs.getDouble("progress_percentage"));
        t.setConfidenceLevel(rs.getInt("confidence_level"));
        t.setLastStudied(rs.getDate("last_studied"));
        t.setRevisionCount(rs.getInt("revision_count"));
        t.setCreatedAt(rs.getTimestamp("created_at"));
        try {
            t.setSubjectName(rs.getString("subject_name"));
        } catch (SQLException ignored) {}
        return t;
    }
}
