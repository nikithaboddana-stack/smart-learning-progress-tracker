package com.smartlearning.servlet;

import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.Subject;
import com.smartlearning.model.Topic;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

/**
 * Controller for Syllabus Topic Management.
 * Supports CRUD operations, progress sliders, and revision counters.
 */
@WebServlet("/topics")
public class TopicServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final TopicDAO topicDAO = new TopicDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String subjectIdStr = request.getParameter("subjectId");
        List<Topic> topics;
        Integer selectedSubjectId = null;

        if (subjectIdStr != null && !subjectIdStr.trim().isEmpty()) {
            try {
                selectedSubjectId = Integer.parseInt(subjectIdStr.trim());
                topics = topicDAO.findBySubjectId(selectedSubjectId, userId);
            } catch (NumberFormatException e) {
                topics = topicDAO.findByUserId(userId);
            }
        } else {
            topics = topicDAO.findByUserId(userId);
        }

        List<Subject> subjects = subjectDAO.findByUserId(userId);

        request.setAttribute("topics", topics);
        request.setAttribute("subjects", subjects);
        request.setAttribute("selectedSubjectId", selectedSubjectId);
        request.getRequestDispatcher("/topics.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if (action == null) action = "add";

        String redirectSubjectId = request.getParameter("subjectId");
        String redirectUrl = request.getContextPath() + "/topics" + 
                             (redirectSubjectId != null && !redirectSubjectId.isEmpty() ? "?subjectId=" + redirectSubjectId : "");

        if ("add".equalsIgnoreCase(action)) {
            try {
                int subjectId = Integer.parseInt(request.getParameter("subjectId"));
                String name = request.getParameter("name");
                String description = request.getParameter("description");
                String difficulty = request.getParameter("difficulty");
                String status = request.getParameter("status");
                double progress = Double.parseDouble(request.getParameter("progressPercentage"));
                int confidence = Integer.parseInt(request.getParameter("confidenceLevel"));

                Topic t = new Topic();
                t.setSubjectId(subjectId);
                t.setName(name.trim());
                t.setDescription(description != null ? description.trim() : "");
                t.setDifficulty(difficulty != null ? difficulty : "Medium");
                t.setStatus(status != null ? status : "Not Started");
                t.setProgressPercentage(progress);
                t.setConfidenceLevel(confidence);

                topicDAO.create(t);
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "msg=Topic+added+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "error=Invalid+topic+input");
                return;
            }

        } else if ("updateProgress".equalsIgnoreCase(action)) {
            try {
                int topicId = Integer.parseInt(request.getParameter("id"));
                double progress = Double.parseDouble(request.getParameter("progressPercentage"));
                int confidence = Integer.parseInt(request.getParameter("confidenceLevel"));
                String status = (progress >= 100.0) ? "Completed" : (progress > 0.0 ? "In Progress" : "Not Started");

                topicDAO.updateProgress(topicId, userId, progress, status, confidence);
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "msg=Progress+updated");
                return;
            } catch (Exception e) {
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "error=Failed+to+update+progress");
                return;
            }

        } else if ("incrementRevision".equalsIgnoreCase(action)) {
            try {
                int topicId = Integer.parseInt(request.getParameter("id"));
                topicDAO.incrementRevision(topicId, userId);
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "msg=Revision+count+updated");
                return;
            } catch (Exception e) {
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "error=Failed+to+increment+revision");
                return;
            }

        } else if ("edit".equalsIgnoreCase(action)) {
            try {
                int topicId = Integer.parseInt(request.getParameter("id"));
                String name = request.getParameter("name");
                String description = request.getParameter("description");
                String difficulty = request.getParameter("difficulty");
                String status = request.getParameter("status");
                double progress = Double.parseDouble(request.getParameter("progressPercentage"));
                int confidence = Integer.parseInt(request.getParameter("confidenceLevel"));
                int revision = Integer.parseInt(request.getParameter("revisionCount"));

                Topic t = new Topic();
                t.setId(topicId);
                t.setName(name.trim());
                t.setDescription(description != null ? description.trim() : "");
                t.setDifficulty(difficulty);
                t.setStatus(status);
                t.setProgressPercentage(progress);
                t.setConfidenceLevel(confidence);
                t.setRevisionCount(revision);

                topicDAO.update(t, userId);
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "msg=Topic+updated+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "error=Failed+to+update+topic");
                return;
            }

        } else if ("delete".equalsIgnoreCase(action)) {
            try {
                int topicId = Integer.parseInt(request.getParameter("id"));
                topicDAO.delete(topicId, userId);
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "msg=Topic+deleted+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(redirectUrl + (redirectUrl.contains("?") ? "&" : "?") + "error=Failed+to+delete+topic");
                return;
            }
        }
    }
}
