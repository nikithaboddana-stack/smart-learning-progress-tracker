package com.smartlearning.dao;

import com.smartlearning.model.Goal;
import com.smartlearning.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Goal entity.
 */
public class GoalDAO {

    public boolean create(Goal goal) {
        String sql = "INSERT INTO goals (user_id, title, description, target_value, current_value, unit, deadline, status, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, goal.getUserId());
            ps.setString(2, goal.getTitle());
            ps.setString(3, goal.getDescription());
            ps.setDouble(4, goal.getTargetValue());
            ps.setDouble(5, goal.getCurrentValue());
            ps.setString(6, goal.getUnit());
            ps.setDate(7, goal.getDeadline());
            ps.setString(8, goal.getStatus());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        goal.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[GoalDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean update(Goal goal) {
        String sql = "UPDATE goals SET title = ?, description = ?, target_value = ?, current_value = ?, " +
                     "unit = ?, deadline = ?, status = ? WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, goal.getTitle());
            ps.setString(2, goal.getDescription());
            ps.setDouble(3, goal.getTargetValue());
            ps.setDouble(4, goal.getCurrentValue());
            ps.setString(5, goal.getUnit());
            ps.setDate(6, goal.getDeadline());
            ps.setString(7, goal.getStatus());
            ps.setInt(8, goal.getId());
            ps.setInt(9, goal.getUserId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[GoalDAO] update error: " + e.getMessage());
        }
        return false;
    }

    public boolean updateProgress(int id, int userId, double currentValue) {
        // Automatically check if goal reached target
        String sql = "UPDATE goals SET current_value = ?, " +
                     "status = CASE WHEN current_value >= target_value THEN 'Completed' " +
                     "WHEN deadline < CURDATE() AND current_value < target_value THEN 'Overdue' ELSE 'Active' END " +
                     "WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setDouble(1, currentValue);
            ps.setInt(2, id);
            ps.setInt(3, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[GoalDAO] updateProgress error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int id, int userId) {
        String sql = "DELETE FROM goals WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[GoalDAO] delete error: " + e.getMessage());
        }
        return false;
    }

    public Goal findById(int id, int userId) {
        String sql = "SELECT * FROM goals WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToGoal(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[GoalDAO] findById error: " + e.getMessage());
        }
        return null;
    }

    public List<Goal> findByUserId(int userId) {
        List<Goal> list = new ArrayList<>();
        String sql = "SELECT * FROM goals WHERE user_id = ? ORDER BY deadline ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToGoal(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[GoalDAO] findByUserId error: " + e.getMessage());
        }
        return list;
    }

    private Goal mapResultSetToGoal(ResultSet rs) throws SQLException {
        Goal g = new Goal();
        g.setId(rs.getInt("id"));
        g.setUserId(rs.getInt("user_id"));
        g.setTitle(rs.getString("title"));
        g.setDescription(rs.getString("description"));
        g.setTargetValue(rs.getDouble("target_value"));
        g.setCurrentValue(rs.getDouble("current_value"));
        g.setUnit(rs.getString("unit"));
        g.setDeadline(rs.getDate("deadline"));
        g.setStatus(rs.getString("status"));
        g.setCreatedAt(rs.getTimestamp("created_at"));
        return g;
    }
}
