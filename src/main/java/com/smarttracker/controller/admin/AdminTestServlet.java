package com.smarttracker.controller.admin;

import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.dao.TestDAO;
import com.smarttracker.dao.UserDAO;
import com.smarttracker.model.Subject;
import com.smarttracker.model.Test;
import com.smarttracker.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@WebServlet("/admin/tests")
public class AdminTestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final TestDAO testDAO = new TestDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<Test> tests = testDAO.findAllTests();
        List<Subject> subjects = subjectDAO.findAllMasterSubjects();
        List<User> students = userDAO.findAllStudents(null);

        request.setAttribute("tests", tests);
        request.setAttribute("subjects", subjects);
        request.setAttribute("students", students);
        request.getRequestDispatcher("/WEB-INF/views/admin/tests.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int adminId = (Integer) session.getAttribute("userId");
        String action = request.getParameter("action");

        if ("createTest".equalsIgnoreCase(action)) {
            int subjectId = Integer.parseInt(request.getParameter("subjectId"));
            String testName = request.getParameter("testName");
            String testDateStr = request.getParameter("testDate");
            double maxMarks = Double.parseDouble(request.getParameter("maxMarks"));
            String testType = request.getParameter("testType");

            Test t = new Test();
            t.setSubjectId(subjectId);
            t.setTestName(testName);
            t.setTestDate(Date.valueOf(testDateStr));
            t.setMaxMarks(maxMarks);
            t.setTestType(testType);
            t.setCreatedBy(adminId);

            testDAO.createTest(t);
            response.sendRedirect(request.getContextPath() + "/admin/tests?msg=Test+scheduled+successfully!");
        } else if ("gradeSubmission".equalsIgnoreCase(action)) {
            int testId = Integer.parseInt(request.getParameter("testId"));
            int studentId = Integer.parseInt(request.getParameter("studentId"));
            double marks = Double.parseDouble(request.getParameter("marksObtained"));
            String feedback = request.getParameter("feedback");

            testDAO.recordTestResult(testId, studentId, marks, feedback);
            response.sendRedirect(request.getContextPath() + "/admin/tests?msg=Grade+recorded+for+student!");
        }
    }
}
