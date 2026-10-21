package com.smarttracker.controller.admin;

import com.smarttracker.dao.StudySessionDAO;
import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.dao.TestDAO;
import com.smarttracker.dao.UserDAO;
import com.smarttracker.model.AdminDashboardDTO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final UserDAO userDAO = new UserDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TestDAO testDAO = new TestDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        AdminDashboardDTO dto = new AdminDashboardDTO();
        dto.setTotalStudents(userDAO.countStudents(false));
        dto.setActiveStudents(userDAO.countStudents(true));
        dto.setTotalSubjects(subjectDAO.countSubjects());
        dto.setTestsConducted(testDAO.countTests());
        dto.setInstitutionalAverage(testDAO.calculateInstitutionalAverage());
        dto.setTotalStudySessionsLogged(sessionDAO.countTotalSessions());
        dto.setRecentStudents(userDAO.findAllStudents(null));
        dto.setSubjects(subjectDAO.findAllMasterSubjects());

        request.setAttribute("adminDashboard", dto);
        request.getRequestDispatcher("/WEB-INF/views/admin/dashboard.jsp").forward(request, response);
    }
}
