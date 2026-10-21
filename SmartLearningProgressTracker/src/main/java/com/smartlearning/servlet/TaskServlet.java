package com.smartlearning.servlet;

import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TaskDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.Subject;
import com.smartlearning.model.Task;
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
import java.util.List;
import java.util.Map;

/**
 * Controller for Task Management.
 */
@WebServlet("/tasks")
public class TaskServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final TaskDAO taskDAO = new TaskDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String filter = request.getParameter("filter");
        if (filter == null || filter.trim().isEmpty()) {
            filter = "ALL";
        }

        List<Task> tasks = taskDAO.findByUserId(userId, filter);
        Map<String, Integer> counts = taskDAO.getTaskCounts(userId);
        List<Subject> subjects = subjectDAO.findByUserId(userId);
        List<Topic> topics = topicDAO.findByUserId(userId);

        request.setAttribute("tasks", tasks);
        request.setAttribute("counts", counts);
        request.setAttribute("currentFilter", filter);
        request.setAttribute("subjects", subjects);
        request.setAttribute("topics", topics);
        request.getRequestDispatcher("/tasks.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if (action == null) action = "add";

        if ("add".equalsIgnoreCase(action)) {
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String priority = request.getParameter("priority");
            String dueDateStr = request.getParameter("dueDate");
            String estMinStr = request.getParameter("estimatedMinutes");
            String subjectIdStr = request.getParameter("subjectId");
            String topicIdStr = request.getParameter("topicId");

            if (title == null || title.trim().isEmpty() || dueDateStr == null || dueDateStr.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/tasks?error=Title+and+due+date+are+required");
                return;
            }

            Date dueDate = DateUtil.parseDate(dueDateStr);
            int estimatedMinutes = 60;
            if (estMinStr != null && !estMinStr.trim().isEmpty()) {
                try {
                    estimatedMinutes = Integer.parseInt(estMinStr.trim());
                } catch (NumberFormatException ignored) {}
            }

            Integer subjectId = null;
            if (subjectIdStr != null && !subjectIdStr.trim().isEmpty()) {
                try {
                    subjectId = Integer.parseInt(subjectIdStr.trim());
                } catch (NumberFormatException ignored) {}
            }

            Integer topicId = null;
            if (topicIdStr != null && !topicIdStr.trim().isEmpty()) {
                try {
                    topicId = Integer.parseInt(topicIdStr.trim());
                } catch (NumberFormatException ignored) {}
            }

            Task task = new Task();
            task.setUserId(userId);
            task.setSubjectId(subjectId);
            task.setTopicId(topicId);
            task.setTitle(title.trim());
            task.setDescription(description != null ? description.trim() : "");
            task.setPriority(priority != null ? priority : "Medium");
            task.setDueDate(dueDate);
            task.setEstimatedMinutes(estimatedMinutes);
            task.setStatus("Pending");

            taskDAO.create(task);
            response.sendRedirect(request.getContextPath() + "/tasks?msg=Task+created+successfully");

        } else if ("updateStatus".equalsIgnoreCase(action)) {
            try {
                int id = Integer.parseInt(request.getParameter("id"));
                String status = request.getParameter("status");
                taskDAO.updateStatus(id, userId, status);
                response.sendRedirect(request.getContextPath() + "/tasks?msg=Task+status+updated");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/tasks?error=Failed+to+update+status");
            }

        } else if ("delete".equalsIgnoreCase(action)) {
            try {
                int id = Integer.parseInt(request.getParameter("id"));
                taskDAO.delete(id, userId);
                response.sendRedirect(request.getContextPath() + "/tasks?msg=Task+deleted+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/tasks?error=Failed+to+delete+task");
            }
        }
    }
}
