package com.smartlearning.dao;

import com.smartlearning.model.User;
import com.smartlearning.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for User entity.
 * Handles authentication, registration, student listing, and profile queries.
 */
public class UserDAO {

    public boolean register(User user) {
        String sql = "INSERT INTO users (name, username, email, password_hash, salt, role, phone, department, course, semester, status, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setString(1, user.getName());
            ps.setString(2, user.getUsername() != null ? user.getUsername().trim().toLowerCase() : user.getEmail().split("@")[0]);
            ps.setString(3, user.getEmail().trim().toLowerCase());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getSalt() != null ? user.getSalt() : "sha256");
            ps.setString(6, user.getRole() != null ? user.getRole() : "STUDENT");
            ps.setString(7, user.getPhone());
            ps.setString(8, user.getDepartment());
            ps.setString(9, user.getCourse());
            ps.setString(10, user.getSemester());
            ps.setString(11, user.getStatus() != null ? user.getStatus() : "ACTIVE");

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        user.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] register error: " + e.getMessage());
        }
        return false;
    }

    public User findByEmailOrUsername(String identifier) {
        String sql = "SELECT id, name, username, email, password_hash, salt, role, phone, department, course, semester, status, created_at " +
                     "FROM users WHERE email = ? OR username = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            String idStr = identifier.trim().toLowerCase();
            ps.setString(1, idStr);
            ps.setString(2, idStr);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] findByEmailOrUsername error: " + e.getMessage());
        }
        return null;
    }

    public User findByEmail(String email) {
        return findByEmailOrUsername(email);
    }

    public User findById(int id) {
        String sql = "SELECT id, name, username, email, password_hash, salt, role, phone, department, course, semester, status, created_at " +
                     "FROM users WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] findById error: " + e.getMessage());
        }
        return null;
    }

    public List<User> getAllStudents() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT id, name, username, email, password_hash, salt, role, phone, department, course, semester, status, created_at " +
                     "FROM users WHERE role = 'STUDENT' ORDER BY id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                list.add(mapUser(rs));
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] getAllStudents error: " + e.getMessage());
        }
        return list;
    }

    public boolean updateStatus(int userId, String newStatus) {
        String sql = "UPDATE users SET status = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newStatus);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[UserDAO] updateStatus error: " + e.getMessage());
        }
        return false;
    }

    public boolean updateProfile(User user) {
        String sql = "UPDATE users SET name = ?, phone = ?, department = ?, course = ?, semester = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, user.getName());
            ps.setString(2, user.getPhone());
            ps.setString(3, user.getDepartment());
            ps.setString(4, user.getCourse());
            ps.setString(5, user.getSemester());
            ps.setInt(6, user.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[UserDAO] updateProfile error: " + e.getMessage());
        }
        return false;
    }

    public boolean updatePassword(int userId, String newPasswordHash, String newSalt) {
        String sql = "UPDATE users SET password_hash = ?, salt = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, newPasswordHash);
            ps.setString(2, newSalt);
            ps.setInt(3, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[UserDAO] updatePassword error: " + e.getMessage());
        }
        return false;
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setSalt(rs.getString("salt"));
        user.setRole(rs.getString("role"));
        user.setPhone(rs.getString("phone"));
        user.setDepartment(rs.getString("department"));
        user.setCourse(rs.getString("course"));
        user.setSemester(rs.getString("semester"));
        user.setStatus(rs.getString("status"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        return user;
    }
}
