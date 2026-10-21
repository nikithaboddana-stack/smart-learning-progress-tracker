package com.smarttracker.controller.student;

import com.smarttracker.dao.TestDAO;
import com.smarttracker.model.Test;
import com.smarttracker.model.TestResult;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/student/marks")
public class StudentMarksServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final TestDAO testDAO = new TestDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        List<TestResult> results = testDAO.findStudentTestResults(studentId);
        List<Test> upcoming = testDAO.findUpcomingTestsForStudent(studentId, 10);
        double avgScore = testDAO.calculateStudentAverage(studentId);

        request.setAttribute("testResults", results);
        request.setAttribute("upcomingTests", upcoming);
        request.setAttribute("averageScore", avgScore);
        request.getRequestDispatcher("/WEB-INF/views/student/marks.jsp").forward(request, response);
    }
}
