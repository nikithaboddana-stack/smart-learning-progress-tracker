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
 * Controller for Subject Management module.
 * Supports CRUD operations and detailed subject syllabus views.
 */
@WebServlet("/subjects")
public class SubjectServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if (action == null) action = "list";

        if ("view".equalsIgnoreCase(action)) {
            String idStr = request.getParameter("id");
            if (idStr != null) {
                try {
                    int subjectId = Integer.parseInt(idStr);
                    Subject subject = subjectDAO.findById(subjectId, userId);
                    if (subject != null) {
                        List<Topic> topics = topicDAO.findBySubjectId(subjectId, userId);
                        request.setAttribute("subject", subject);
                        request.setAttribute("topics", topics);
                        request.getRequestDispatcher("/subject-details.jsp").forward(request, response);
                        return;
                    }
                } catch (NumberFormatException ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/subjects?error=Subject+not+found");
            return;
        }

        // Default list action
        List<Subject> subjects = subjectDAO.findByUserId(userId);
        request.setAttribute("subjects", subjects);
        request.getRequestDispatcher("/subjects.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if (action == null) action = "add";

        if ("add".equalsIgnoreCase(action)) {
            String name = request.getParameter("name");
            String description = request.getParameter("description");
            String priority = request.getParameter("priority");
            String targetPctStr = request.getParameter("targetPercentage");

            if (name == null || name.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/subjects?error=Subject+name+is+required");
                return;
            }

            double targetPct = 75.0;
            if (targetPctStr != null && !targetPctStr.trim().isEmpty()) {
                try {
                    targetPct = Double.parseDouble(targetPctStr.trim());
                } catch (NumberFormatException ignored) {}
            }

            Subject s = new Subject();
            s.setUserId(userId);
            s.setName(name.trim());
            s.setDescription(description != null ? description.trim() : "");
            s.setPriority(priority != null ? priority : "Medium");
            s.setTargetPercentage(targetPct);

            subjectDAO.create(s);
            response.sendRedirect(request.getContextPath() + "/subjects?msg=Subject+added+successfully");

        } else if ("edit".equalsIgnoreCase(action)) {
            String idStr = request.getParameter("id");
            String name = request.getParameter("name");
            String description = request.getParameter("description");
            String priority = request.getParameter("priority");
            String targetPctStr = request.getParameter("targetPercentage");

            if (idStr != null && name != null && !name.trim().isEmpty()) {
                try {
                    int id = Integer.parseInt(idStr);
                    double targetPct = Double.parseDouble(targetPctStr);
                    Subject s = new Subject();
                    s.setId(id);
                    s.setUserId(userId);
                    s.setName(name.trim());
                    s.setDescription(description != null ? description.trim() : "");
                    s.setPriority(priority);
                    s.setTargetPercentage(targetPct);

                    subjectDAO.update(s);
                    response.sendRedirect(request.getContextPath() + "/subjects?msg=Subject+updated+successfully");
                    return;
                } catch (Exception ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/subjects?error=Failed+to+update+subject");

        } else if ("delete".equalsIgnoreCase(action)) {
            String idStr = request.getParameter("id");
            if (idStr != null) {
                try {
                    int id = Integer.parseInt(idStr);
                    subjectDAO.delete(id, userId);
                    response.sendRedirect(request.getContextPath() + "/subjects?msg=Subject+deleted+successfully");
                    return;
                } catch (NumberFormatException ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/subjects?error=Failed+to+delete+subject");
        }
    }
}
