package com.smartlearning.servlet;

import com.smartlearning.dao.UserDAO;
import com.smartlearning.model.User;
import com.smartlearning.util.PasswordUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Handles student & admin authentication and session establishment.
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/login", "/student/login", "/admin/login"})
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("userId") != null) {
            String role = (String) session.getAttribute("role");
            if ("ADMIN".equalsIgnoreCase(role)) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard");
            }
            return;
        }
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String identifier = request.getParameter("email");
        if (identifier == null || identifier.trim().isEmpty()) {
            identifier = request.getParameter("username");
        }
        String password = request.getParameter("password");

        if (identifier == null || identifier.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("error", "Username/Email and password are required.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        User user = userDAO.findByEmailOrUsername(identifier.trim());

        if (user != null && PasswordUtil.verifyPassword(password, user.getPasswordHash(), user.getSalt())) {
            if ("SUSPENDED".equalsIgnoreCase(user.getStatus()) || "INACTIVE".equalsIgnoreCase(user.getStatus())) {
                request.setAttribute("error", "Your account is currently inactive or suspended. Please contact the administrator.");
                request.getRequestDispatcher("/login.jsp").forward(request, response);
                return;
            }

            // Establish authenticated session
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getName());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("role", user.getRole());
            session.setAttribute("department", user.getDepartment());
            session.setAttribute("semester", user.getSemester());

            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard");
            }
        } else {
            request.setAttribute("error", "Invalid username/email or password. Please try again.");
            request.setAttribute("email", identifier);
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}
