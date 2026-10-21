package com.smarttracker.controller.student;

import com.smarttracker.model.User;
import com.smarttracker.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/student/profile")
public class StudentProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        User user = userService.getUserById(studentId);
        request.setAttribute("user", user);
        request.getRequestDispatcher("/WEB-INF/views/student/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if ("updateProfile".equalsIgnoreCase(action)) {
            String name = request.getParameter("name");
            String phone = request.getParameter("phone");
            String department = request.getParameter("department");
            String course = request.getParameter("course");
            String semester = request.getParameter("semester");

            User u = new User();
            u.setId(studentId);
            u.setName(name != null ? name.trim() : "");
            u.setPhone(phone != null ? phone.trim() : "");
            u.setDepartment(department != null ? department.trim() : "");
            u.setCourse(course != null ? course.trim() : "");
            u.setSemester(semester != null ? semester.trim() : "");

            userService.updateProfile(u);
            session.setAttribute("userName", u.getName());
            session.setAttribute("userFirstName", u.getFirstName());

            response.sendRedirect(request.getContextPath() + "/student/profile?msg=Profile+updated+successfully!");
        } else if ("changePassword".equalsIgnoreCase(action)) {
            String curPass = request.getParameter("currentPassword");
            String newPass = request.getParameter("newPassword");
            String confPass = request.getParameter("confirmPassword");

            if (!newPass.equals(confPass)) {
                response.sendRedirect(request.getContextPath() + "/student/profile?error=New+passwords+do+not+match.");
                return;
            }

            boolean changed = userService.changePassword(studentId, curPass, newPass);
            if (changed) {
                response.sendRedirect(request.getContextPath() + "/student/profile?msg=Password+changed+successfully!");
            } else {
                response.sendRedirect(request.getContextPath() + "/student/profile?error=Current+password+incorrect.");
            }
        }
    }
}
