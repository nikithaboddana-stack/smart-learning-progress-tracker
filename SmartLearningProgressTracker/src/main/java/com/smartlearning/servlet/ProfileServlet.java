package com.smartlearning.servlet;

import com.smartlearning.dao.UserDAO;
import com.smartlearning.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Handles Student & Admin Profile display and profile editing.
 */
@WebServlet(name = "ProfileServlet", urlPatterns = {"/profile", "/student/profile"})
public class ProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=auth");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        User user = userDAO.findById(userId);
        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        request.setAttribute("user", user);
        request.getRequestDispatcher("/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=auth");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        User user = userDAO.findById(userId);
        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        String name = request.getParameter("name");
        String phone = request.getParameter("phone");
        String department = request.getParameter("department");
        String course = request.getParameter("course");
        String semester = request.getParameter("semester");

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
            session.setAttribute("userName", name.trim());
        }
        if (phone != null) user.setPhone(phone.trim());
        if (department != null) user.setDepartment(department.trim());
        if (course != null) user.setCourse(course.trim());
        if (semester != null) user.setSemester(semester.trim());

        boolean updated = userDAO.updateProfile(user);
        if (updated) {
            request.setAttribute("successMessage", "Profile updated successfully!");
        } else {
            request.setAttribute("errorMessage", "Failed to update profile. Please try again.");
        }

        request.setAttribute("user", user);
        request.getRequestDispatcher("/profile.jsp").forward(request, response);
    }
}
