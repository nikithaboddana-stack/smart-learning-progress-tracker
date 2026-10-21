package com.smarttracker.controller.auth;

import com.smarttracker.model.User;
import com.smarttracker.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/views/auth/register.jsp").forward(request, response);
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

        User user = new User();
        user.setName(name != null ? name.trim() : "");
        user.setUsername(username != null ? username.trim() : "");
        user.setEmail(email != null ? email.trim() : "");
        user.setPhone(phone != null ? phone.trim() : "");
        user.setDepartment(department != null ? department.trim() : "Computer Science & Engineering");
        user.setCourse(course != null ? course.trim() : "B.Tech");
        user.setSemester(semester != null ? semester.trim() : "6th Semester");

        String errorMsg = userService.register(user, password, confirmPassword);

        if (errorMsg == null) {
            response.sendRedirect(request.getContextPath() + "/login?msg=Account+created+successfully!+Please+log+in.");
        } else {
            request.setAttribute("error", errorMsg);
            request.setAttribute("user", user);
            request.getRequestDispatcher("/WEB-INF/views/auth/register.jsp").forward(request, response);
        }
    }
}
