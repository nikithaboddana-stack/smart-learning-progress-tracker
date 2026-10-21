package com.smarttracker.service;

import com.smarttracker.dao.StudySessionDAO;
import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.dao.TestDAO;
import com.smarttracker.model.Recommendation;
import com.smarttracker.model.StudentSubject;
import com.smarttracker.model.Test;
import com.smarttracker.model.Topic;

import java.util.ArrayList;
import java.util.List;

public class RecommendationService {

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TestDAO testDAO = new TestDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();

    public List<Recommendation> generateRecommendations(int studentId) {
        List<Recommendation> list = new ArrayList<>();

        // 1. Analyze Streaks
        int[] streaks = sessionDAO.calculateStreaks(studentId);
        if (streaks[0] >= 3) {
            list.add(new Recommendation(
                "MOTIVATION",
                "Great Study Momentum!",
                "You have maintained an active " + streaks[0] + "-day study streak. Daily consistency is proven to increase exam retention by 40%.",
                "sessions",
                "Log Session",
                "HIGH"
            ));
        } else if (streaks[0] == 0) {
            list.add(new Recommendation(
                "WARNING",
                "Study Habit Alert",
                "No study sessions logged today or yesterday. Dedicating even 30 focused minutes will reactivate your momentum!",
                "sessions",
                "Start Stopwatch",
                "MEDIUM"
            ));
        }

        // 2. Upcoming Exams in Next 7 Days
        List<Test> upcoming = testDAO.findUpcomingTestsForStudent(studentId, 3);
        if (!upcoming.isEmpty()) {
            Test next = upcoming.get(0);
            list.add(new Recommendation(
                "URGENT",
                "Upcoming Exam: " + next.getTestName(),
                next.getTestName() + " (" + next.getSubjectName() + ") is scheduled for " + next.getTestDate() + ". Review core formulas and code examples.",
                "tests",
                "View Exam Details",
                "HIGH"
            ));
        }

        // 3. Lagging Subjects (Current < Target)
        List<StudentSubject> subjects = subjectDAO.findStudentSubjects(studentId);
        for (StudentSubject ss : subjects) {
            if (ss.isLagging()) {
                list.add(new Recommendation(
                    "WARNING",
                    "Score Deficit in " + ss.getSubjectName(),
                    "Your current standing is " + ss.getCurrentPercentage() + "%, trailing your target of " + ss.getTargetPercentage() + "%. Schedule focused revision sessions.",
                    "subjects",
                    "Open Syllabus",
                    "HIGH"
                ));
                break;
            }
        }

        // 4. Identify Weak Topics (Confidence <= 2)
        for (StudentSubject ss : subjects) {
            List<Topic> topics = subjectDAO.findTopicsBySubjectId(ss.getSubjectId(), studentId);
            for (Topic t : topics) {
                if (t.getConfidenceLevel() <= 2) {
                    list.add(new Recommendation(
                        "REVISION",
                        "Remediation Needed: " + t.getTopicName(),
                        "Confidence rated " + t.getConfidenceLevel() + "/5 stars in " + ss.getSubjectName() + ". Practice 3 hands-on problems on this topic.",
                        "subjects",
                        "Practice Topic",
                        "MEDIUM"
                    ));
                    break;
                }
            }
        }

        if (list.isEmpty()) {
            list.add(new Recommendation(
                "MOTIVATION",
                "Academic Goals on Track!",
                "You are meeting all performance benchmarks. Keep advancing your syllabus chapters and logging study sessions.",
                "dashboard",
                "View Progress",
                "LOW"
            ));
        }

        return list;
    }
}
