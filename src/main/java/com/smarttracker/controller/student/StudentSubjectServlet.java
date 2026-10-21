package com.smarttracker.controller.student;

import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.model.StudentSubject;
import com.smarttracker.model.Subject;
import com.smarttracker.model.Topic;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/student/subjects")
public class StudentSubjectServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final SubjectDAO subjectDAO = new SubjectDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if ("topics".equalsIgnoreCase(action)) {
            int subjectId = Integer.parseInt(request.getParameter("subjectId"));
            List<Topic> topics = subjectDAO.findTopicsBySubjectId(subjectId, studentId);
            request.setAttribute("topics", topics);
            request.setAttribute("subjectId", subjectId);
            request.getRequestDispatcher("/WEB-INF/views/student/topics.jsp").forward(request, response);
            return;
        }

        List<StudentSubject> enrolled = subjectDAO.findStudentSubjects(studentId);
        List<Subject> available = subjectDAO.findAllMasterSubjects();

        request.setAttribute("enrolledSubjects", enrolled);
        request.setAttribute("availableSubjects", available);
        request.getRequestDispatcher("/WEB-INF/views/student/subjects.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if ("enroll".equalsIgnoreCase(action)) {
            int subjectId = Integer.parseInt(request.getParameter("subjectId"));
            double target = Double.parseDouble(request.getParameter("targetPercentage"));
            String priority = request.getParameter("priority");

            subjectDAO.enrollStudentSubject(studentId, subjectId, target, priority);
            response.sendRedirect(request.getContextPath() + "/student/subjects?msg=Enrolled+successfully!");
        } else if ("updateTopic".equalsIgnoreCase(action)) {
            int topicId = Integer.parseInt(request.getParameter("topicId"));
            int subjectId = Integer.parseInt(request.getParameter("subjectId"));
            double progress = Double.parseDouble(request.getParameter("progressPercentage"));
            int confidence = Integer.parseInt(request.getParameter("confidenceLevel"));
            String status = progress >= 100.0 ? "COMPLETED" : (progress > 0.0 ? "IN_PROGRESS" : "NOT_STARTED");

            subjectDAO.updateTopicProgress(studentId, topicId, status, progress, confidence);
            response.sendRedirect(request.getContextPath() + "/student/subjects?action=topics&subjectId=" + subjectId + "&msg=Topic+progress+saved!");
        } else if ("drop".equalsIgnoreCase(action)) {
            int subjectId = Integer.parseInt(request.getParameter("subjectId"));
            subjectDAO.removeStudentSubject(studentId, subjectId);
            response.sendRedirect(request.getContextPath() + "/student/subjects?msg=Subject+removed.");
        }
    }
}
