package com.smarttracker.controller.admin;

import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.model.Subject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/admin/subjects")
public class AdminSubjectServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final SubjectDAO subjectDAO = new SubjectDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<Subject> subjects = subjectDAO.findAllMasterSubjects();
        request.setAttribute("masterSubjects", subjects);
        request.getRequestDispatcher("/WEB-INF/views/admin/subjects.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("add".equalsIgnoreCase(action)) {
            String name = request.getParameter("name");
            String code = request.getParameter("code");
            String faculty = request.getParameter("faculty");
            String department = request.getParameter("department");
            int credits = Integer.parseInt(request.getParameter("credits"));

            Subject s = new Subject();
            s.setName(name);
            s.setCode(code);
            s.setFaculty(faculty);
            s.setDepartment(department);
            s.setCredits(credits);

            subjectDAO.createMasterSubject(s);
            response.sendRedirect(request.getContextPath() + "/admin/subjects?msg=Subject+added+successfully!");
        } else if ("delete".equalsIgnoreCase(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            subjectDAO.deleteMasterSubject(id);
            response.sendRedirect(request.getContextPath() + "/admin/subjects?msg=Subject+deleted.");
        }
    }
}
