package com.smartlearning.dao;

import com.smartlearning.model.Task;
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
 * Data Access Object for Task entity.
 */
public class TaskDAO {

    public boolean create(Task task) {
        String sql = "INSERT INTO tasks (user_id, subject_id, topic_id, title, description, priority, " +
                     "due_date, estimated_minutes, status, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, task.getUserId());
            if (task.getSubjectId() != null) {
                ps.setInt(2, task.getSubjectId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            if (task.getTopicId() != null) {
                ps.setInt(3, task.getTopicId());
            } else {
                ps.setNull(3, Types.INTEGER);
            }
            ps.setString(4, task.getTitle());
            ps.setString(5, task.getDescription());
            ps.setString(6, task.getPriority());
            ps.setDate(7, task.getDueDate());
            ps.setInt(8, task.getEstimatedMinutes());
            ps.setString(9, task.getStatus());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        task.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[TaskDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean update(Task task) {
        String sql = "UPDATE tasks SET subject_id = ?, topic_id = ?, title = ?, description = ?, " +
                     "priority = ?, due_date = ?, estimated_minutes = ?, status = ? " +
                     "WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            if (task.getSubjectId() != null) {
                ps.setInt(1, task.getSubjectId());
            } else {
                ps.setNull(1, Types.INTEGER);
            }
            if (task.getTopicId() != null) {
                ps.setInt(2, task.getTopicId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setString(3, task.getTitle());
            ps.setString(4, task.getDescription());
            ps.setString(5, task.getPriority());
            ps.setDate(6, task.getDueDate());
            ps.setInt(7, task.getEstimatedMinutes());
            ps.setString(8, task.getStatus());
            ps.setInt(9, task.getId());
            ps.setInt(10, task.getUserId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TaskDAO] update error: " + e.getMessage());
        }
        return false;
    }

    public boolean updateStatus(int id, int userId, String status) {
        String sql = "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ps.setInt(2, id);
            ps.setInt(3, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TaskDAO] updateStatus error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int id, int userId) {
        String sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TaskDAO] delete error: " + e.getMessage());
        }
        return false;
    }

    public Task findById(int id, int userId) {
        String sql = "SELECT t.*, s.name as subject_name, tp.name as topic_name " +
                     "FROM tasks t " +
                     "LEFT JOIN subjects s ON t.subject_id = s.id " +
                     "LEFT JOIN topics tp ON t.topic_id = tp.id " +
                     "WHERE t.id = ? AND t.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToTask(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[TaskDAO] findById error: " + e.getMessage());
        }
        return null;
    }

    public List<Task> findByUserId(int userId, String statusFilter) {
        List<Task> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT t.*, s.name as subject_name, tp.name as topic_name " +
            "FROM tasks t " +
            "LEFT JOIN subjects s ON t.subject_id = s.id " +
            "LEFT JOIN topics tp ON t.topic_id = tp.id " +
            "WHERE t.user_id = ? "
        );

        if (statusFilter != null && !statusFilter.trim().isEmpty() && !statusFilter.equalsIgnoreCase("ALL")) {
            sql.append("AND t.status = ? ");
        }

        sql.append("ORDER BY CASE t.priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END, t.due_date ASC");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            
            ps.setInt(1, userId);
            if (statusFilter != null && !statusFilter.trim().isEmpty() && !statusFilter.equalsIgnoreCase("ALL")) {
                ps.setString(2, statusFilter.trim());
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTask(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TaskDAO] findByUserId error: " + e.getMessage());
        }
        return list;
    }

    public List<Task> getUpcomingDeadlines(int userId, int limit) {
        List<Task> list = new ArrayList<>();
        String sql = "SELECT t.*, s.name as subject_name, tp.name as topic_name " +
                     "FROM tasks t " +
                     "LEFT JOIN subjects s ON t.subject_id = s.id " +
                     "LEFT JOIN topics tp ON t.topic_id = tp.id " +
                     "WHERE t.user_id = ? AND t.status IN ('Pending', 'In Progress') " +
                     "ORDER BY t.due_date ASC LIMIT ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            ps.setInt(2, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTask(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TaskDAO] getUpcomingDeadlines error: " + e.getMessage());
        }
        return list;
    }

    public Map<String, Integer> getTaskCounts(int userId) {
        Map<String, Integer> counts = new HashMap<>();
        counts.put("Completed", 0);
        counts.put("Pending", 0);
        counts.put("In Progress", 0);
        counts.put("Overdue", 0);

        String sql = "SELECT " +
                     "SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_cnt, " +
                     "SUM(CASE WHEN status = 'Pending' AND due_date >= CURDATE() THEN 1 ELSE 0 END) as pending_cnt, " +
                     "SUM(CASE WHEN status = 'In Progress' AND due_date >= CURDATE() THEN 1 ELSE 0 END) as inprogress_cnt, " +
                     "SUM(CASE WHEN status != 'Completed' AND due_date < CURDATE() THEN 1 ELSE 0 END) as overdue_cnt " +
                     "FROM tasks WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    counts.put("Completed", rs.getInt("completed_cnt"));
                    counts.put("Pending", rs.getInt("pending_cnt"));
                    counts.put("In Progress", rs.getInt("inprogress_cnt"));
                    counts.put("Overdue", rs.getInt("overdue_cnt"));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TaskDAO] getTaskCounts error: " + e.getMessage());
        }
        return counts;
    }

    private Task mapResultSetToTask(ResultSet rs) throws SQLException {
        Task t = new Task();
        t.setId(rs.getInt("id"));
        t.setUserId(rs.getInt("user_id"));
        int subjId = rs.getInt("subject_id");
        if (!rs.wasNull()) {
            t.setSubjectId(subjId);
        }
        int topId = rs.getInt("topic_id");
        if (!rs.wasNull()) {
            t.setTopicId(topId);
        }
        t.setTitle(rs.getString("title"));
        t.setDescription(rs.getString("description"));
        t.setPriority(rs.getString("priority"));
        t.setDueDate(rs.getDate("due_date"));
        t.setEstimatedMinutes(rs.getInt("estimated_minutes"));
        
        // Auto-detect overdue if due_date < CURDATE() and status != Completed
        String status = rs.getString("status");
        if (!"Completed".equalsIgnoreCase(status) && t.getDueDate() != null) {
            long now = System.currentTimeMillis();
            if (t.getDueDate().getTime() < now - 86400000L) {
                status = "Overdue";
            }
        }
        t.setStatus(status);
        t.setCreatedAt(rs.getTimestamp("created_at"));
        t.setSubjectName(rs.getString("subject_name"));
        t.setTopicName(rs.getString("topic_name"));
        return t;
    }
}
