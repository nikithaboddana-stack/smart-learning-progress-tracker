package com.smarttracker.controller.student;

import com.smarttracker.dao.StudyPlanDAO;
import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.model.StudentSubject;
import com.smarttracker.model.StudyPlan;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@WebServlet("/student/planner")
public class StudentPlannerServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final StudyPlanDAO planDAO = new StudyPlanDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        List<StudyPlan> plans = planDAO.findByStudentId(studentId);
        List<StudentSubject> subjects = subjectDAO.findStudentSubjects(studentId);

        request.setAttribute("studyPlans", plans);
        request.setAttribute("subjects", subjects);
        request.getRequestDispatcher("/WEB-INF/views/student/planner.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if ("add".equalsIgnoreCase(action)) {
            try {
                int subjectId = Integer.parseInt(request.getParameter("subjectId"));
                String dayOfWeek = request.getParameter("dayOfWeek");
                String dateStr = request.getParameter("planDate");
                int minutes = Integer.parseInt(request.getParameter("plannedMinutes"));
                String notes = request.getParameter("focusNotes");

                StudyPlan p = new StudyPlan();
                p.setStudentId(studentId);
                p.setSubjectId(subjectId);
                p.setDayOfWeek(dayOfWeek);
                p.setPlanDate(Date.valueOf(dateStr));
                p.setPlannedMinutes(minutes);
                p.setFocusNotes(notes != null ? notes.trim() : "");
                p.setStatus("PENDING");

                planDAO.create(p);
                response.sendRedirect(request.getContextPath() + "/student/planner?msg=Plan+added!");
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/student/planner?error=Invalid+plan+details.");
            }
        } else if ("toggle".equalsIgnoreCase(action)) {
            int planId = Integer.parseInt(request.getParameter("planId"));
            String status = request.getParameter("status");
            planDAO.updateStatus(planId, studentId, status);
            response.sendRedirect(request.getContextPath() + "/student/planner?msg=Plan+status+updated!");
        } else if ("delete".equalsIgnoreCase(action)) {
            int planId = Integer.parseInt(request.getParameter("planId"));
            planDAO.delete(planId, studentId);
            response.sendRedirect(request.getContextPath() + "/student/planner?msg=Plan+deleted.");
        }
    }
}
