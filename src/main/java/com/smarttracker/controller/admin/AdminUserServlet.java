package com.smarttracker.controller.admin;

import com.smarttracker.dao.UserDAO;
import com.smarttracker.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/admin/students")
public class AdminUserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String search = request.getParameter("search");
        List<User> students = userDAO.findAllStudents(search);
        request.setAttribute("students", students);
        request.setAttribute("searchKeyword", search);
        request.getRequestDispatcher("/WEB-INF/views/admin/users.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        int userId = Integer.parseInt(request.getParameter("userId"));

        if ("toggleStatus".equalsIgnoreCase(action)) {
            String newStatus = request.getParameter("status");
            userDAO.updateStatus(userId, newStatus);
            response.sendRedirect(request.getContextPath() + "/admin/students?msg=Student+status+updated.");
        } else if ("delete".equalsIgnoreCase(action)) {
            userDAO.deleteUser(userId);
            response.sendRedirect(request.getContextPath() + "/admin/students?msg=Student+record+deleted.");
        }
    }
}
