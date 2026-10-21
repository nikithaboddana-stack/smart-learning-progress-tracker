package com.smartlearning.servlet;

import com.smartlearning.dao.StudySessionDAO;
import com.smartlearning.dao.SubjectDAO;
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
 * Admin Dashboard Controller
 * Displays institutional metrics and overall learning analytics.
 */
@WebServlet(name = "AdminDashboardServlet", urlPatterns = {"/admin/dashboard"})
public class AdminDashboardServlet extends HttpServlet {

    private UserDAO userDAO;
    private SubjectDAO subjectDAO;
    private StudySessionDAO sessionDAO;

    @Override
    public void init() {
        this.userDAO = new UserDAO();
        this.subjectDAO = new SubjectDAO();
        this.sessionDAO = new StudySessionDAO();
    }

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

        List<User> students = userDAO.getAllStudents();
        request.setAttribute("totalStudents", students.size());
        request.setAttribute("studentList", students);
        
        request.getRequestDispatcher("/admin-dashboard.jsp").forward(request, response);
    }
}
