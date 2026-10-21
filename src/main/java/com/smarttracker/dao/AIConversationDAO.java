package com.smarttracker.dao;

import com.smarttracker.model.AIMessage;
import com.smarttracker.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AIConversationDAO {

    public int getOrCreateConversation(int studentId) {
        String findSql = "SELECT id FROM ai_conversations WHERE student_id = ? ORDER BY id DESC LIMIT 1";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(findSql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            System.err.println("[AIConversationDAO] find conversation error: " + e.getMessage());
        }

        // Create new
        String insertSql = "INSERT INTO ai_conversations (student_id, title, created_at) VALUES (?, 'Academic Consultation', NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, studentId);
            if (ps.executeUpdate() > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            System.err.println("[AIConversationDAO] create conversation error: " + e.getMessage());
        }
        return 1;
    }

    public List<AIMessage> getRecentMessages(int conversationId, int limit) {
        List<AIMessage> list = new ArrayList<>();
        String sql = "SELECT * FROM (SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, conversationId);
            ps.setInt(2, limit > 0 ? limit : 20);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    AIMessage m = new AIMessage();
                    m.setId(rs.getInt("id"));
                    m.setConversationId(rs.getInt("conversation_id"));
                    m.setSender(rs.getString("sender"));
                    m.setMessage(rs.getString("message"));
                    m.setTimestamp(rs.getTimestamp("timestamp"));
                    list.add(m);
                }
            }
        } catch (SQLException e) {
            System.err.println("[AIConversationDAO] getRecentMessages error: " + e.getMessage());
        }
        return list;
    }

    public boolean saveMessage(int conversationId, String sender, String message) {
        String sql = "INSERT INTO ai_messages (conversation_id, sender, message, timestamp) VALUES (?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, conversationId);
            ps.setString(2, sender);
            ps.setString(3, message);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AIConversationDAO] saveMessage error: " + e.getMessage());
        }
        return false;
    }

    public boolean clearConversation(int conversationId) {
        String sql = "DELETE FROM ai_messages WHERE conversation_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, conversationId);
            return ps.executeUpdate() >= 0;
        } catch (SQLException e) {
            System.err.println("[AIConversationDAO] clearConversation error: " + e.getMessage());
        }
        return false;
    }
}
