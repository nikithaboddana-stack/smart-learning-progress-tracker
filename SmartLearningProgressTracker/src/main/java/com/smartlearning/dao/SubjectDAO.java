package com.smartlearning.dao;

import com.smartlearning.model.Subject;
import com.smartlearning.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Subject entity.
 */
public class SubjectDAO {

    public boolean create(Subject subject) {
        String sql = "INSERT INTO subjects (user_id, name, description, priority, target_percentage, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, subject.getUserId());
            ps.setString(2, subject.getName());
            ps.setString(3, subject.getDescription());
            ps.setString(4, subject.getPriority());
            ps.setDouble(5, subject.getTargetPercentage());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        subject.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean update(Subject subject) {
        String sql = "UPDATE subjects SET name = ?, description = ?, priority = ?, target_percentage = ? " +
                     "WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, subject.getName());
            ps.setString(2, subject.getDescription());
            ps.setString(3, subject.getPriority());
            ps.setDouble(4, subject.getTargetPercentage());
            ps.setInt(5, subject.getId());
            ps.setInt(6, subject.getUserId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] update error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int id, int userId) {
        String sql = "DELETE FROM subjects WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] delete error: " + e.getMessage());
        }
        return false;
    }

    public Subject findById(int id, int userId) {
        String sql = "SELECT s.id, s.user_id, s.name, s.description, s.priority, s.target_percentage, s.created_at, " +
                     "COUNT(t.id) as total_topics, " +
                     "SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_topics, " +
                     "IFNULL(AVG(t.progress_percentage), 0) as avg_progress " +
                     "FROM subjects s " +
                     "LEFT JOIN topics t ON s.id = t.subject_id " +
                     "WHERE s.id = ? AND s.user_id = ? " +
                     "GROUP BY s.id";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Subject subject = mapResultSetToSubject(rs);
                    subject.setTotalTopics(rs.getInt("total_topics"));
                    subject.setCompletedTopics(rs.getInt("completed_topics"));
                    subject.setOverallProgress(Math.round(rs.getDouble("avg_progress") * 10.0) / 10.0);
                    return subject;
                }
            }
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] findById error: " + e.getMessage());
        }
        return null;
    }

    public List<Subject> findByUserId(int userId) {
        List<Subject> list = new ArrayList<>();
        String sql = "SELECT s.id, s.user_id, s.name, s.description, s.priority, s.target_percentage, s.created_at, " +
                     "COUNT(t.id) as total_topics, " +
                     "SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_topics, " +
                     "IFNULL(AVG(t.progress_percentage), 0) as avg_progress " +
                     "FROM subjects s " +
                     "LEFT JOIN topics t ON s.id = t.subject_id " +
                     "WHERE s.user_id = ? " +
                     "GROUP BY s.id " +
                     "ORDER BY CASE s.priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END, s.name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Subject subject = mapResultSetToSubject(rs);
                    subject.setTotalTopics(rs.getInt("total_topics"));
                    subject.setCompletedTopics(rs.getInt("completed_topics"));
                    subject.setOverallProgress(Math.round(rs.getDouble("avg_progress") * 10.0) / 10.0);
                    list.add(subject);
                }
            }
        } catch (SQLException e) {
            System.err.println("[SubjectDAO] findByUserId error: " + e.getMessage());
        }
        return list;
    }

    private Subject mapResultSetToSubject(ResultSet rs) throws SQLException {
        Subject s = new Subject();
        s.setId(rs.getInt("id"));
        s.setUserId(rs.getInt("user_id"));
        s.setName(rs.getString("name"));
        s.setDescription(rs.getString("description"));
        s.setPriority(rs.getString("priority"));
        s.setTargetPercentage(rs.getDouble("target_percentage"));
        s.setCreatedAt(rs.getTimestamp("created_at"));
        return s;
    }
}
