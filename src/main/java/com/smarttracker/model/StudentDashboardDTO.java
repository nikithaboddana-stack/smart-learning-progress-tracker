package com.smarttracker.model;

import java.io.Serializable;
import java.util.List;

public class StudentDashboardDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private double overallPerformance;
    private int totalEnrolledSubjects;
    private double todayStudyHours;
    private double weeklyStudyHours;
    private double totalStudyHours;
    private int testsCompleted;
    private int currentStreak;
    private int longestStreak;
    private int weakSubjectsCount;
    private List<StudentSubject> subjects;
    private List<TestResult> recentTestResults;
    private List<Test> upcomingTests;
    private List<StudyPlan> todayPlans;
    private List<Recommendation> recommendations;

    public StudentDashboardDTO() {}

    public double getOverallPerformance() { return overallPerformance; }
    public void setOverallPerformance(double overallPerformance) { this.overallPerformance = overallPerformance; }

    public int getTotalEnrolledSubjects() { return totalEnrolledSubjects; }
    public void setTotalEnrolledSubjects(int totalEnrolledSubjects) { this.totalEnrolledSubjects = totalEnrolledSubjects; }

    public double getTodayStudyHours() { return todayStudyHours; }
    public void setTodayStudyHours(double todayStudyHours) { this.todayStudyHours = todayStudyHours; }

    public double getWeeklyStudyHours() { return weeklyStudyHours; }
    public void setWeeklyStudyHours(double weeklyStudyHours) { this.weeklyStudyHours = weeklyStudyHours; }

    public double getTotalStudyHours() { return totalStudyHours; }
    public void setTotalStudyHours(double totalStudyHours) { this.totalStudyHours = totalStudyHours; }

    public int getTestsCompleted() { return testsCompleted; }
    public void setTestsCompleted(int testsCompleted) { this.testsCompleted = testsCompleted; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public int getWeakSubjectsCount() { return weakSubjectsCount; }
    public void setWeakSubjectsCount(int weakSubjectsCount) { this.weakSubjectsCount = weakSubjectsCount; }

    public List<StudentSubject> getSubjects() { return subjects; }
    public void setSubjects(List<StudentSubject> subjects) { this.subjects = subjects; }

    public List<TestResult> getRecentTestResults() { return recentTestResults; }
    public void setRecentTestResults(List<TestResult> recentTestResults) { this.recentTestResults = recentTestResults; }

    public List<Test> getUpcomingTests() { return upcomingTests; }
    public void setUpcomingTests(List<Test> upcomingTests) { this.upcomingTests = upcomingTests; }

    public List<StudyPlan> getTodayPlans() { return todayPlans; }
    public void setTodayPlans(List<StudyPlan> todayPlans) { this.todayPlans = todayPlans; }

    public List<Recommendation> getRecommendations() { return recommendations; }
    public void setRecommendations(List<Recommendation> recommendations) { this.recommendations = recommendations; }
}
