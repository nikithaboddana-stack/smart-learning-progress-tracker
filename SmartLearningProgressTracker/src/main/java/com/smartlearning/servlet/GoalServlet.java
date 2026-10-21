package com.smartlearning.servlet;

import com.smartlearning.dao.GoalDAO;
import com.smartlearning.model.Goal;
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

/**
 * Controller for Learning Goals Management.
 */
@WebServlet("/goals")
public class GoalServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final GoalDAO goalDAO = new GoalDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        List<Goal> goals = goalDAO.findByUserId(userId);
        request.setAttribute("goals", goals);
        request.getRequestDispatcher("/goals.jsp").forward(request, response);
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
                String title = request.getParameter("title");
                String description = request.getParameter("description");
                double targetValue = Double.parseDouble(request.getParameter("targetValue"));
                double currentValue = Double.parseDouble(request.getParameter("currentValue"));
                String unit = request.getParameter("unit");
                Date deadline = DateUtil.parseDate(request.getParameter("deadline"));

                Goal g = new Goal();
                g.setUserId(userId);
                g.setTitle(title.trim());
                g.setDescription(description != null ? description.trim() : "");
                g.setTargetValue(targetValue);
                g.setCurrentValue(currentValue);
                g.setUnit(unit != null ? unit.trim() : "Hours");
                g.setDeadline(deadline);
                g.setStatus(currentValue >= targetValue ? "Completed" : "Active");

                goalDAO.create(g);
                response.sendRedirect(request.getContextPath() + "/goals?msg=Goal+created+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/goals?error=Invalid+goal+data");
                return;
            }

        } else if ("updateProgress".equalsIgnoreCase(action)) {
            try {
                int id = Integer.parseInt(request.getParameter("id"));
                double currentValue = Double.parseDouble(request.getParameter("currentValue"));
                goalDAO.updateProgress(id, userId, currentValue);
                response.sendRedirect(request.getContextPath() + "/goals?msg=Goal+progress+updated");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/goals?error=Failed+to+update+goal");
                return;
            }

        } else if ("delete".equalsIgnoreCase(action)) {
            try {
                int id = Integer.parseInt(request.getParameter("id"));
                goalDAO.delete(id, userId);
                response.sendRedirect(request.getContextPath() + "/goals?msg=Goal+deleted+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/goals?error=Failed+to+delete+goal");
            }
        }
    }
}
