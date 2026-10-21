package com.smarttracker.dao;

import com.smarttracker.model.StudyPlan;
import com.smarttracker.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudyPlanDAO {

    public List<StudyPlan> findByStudentId(int studentId) {
        List<StudyPlan> list = new ArrayList<>();
        String sql = "SELECT sp.*, s.name as subject_name, ss.priority as subject_priority " +
                     "FROM study_plans sp " +
                     "JOIN subjects s ON sp.subject_id = s.id " +
                     "LEFT JOIN student_subjects ss ON (s.id = ss.subject_id AND ss.student_id = ?) " +
                     "WHERE sp.student_id = ? ORDER BY sp.plan_date ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, studentId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    StudyPlan p = new StudyPlan();
                    p.setId(rs.getInt("id"));
                    p.setStudentId(rs.getInt("student_id"));
                    p.setSubjectId(rs.getInt("subject_id"));
                    p.setDayOfWeek(rs.getString("day_of_week"));
                    p.setPlanDate(rs.getDate("plan_date"));
                    p.setPlannedMinutes(rs.getInt("planned_minutes"));
                    p.setFocusNotes(rs.getString("focus_notes"));
                    p.setStatus(rs.getString("status"));
                    p.setCreatedAt(rs.getTimestamp("created_at"));
                    p.setSubjectName(rs.getString("subject_name"));
                    p.setSubjectPriority(rs.getString("subject_priority"));
                    list.add(p);
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudyPlanDAO] findByStudentId error: " + e.getMessage());
        }
        return list;
    }

    public List<StudyPlan> findTodayPlans(int studentId) {
        List<StudyPlan> list = new ArrayList<>();
        String sql = "SELECT sp.*, s.name as subject_name, ss.priority as subject_priority " +
                     "FROM study_plans sp " +
                     "JOIN subjects s ON sp.subject_id = s.id " +
                     "LEFT JOIN student_subjects ss ON (s.id = ss.subject_id AND ss.student_id = ?) " +
                     "WHERE sp.student_id = ? AND sp.plan_date = CURDATE() ORDER BY sp.id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, studentId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    StudyPlan p = new StudyPlan();
                    p.setId(rs.getInt("id"));
                    p.setStudentId(rs.getInt("student_id"));
                    p.setSubjectId(rs.getInt("subject_id"));
                    p.setDayOfWeek(rs.getString("day_of_week"));
                    p.setPlanDate(rs.getDate("plan_date"));
                    p.setPlannedMinutes(rs.getInt("planned_minutes"));
                    p.setFocusNotes(rs.getString("focus_notes"));
                    p.setStatus(rs.getString("status"));
                    p.setCreatedAt(rs.getTimestamp("created_at"));
                    p.setSubjectName(rs.getString("subject_name"));
                    p.setSubjectPriority(rs.getString("subject_priority"));
                    list.add(p);
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudyPlanDAO] findTodayPlans error: " + e.getMessage());
        }
        return list;
    }

    public boolean create(StudyPlan p) {
        String sql = "INSERT INTO study_plans (student_id, subject_id, day_of_week, plan_date, planned_minutes, focus_notes, status, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, p.getStudentId());
            ps.setInt(2, p.getSubjectId());
            ps.setString(3, p.getDayOfWeek());
            ps.setDate(4, p.getPlanDate());
            ps.setInt(5, p.getPlannedMinutes());
            ps.setString(6, p.getFocusNotes());
            ps.setString(7, p.getStatus());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[StudyPlanDAO] create error: " + e.getMessage());
        }
        return false;
    }

    public boolean updateStatus(int planId, int studentId, String status) {
        String sql = "UPDATE study_plans SET status = ? WHERE id = ? AND student_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, planId);
            ps.setInt(3, studentId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[StudyPlanDAO] updateStatus error: " + e.getMessage());
        }
        return false;
    }

    public boolean delete(int planId, int studentId) {
        String sql = "DELETE FROM study_plans WHERE id = ? AND student_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, planId);
            ps.setInt(2, studentId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[StudyPlanDAO] delete error: " + e.getMessage());
        }
        return false;
    }
}
