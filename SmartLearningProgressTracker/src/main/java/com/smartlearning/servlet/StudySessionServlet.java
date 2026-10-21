package com.smartlearning.servlet;

import com.smartlearning.dao.StudySessionDAO;
import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.StudySession;
import com.smartlearning.model.Subject;
import com.smartlearning.model.Topic;
import com.smartlearning.util.DateUtil;
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

/**
 * Controller for Study Session tracking.
 */
@WebServlet("/study-sessions")
public class StudySessionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        List<StudySession> sessions = sessionDAO.findByUserId(userId, 50);
        double todayHours = sessionDAO.getTodayHours(userId);
        double weeklyHours = sessionDAO.getWeeklyHours(userId);
        double monthlyHours = sessionDAO.getMonthlyHours(userId);
        double totalHours = sessionDAO.getTotalHours(userId);
        int[] streaks = sessionDAO.calculateStreaks(userId);

        List<Subject> subjects = subjectDAO.findByUserId(userId);
        List<Topic> topics = topicDAO.findByUserId(userId);

        request.setAttribute("sessions", sessions);
        request.setAttribute("todayHours", todayHours);
        request.setAttribute("weeklyHours", weeklyHours);
        request.setAttribute("monthlyHours", monthlyHours);
        request.setAttribute("totalHours", totalHours);
        request.setAttribute("currentStreak", streaks[0]);
        request.setAttribute("longestStreak", streaks[1]);
        request.setAttribute("subjects", subjects);
        request.setAttribute("topics", topics);

        request.getRequestDispatcher("/study-sessions.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if (action == null) action = "add";

        if ("add".equalsIgnoreCase(action)) {
            try {
                int subjectId = Integer.parseInt(request.getParameter("subjectId"));
                String topicIdStr = request.getParameter("topicId");
                Integer topicId = (topicIdStr != null && !topicIdStr.isEmpty()) ? Integer.parseInt(topicIdStr) : null;
                
                String dateStr = request.getParameter("studyDate");
                String startTimeStr = request.getParameter("startTime");
                String endTimeStr = request.getParameter("endTime");
                String durationStr = request.getParameter("durationMinutes");
                String notes = request.getParameter("notes");

                Date studyDate = (dateStr != null && !dateStr.isEmpty()) ? 
                                 DateUtil.parseDate(dateStr) : new Date(System.currentTimeMillis());
                Time startTime = (startTimeStr != null && !startTimeStr.isEmpty()) ? 
                                 DateUtil.parseTime(startTimeStr) : Time.valueOf("09:00:00");
                Time endTime = (endTimeStr != null && !endTimeStr.isEmpty()) ? 
                               DateUtil.parseTime(endTimeStr) : Time.valueOf("10:00:00");

                int duration = 60;
                if (durationStr != null && !durationStr.isEmpty()) {
                    duration = Integer.parseInt(durationStr);
                } else if (startTime != null && endTime != null) {
                    long diffMs = endTime.getTime() - startTime.getTime();
                    if (diffMs > 0) {
                        duration = (int) (diffMs / (1000 * 60));
                    }
                }

                StudySession s = new StudySession();
                s.setUserId(userId);
                s.setSubjectId(subjectId);
                s.setTopicId(topicId);
                s.setStudyDate(studyDate);
                s.setStartTime(startTime);
                s.setEndTime(endTime);
                s.setDurationMinutes(duration);
                s.setNotes(notes != null ? notes.trim() : "");

                sessionDAO.create(s);
                response.sendRedirect(request.getContextPath() + "/study-sessions?msg=Study+session+logged+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/study-sessions?error=Failed+to+log+study+session");
                return;
            }

        } else if ("delete".equalsIgnoreCase(action)) {
            try {
                int id = Integer.parseInt(request.getParameter("id"));
                sessionDAO.delete(id, userId);
                response.sendRedirect(request.getContextPath() + "/study-sessions?msg=Session+deleted+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/study-sessions?error=Failed+to+delete+session");
            }
        }
    }
}
