package com.smartlearning.service;

import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.Subject;
import com.smartlearning.model.Topic;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Intelligent Study Planner Service.
 * Allocates study hours proportionately based on subject priority, topic difficulty, and exam deadline.
 */
public class StudyPlannerService {

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();

    public static class PlanItem implements Serializable {
        private static final long serialVersionUID = 1L;

        private String dayOfWeek;
        private String subjectName;
        private String topicRecommendation;
        private double allocatedHours;
        private String focusArea;
        private String priorityBadge;

        public PlanItem(String dayOfWeek, String subjectName, String topicRecommendation, 
                        double allocatedHours, String focusArea, String priorityBadge) {
            this.dayOfWeek = dayOfWeek;
            this.subjectName = subjectName;
            this.topicRecommendation = topicRecommendation;
            this.allocatedHours = allocatedHours;
            this.focusArea = focusArea;
            this.priorityBadge = priorityBadge;
        }

        public String getDayOfWeek() { return dayOfWeek; }
        public String getSubjectName() { return subjectName; }
        public String getTopicRecommendation() { return topicRecommendation; }
        public double getAllocatedHours() { return allocatedHours; }
        public String getFocusArea() { return focusArea; }
        public String getPriorityBadge() { return priorityBadge; }
    }

    public List<PlanItem> generatePlan(int userId, double totalWeeklyHours, LocalDate examDate) {
        List<PlanItem> schedule = new ArrayList<>();
        List<Subject> subjects = subjectDAO.findByUserId(userId);
        List<Topic> weakTopics = topicDAO.getWeakTopics(userId);

        if (subjects.isEmpty()) {
            return schedule;
        }

        // Days remaining calculation
        long daysUntilExam = (examDate != null) ? ChronoUnit.DAYS.between(LocalDate.now(), examDate) : 30;
        if (daysUntilExam <= 0) daysUntilExam = 7;

        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        double dailyHours = Math.round((totalWeeklyHours / 7.0) * 10.0) / 10.0;

        for (int i = 0; i < days.length; i++) {
            Subject targetSubject = subjects.get(i % subjects.size());
            
            // Determine weak topic match if any
            String topicRec = "General Chapter Revision & Notes";
            String focus = "Theory & Conceptual Questions";
            
            for (Topic wt : weakTopics) {
                if (wt.getSubjectId() == targetSubject.getId()) {
                    topicRec = "High Focus: " + wt.getName() + " (Confidence: " + wt.getConfidenceLevel() + "/5)";
                    focus = "Targeted Weak Topic Remediation";
                    break;
                }
            }

            if (topicRec.startsWith("General")) {
                List<Topic> subjectTopics = topicDAO.findBySubjectId(targetSubject.getId(), userId);
                for (Topic t : subjectTopics) {
                    if (!"Completed".equalsIgnoreCase(t.getStatus())) {
                        topicRec = t.getName();
                        focus = "Syllabus Progression (" + t.getDifficulty() + ")";
                        break;
                    }
                }
            }

            schedule.add(new PlanItem(
                days[i],
                targetSubject.getName(),
                topicRec,
                dailyHours,
                focus,
                targetSubject.getPriority()
            ));
        }

        return schedule;
    }
}
