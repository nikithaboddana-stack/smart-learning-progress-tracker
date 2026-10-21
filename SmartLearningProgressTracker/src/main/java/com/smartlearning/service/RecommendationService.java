package com.smartlearning.service;

import com.smartlearning.dao.GoalDAO;
import com.smartlearning.dao.StudySessionDAO;
import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TaskDAO;
import com.smartlearning.dao.TestDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.Goal;
import com.smartlearning.model.Recommendation;
import com.smartlearning.model.Subject;
import com.smartlearning.model.Task;
import com.smartlearning.model.TestRecord;
import com.smartlearning.model.Topic;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Intelligent Rule-Based Recommendation Engine.
 * Analyzes student database records to formulate actionable study recommendations.
 */
public class RecommendationService {

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();
    private final TaskDAO taskDAO = new TaskDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final GoalDAO goalDAO = new GoalDAO();
    private final TestDAO testDAO = new TestDAO();

    /**
     * Generates a curated list of recommendations based on student's actual performance.
     */
    public List<Recommendation> generateRecommendations(int userId) {
        List<Recommendation> recommendations = new ArrayList<>();

        // 1. Analyze Study Streak & Consistency
        int[] streaks = sessionDAO.calculateStreaks(userId);
        int currentStreak = streaks[0];
        if (currentStreak >= 3) {
            recommendations.add(new Recommendation(
                "MOTIVATION",
                "Great Study Momentum!",
                "You have maintained a " + currentStreak + "-day study streak. Keep up this consistency to reinforce long-term memory retention.",
                "study-sessions",
                "Log Today's Session",
                "flame"
            ));
        } else if (currentStreak == 0) {
            recommendations.add(new Recommendation(
                "WARNING",
                "Study Streak Inactive",
                "You haven't logged any study session today or yesterday. Dedicating even 30 minutes today will reignite your learning habit.",
                "study-sessions",
                "Start Study Session",
                "clock"
            ));
        }

        // 2. Analyze Upcoming High-Priority Deadlines
        List<Task> upcoming = taskDAO.getUpcomingDeadlines(userId, 5);
        if (!upcoming.isEmpty()) {
            for (Task t : upcoming) {
                if ("High".equalsIgnoreCase(t.getPriority())) {
                    recommendations.add(new Recommendation(
                        "URGENT",
                        "High Priority Task Approaching",
                        "Task '" + t.getTitle() + "' is due on " + t.getDueDate() + " (" + t.getEstimatedMinutes() + " mins estimated). Tackle it first!",
                        "tasks",
                        "View Task",
                        "alert-circle"
                    ));
                    break; // Highlight highest priority
                }
            }
        }

        // 3. Analyze Subject Progress vs Target
        List<Subject> subjects = subjectDAO.findByUserId(userId);
        for (Subject s : subjects) {
            if (s.getTargetPercentage() > 0 && s.getOverallProgress() < (s.getTargetPercentage() - 15)) {
                recommendations.add(new Recommendation(
                    "WARNING",
                    "Lagging in " + s.getName(),
                    "Your progress in " + s.getName() + " is " + s.getOverallProgress() + "%, well below your target of " + s.getTargetPercentage() + "%. Consider scheduling extra review sessions.",
                    "topics?subjectId=" + s.getId(),
                    "Open Syllabus",
                    "trending-down"
                ));
            }
        }

        // 4. Analyze Weak Topics (Confidence level <= 2)
        List<Topic> weakTopics = topicDAO.getWeakTopics(userId);
        if (!weakTopics.isEmpty()) {
            Topic weakest = weakTopics.get(0);
            recommendations.add(new Recommendation(
                "REVISION",
                "Revision Alert: " + weakest.getName(),
                "Your confidence rating in '" + weakest.getName() + "' (" + (weakest.getSubjectName() != null ? weakest.getSubjectName() : "Syllabus") + ") is low (" + weakest.getConfidenceLevel() + "/5). Plan a targeted revision session.",
                "topics?subjectId=" + weakest.getSubjectId(),
                "Revise Topic",
                "book-open"
            ));
        }

        // 5. Analyze Low Test / Quiz Scores (< 60%)
        List<TestRecord> tests = testDAO.findByUserId(userId);
        for (TestRecord tr : tests) {
            if (tr.getPercentage() < 60.0) {
                recommendations.add(new Recommendation(
                    "SUGGESTION",
                    "Score Improvement Needed",
                    "Your score in '" + tr.getTestName() + "' was " + tr.getPercentage() + "%. Reviewing your test errors will prevent repeating misconceptions.",
                    "tests",
                    "Review Tests",
                    "file-text"
                ));
                break;
            }
        }

        // 6. Analyze Active Goals approaching deadline
        List<Goal> goals = goalDAO.findByUserId(userId);
        LocalDate now = LocalDate.now();
        for (Goal g : goals) {
            if ("Active".equalsIgnoreCase(g.getStatus()) && g.getDeadline() != null) {
                LocalDate dl = g.getDeadline().toLocalDate();
                if (dl.isAfter(now) && dl.isBefore(now.plusDays(4)) && g.getProgressPercentage() < 80.0) {
                    recommendations.add(new Recommendation(
                        "URGENT",
                        "Goal Deadline in " + java.time.temporal.ChronoUnit.DAYS.between(now, dl) + " Days",
                        "Goal '" + g.getTitle() + "' is at " + g.getProgressPercentage() + "% progress. Prioritize the remaining " + (g.getTargetValue() - g.getCurrentValue()) + " " + g.getUnit() + ".",
                        "goals",
                        "Update Goal",
                        "target"
                    ));
                    break;
                }
            }
        }

        // Fallback default recommendation if everything is on track
        if (recommendations.isEmpty()) {
            recommendations.add(new Recommendation(
                "MOTIVATION",
                "On Track for Academic Excellence!",
                "All tasks and goals are progressing well. Maintain your daily study routine and review your flashcards or completed notes.",
                "dashboard",
                "View Progress",
                "check-circle"
            ));
        }

        return recommendations;
    }

    /**
     * Rule-based responses for the interactive AI Assistant page.
     */
    public String answerAssistantQuery(int userId, String queryType) {
        StringBuilder sb = new StringBuilder();

        if ("how_am_i_doing".equalsIgnoreCase(queryType)) {
            double avgTest = testDAO.getAverageScore(userId);
            int[] streaks = sessionDAO.calculateStreaks(userId);
            double weeklyHours = sessionDAO.getWeeklyHours(userId);
            Map<String, Integer> taskCounts = taskDAO.getTaskCounts(userId);

            sb.append("### Academic Health Overview:\n\n");
            sb.append("- **Test Average**: ").append(avgTest).append("%\n");
            sb.append("- **Study Streak**: ").append(streaks[0]).append(" days (Longest: ").append(streaks[1]).append(" days)\n");
            sb.append("- **7-Day Study Hours**: ").append(weeklyHours).append(" hrs\n");
            sb.append("- **Task Status**: ").append(taskCounts.get("Completed")).append(" completed, ")
              .append(taskCounts.get("Pending") + taskCounts.get("In Progress")).append(" remaining, ")
              .append(taskCounts.get("Overdue")).append(" overdue.\n\n");

            if (avgTest >= 80) {
                sb.append("🌟 **Verdict**: Excellent performance! You are currently on track for honors distinction.");
            } else if (avgTest >= 60) {
                sb.append("📈 **Verdict**: Good consistent progress. Focusing on your weak topics will push your average above 80%.");
            } else {
                sb.append("⚠️ **Verdict**: Needs attention. Increase your scheduled study hours and clear your overdue tasks.");
            }
        } else if ("what_to_study_today".equalsIgnoreCase(queryType)) {
            List<Task> tasks = taskDAO.getUpcomingDeadlines(userId, 3);
            List<Topic> weak = topicDAO.getWeakTopics(userId);

            sb.append("### Recommended Study Schedule for Today:\n\n");
            if (!tasks.isEmpty()) {
                sb.append("**1. Priority Deadline Task**:\n");
                Task t = tasks.get(0);
                sb.append("   - **").append(t.getTitle()).append("** (Due: ").append(t.getDueDate())
                  .append(", ").append(t.getEstimatedMinutes()).append(" mins)\n\n");
            }
            if (!weak.isEmpty()) {
                Topic top = weak.get(0);
                sb.append("**2. High-Impact Concept Revision**:\n");
                sb.append("   - **").append(top.getName()).append("** (Confidence: ")
                  .append(top.getConfidenceLevel()).append("/5, Progress: ").append(top.getProgressPercentage()).append("%)\n\n");
            }
            sb.append("**3. Habit Booster**:\n");
            sb.append("   - Log at least 45 minutes using the Study Session tracker to maintain your study streak!");

        } else if ("which_subjects_need_attention".equalsIgnoreCase(queryType)) {
            List<Subject> subjects = subjectDAO.findByUserId(userId);
            Map<String, Double> testAverages = testDAO.getSubjectAverages(userId);

            sb.append("### Subjects Requiring Attention:\n\n");
            boolean found = false;
            for (Subject s : subjects) {
                Double testAvg = testAverages.get(s.getName());
                boolean lowProgress = s.getOverallProgress() < 60.0;
                boolean lowTest = testAvg != null && testAvg < 65.0;

                if (lowProgress || lowTest) {
                    found = true;
                    sb.append("📌 **").append(s.getName()).append("**\n");
                    sb.append("   - Syllabus Completion: ").append(s.getOverallProgress()).append("%\n");
                    if (testAvg != null) {
                        sb.append("   - Test Average: ").append(testAvg).append("%\n");
                    }
                    sb.append("   - Recommended Action: Schedule two 60-minute deep-work sessions this week.\n\n");
                }
            }
            if (!found) {
                sb.append("🎉 All subjects are currently meeting or exceeding your target benchmarks!");
            }
        } else if ("show_weak_topics".equalsIgnoreCase(queryType)) {
            List<Topic> weak = topicDAO.getWeakTopics(userId);
            sb.append("### Identified Weak Topics (Confidence ≤ 2 / Progress < 50%):\n\n");
            if (weak.isEmpty()) {
                sb.append("No critical weak topics found! All topics have satisfactory progress and confidence ratings.");
            } else {
                for (Topic t : weak) {
                    sb.append("- **").append(t.getName()).append("** (").append(t.getSubjectName() != null ? t.getSubjectName() : "General")
                      .append("): Confidence ").append(t.getConfidenceLevel()).append("/5, Progress ")
                      .append(t.getProgressPercentage()).append("%, Revisions: ").append(t.getRevisionCount()).append("\n");
                }
            }
        } else if ("give_study_plan".equalsIgnoreCase(queryType)) {
            sb.append("### 3-Phase Smart Study Strategy:\n\n");
            sb.append("1. **Phase 1: Pomodoro Active Recall (45 mins)**\n");
            sb.append("   - Review weak topics and write notes from memory without looking at reference material.\n\n");
            sb.append("2. **Phase 2: Practice & Problem Solving (60 mins)**\n");
            sb.append("   - Solve coding exercises, SQL queries, or previous year test question banks.\n\n");
            sb.append("3. **Phase 3: Progress Log & Self-Assessment (15 mins)**\n");
            sb.append("   - Update topic confidence scores, log the session time, and mark completed tasks.");
        } else {
            sb.append("Hello! I am your Smart Learning Assistant. Select an analysis prompt above to evaluate your real-time database records.");
        }

        return sb.toString();
    }
}
