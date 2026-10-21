package com.smartlearning.servlet;

import com.smartlearning.service.RecommendationService;
import com.smartlearning.service.StudyPlannerService;
import com.smartlearning.util.DateUtil;
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

/**
 * Controller for the Rule-Based AI Assistant and Study Plan Generator.
 */
@WebServlet("/assistant")
public class AssistantServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final RecommendationService recommendationService = new RecommendationService();
    private final StudyPlannerService plannerService = new StudyPlannerService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String queryType = request.getParameter("queryType");
        if (queryType != null && !queryType.trim().isEmpty()) {
            String answer = recommendationService.answerAssistantQuery(userId, queryType);
            request.setAttribute("selectedQuery", queryType);
            request.setAttribute("assistantResponse", answer);
        }

        request.getRequestDispatcher("/assistant.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if ("generatePlan".equalsIgnoreCase(action)) {
            String hoursStr = request.getParameter("weeklyHours");
            String examDateStr = request.getParameter("examDate");

            double weeklyHours = 14.0;
            if (hoursStr != null && !hoursStr.trim().isEmpty()) {
                try {
                    weeklyHours = Double.parseDouble(hoursStr.trim());
                } catch (NumberFormatException ignored) {}
            }

            LocalDate examDate = null;
            if (examDateStr != null && !examDateStr.trim().isEmpty()) {
                Date d = DateUtil.parseDate(examDateStr);
                if (d != null) {
                    examDate = d.toLocalDate();
                }
            }

            List<StudyPlannerService.PlanItem> plan = plannerService.generatePlan(userId, weeklyHours, examDate);
            request.setAttribute("studyPlan", plan);
            request.setAttribute("weeklyHours", weeklyHours);
            request.setAttribute("examDate", examDateStr);
        } else {
            String queryType = request.getParameter("queryType");
            if (queryType != null) {
                String answer = recommendationService.answerAssistantQuery(userId, queryType);
                request.setAttribute("selectedQuery", queryType);
                request.setAttribute("assistantResponse", answer);
            }
        }

        request.getRequestDispatcher("/assistant.jsp").forward(request, response);
    }
}
