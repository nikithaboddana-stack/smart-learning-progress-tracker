package com.smartlearning.servlet;

import com.smartlearning.dao.StudySessionDAO;
import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TaskDAO;
import com.smartlearning.dao.TestDAO;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Controller for the Analytics & Visualization page.
 */
@WebServlet("/analytics")
public class AnalyticsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();
    private final TaskDAO taskDAO = new TaskDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final TestDAO testDAO = new TestDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        List<Subject> subjects = subjectDAO.findByUserId(userId);
        List<Topic> allTopics = topicDAO.findByUserId(userId);
        Map<String, Integer> taskCounts = taskDAO.getTaskCounts(userId);
        Map<String, Double> testAverages = testDAO.getSubjectAverages(userId);

        double totalHours = sessionDAO.getTotalHours(userId);
        double weeklyHours = sessionDAO.getWeeklyHours(userId);
        int[] streaks = sessionDAO.calculateStreaks(userId);
        double overallProgress = 0.0;

        if (!allTopics.isEmpty()) {
            double sum = 0.0;
            for (Topic t : allTopics) {
                sum += t.getProgressPercentage();
            }
            overallProgress = Math.round((sum / allTopics.size()) * 10.0) / 10.0;
        }

        int totalTasks = taskCounts.get("Completed") + taskCounts.get("Pending") + 
                         taskCounts.get("In Progress") + taskCounts.get("Overdue");
        double taskCompletionRate = totalTasks > 0 ? 
                Math.round(((double) taskCounts.get("Completed") / totalTasks) * 1000.0) / 10.0 : 0.0;

        // Categorize Strong vs Weak Subjects
        List<Subject> strongSubjects = new ArrayList<>();
        List<Subject> weakSubjects = new ArrayList<>();

        for (Subject s : subjects) {
            Double testAvg = testAverages.get(s.getName());
            boolean isHighProgress = s.getOverallProgress() >= 75.0;
            boolean isHighTest = testAvg != null && testAvg >= 75.0;

            if (isHighProgress || isHighTest) {
                strongSubjects.add(s);
            } else if (s.getOverallProgress() < 50.0 || (testAvg != null && testAvg < 60.0)) {
                weakSubjects.add(s);
            }
        }

        request.setAttribute("subjects", subjects);
        request.setAttribute("overallProgress", overallProgress);
        request.setAttribute("totalHours", totalHours);
        request.setAttribute("weeklyHours", weeklyHours);
        request.setAttribute("currentStreak", streaks[0]);
        request.setAttribute("longestStreak", streaks[1]);
        request.setAttribute("taskCounts", taskCounts);
        request.setAttribute("taskCompletionRate", taskCompletionRate);
        request.setAttribute("testAverages", testAverages);
        request.setAttribute("strongSubjects", strongSubjects);
        request.setAttribute("weakSubjects", weakSubjects);

        request.getRequestDispatcher("/analytics.jsp").forward(request, response);
    }
}
