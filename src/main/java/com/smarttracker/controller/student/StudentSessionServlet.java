package com.smarttracker.controller.student;

import com.smarttracker.dao.StudySessionDAO;
import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.model.StudentSubject;
import com.smarttracker.model.StudySession;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import java.util.List;

@WebServlet("/student/sessions")
public class StudentSessionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        List<StudySession> sessions = sessionDAO.findByStudentId(studentId, 50);
        double todayHours = sessionDAO.getTodayHours(studentId);
        double weeklyHours = sessionDAO.getWeeklyHours(studentId);
        double totalHours = sessionDAO.getTotalHours(studentId);
        int[] streaks = sessionDAO.calculateStreaks(studentId);

        List<StudentSubject> subjects = subjectDAO.findStudentSubjects(studentId);

        request.setAttribute("sessions", sessions);
        request.setAttribute("todayHours", todayHours);
        request.setAttribute("weeklyHours", weeklyHours);
        request.setAttribute("totalHours", totalHours);
        request.setAttribute("currentStreak", streaks[0]);
        request.setAttribute("longestStreak", streaks[1]);
        request.setAttribute("enrolledSubjects", subjects);

        request.getRequestDispatcher("/WEB-INF/views/student/sessions.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        try {
            int subjectId = Integer.parseInt(request.getParameter("subjectId"));
            int durationMinutes = Integer.parseInt(request.getParameter("durationMinutes"));
            String notes = request.getParameter("notes");
            String dateStr = request.getParameter("studyDate");

            StudySession s = new StudySession();
            s.setStudentId(studentId);
            s.setSubjectId(subjectId);
            s.setDurationMinutes(durationMinutes);
            s.setStudyDate(dateStr != null && !dateStr.isEmpty() ? Date.valueOf(dateStr) : new Date(System.currentTimeMillis()));
            s.setStartTime(Time.valueOf("10:00:00"));
            s.setEndTime(Time.valueOf("11:00:00"));
            s.setNotes(notes != null ? notes.trim() : "");

            sessionDAO.create(s);
            response.sendRedirect(request.getContextPath() + "/student/sessions?msg=Study+session+logged+successfully!");
        } catch (Exception e) {
            response.sendRedirect(request.getContextPath() + "/student/sessions?error=Failed+to+log+session.");
        }
    }
}
