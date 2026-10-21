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
import java.util.List;

/**
 * Admin Student Management Servlet
 * Handles listing students, filtering, and toggling active/suspended status.
 */
@WebServlet(name = "AdminUsersServlet", urlPatterns = {"/admin/users", "/admin/students"})
public class AdminUsersServlet extends HttpServlet {
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

        String role = (String) session.getAttribute("role");
        if (!"ADMIN".equalsIgnoreCase(role)) {
            response.sendRedirect(request.getContextPath() + "/dashboard?error=unauthorized");
            return;
        }

        String action = request.getParameter("action");
        String idParam = request.getParameter("id");
        if ("toggleStatus".equalsIgnoreCase(action) && idParam != null) {
            try {
                int targetId = Integer.parseInt(idParam);
                User targetUser = userDAO.findById(targetId);
                if (targetUser != null && "STUDENT".equalsIgnoreCase(targetUser.getRole())) {
                    String newStatus = "ACTIVE".equalsIgnoreCase(targetUser.getStatus()) ? "SUSPENDED" : "ACTIVE";
                    userDAO.updateStatus(targetId, newStatus);
                }
            } catch (NumberFormatException ignored) {}
            response.sendRedirect(request.getContextPath() + "/admin/users");
            return;
        }

        List<User> students = userDAO.getAllStudents();
        request.setAttribute("studentList", students);
        request.getRequestDispatcher("/admin-users.jsp").forward(request, response);
    }
}
