package com.smartlearning.servlet;

import com.smartlearning.dao.StudySessionDAO;
import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TaskDAO;
import com.smartlearning.dao.TestDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.DashboardStats;
import com.smartlearning.model.Recommendation;
import com.smartlearning.model.Subject;
import com.smartlearning.model.Task;
import com.smartlearning.model.Topic;
import com.smartlearning.service.RecommendationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Controller servlet for the central student dashboard.
 * Aggregates live database metrics into a unified DashboardStats POJO.
 */
@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();
    private final TaskDAO taskDAO = new TaskDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final TestDAO testDAO = new TestDAO();
    private final RecommendationService recommendationService = new RecommendationService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        int userId = (Integer) session.getAttribute("userId");

        // 1. Fetch Subjects with completion stats
        List<Subject> subjects = subjectDAO.findByUserId(userId);

        // 2. Fetch Topics to calculate true overall completion
        List<Topic> allTopics = topicDAO.findByUserId(userId);
        double overallProgress = 0.0;
        if (!allTopics.isEmpty()) {
            double sum = 0.0;
            for (Topic t : allTopics) {
                sum += t.getProgressPercentage();
            }
            overallProgress = Math.round((sum / allTopics.size()) * 10.0) / 10.0;
        }

        // 3. Fetch Task counts & upcoming deadlines
        Map<String, Integer> taskCounts = taskDAO.getTaskCounts(userId);
        List<Task> upcomingTasks = taskDAO.getUpcomingDeadlines(userId, 5);

        // 4. Fetch Study hours
        double todayHours = sessionDAO.getTodayHours(userId);
        double weeklyHours = sessionDAO.getWeeklyHours(userId);
        double monthlyHours = sessionDAO.getMonthlyHours(userId);
        double totalHours = sessionDAO.getTotalHours(userId);

        // 5. Fetch Streaks
        int[] streaks = sessionDAO.calculateStreaks(userId);

        // 6. Fetch Average Test Score
        double avgTestScore = testDAO.getAverageScore(userId);

        // 7. Generate Smart Recommendations
        List<Recommendation> recommendations = recommendationService.generateRecommendations(userId);

        // Build DashboardStats transfer object
        DashboardStats stats = new DashboardStats();
        stats.setOverallProgress(overallProgress);
        stats.setTodayStudyHours(todayHours);
        stats.setWeeklyStudyHours(weeklyHours);
        stats.setMonthlyStudyHours(monthlyHours);
        stats.setTotalStudyHours(totalHours);
        stats.setCompletedTasks(taskCounts.get("Completed"));
        stats.setPendingTasks(taskCounts.get("Pending") + taskCounts.get("In Progress"));
        stats.setOverdueTasks(taskCounts.get("Overdue"));
        stats.setCurrentStreak(streaks[0]);
        stats.setLongestStreak(streaks[1]);
        stats.setTotalSubjects(subjects.size());
        stats.setTotalTopics(allTopics.size());
        stats.setAverageTestScore(avgTestScore);
        stats.setUpcomingDeadlines(upcomingTasks);
        stats.setSubjectSummaries(subjects);

        request.setAttribute("stats", stats);
        request.setAttribute("recommendations", recommendations);
        request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
    }
}
