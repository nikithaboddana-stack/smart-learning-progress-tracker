package com.smarttracker.controller.student;

import com.smarttracker.dao.StudySessionDAO;
import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.dao.TestDAO;
import com.smarttracker.model.StudentSubject;
import com.smarttracker.model.TestResult;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/student/analytics")
public class StudentAnalyticsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TestDAO testDAO = new TestDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        List<StudentSubject> subjects = subjectDAO.findStudentSubjects(studentId);
        List<TestResult> results = testDAO.findStudentTestResults(studentId);
        double overallScore = testDAO.calculateStudentAverage(studentId);
        double weeklyHours = sessionDAO.getWeeklyHours(studentId);
        double totalHours = sessionDAO.getTotalHours(studentId);
        int[] streaks = sessionDAO.calculateStreaks(studentId);

        List<StudentSubject> strong = new ArrayList<>();
        List<StudentSubject> weak = new ArrayList<>();

        for (StudentSubject ss : subjects) {
            if (ss.getCurrentPercentage() >= 75.0) strong.add(ss);
            else if (ss.isLagging() || ss.getCurrentPercentage() < 60.0) weak.add(ss);
        }

        request.setAttribute("subjects", subjects);
        request.setAttribute("testResults", results);
        request.setAttribute("overallScore", overallScore);
        request.setAttribute("weeklyHours", weeklyHours);
        request.setAttribute("totalHours", totalHours);
        request.setAttribute("currentStreak", streaks[0]);
        request.setAttribute("strongSubjects", strong);
        request.setAttribute("weakSubjects", weak);

        request.getRequestDispatcher("/WEB-INF/views/student/analytics.jsp").forward(request, response);
    }
}
