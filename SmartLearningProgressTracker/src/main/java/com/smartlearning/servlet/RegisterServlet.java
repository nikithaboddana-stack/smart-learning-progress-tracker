package com.smartlearning.servlet;

import com.smartlearning.dao.UserDAO;
import com.smartlearning.model.User;
import com.smartlearning.util.PasswordUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Handles student registration and account creation with salted password hashing.
 * Supports Full name, username, email, password, phone, department/course, and semester.
 */
@WebServlet(name = "RegisterServlet", urlPatterns = {"/register", "/student/register"})
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.getRequestDispatcher("/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String phone = request.getParameter("phone");
        String department = request.getParameter("department");
        String course = request.getParameter("course");
        String semester = request.getParameter("semester");

        // Server-side validation
        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            request.setAttribute("error", "Full Name, Email, and Password are required.");
            forwardBack(request, response, name, username, email, phone, department, semester);
            return;
        }

        if (username == null || username.trim().isEmpty()) {
            username = email.split("@")[0];
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            request.setAttribute("error", "Please enter a valid email address.");
            forwardBack(request, response, name, username, email, phone, department, semester);
            return;
        }

        if (password.length() < 6) {
            request.setAttribute("error", "Password must be at least 6 characters long.");
            forwardBack(request, response, name, username, email, phone, department, semester);
            return;
        }

        if (!password.equals(confirmPassword)) {
            request.setAttribute("error", "Passwords do not match.");
            forwardBack(request, response, name, username, email, phone, department, semester);
            return;
        }

        if (userDAO.findByEmailOrUsername(email) != null) {
            request.setAttribute("error", "An account with this email address already exists.");
            forwardBack(request, response, name, username, email, phone, department, semester);
            return;
        }

        if (userDAO.findByEmailOrUsername(username) != null) {
            request.setAttribute("error", "This username is already taken. Please choose another.");
            forwardBack(request, response, name, username, email, phone, department, semester);
            return;
        }

        // Generate salt and hash password
        String salt = PasswordUtil.generateSalt();
        String hash = PasswordUtil.hashPassword(password, salt);

        User newUser = new User();
        newUser.setName(name.trim());
        newUser.setUsername(username.trim().toLowerCase());
        newUser.setEmail(email.trim().toLowerCase());
        newUser.setPasswordHash(hash);
        newUser.setSalt(salt);
        newUser.setRole("STUDENT");
        newUser.setPhone(phone != null ? phone.trim() : "");
        newUser.setDepartment(department != null ? department.trim() : "Computer Science & Engineering");
        newUser.setCourse(course != null ? course.trim() : "B.Tech");
        newUser.setSemester(semester != null ? semester.trim() : "6th Semester");
        newUser.setStatus("ACTIVE");

        boolean success = userDAO.register(newUser);
        if (success) {
            response.sendRedirect(request.getContextPath() + "/login?msg=Account+created+successfully.+Please+sign+in.");
        } else {
            request.setAttribute("error", "Registration failed due to a database error. Please try again.");
            forwardBack(request, response, name, username, email, phone, department, semester);
        }
    }

    private void forwardBack(HttpServletRequest request, HttpServletResponse response, 
                             String name, String username, String email, String phone, 
                             String department, String semester) 
            throws ServletException, IOException {
        request.setAttribute("name", name);
        request.setAttribute("username", username);
        request.setAttribute("email", email);
        request.setAttribute("phone", phone);
        request.setAttribute("department", department);
        request.setAttribute("semester", semester);
        request.getRequestDispatcher("/register.jsp").forward(request, response);
    }
}
