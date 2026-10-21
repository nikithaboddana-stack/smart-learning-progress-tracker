package com.smartlearning.model;

import java.io.Serializable;
import java.util.List;

/**
 * Encapsulates all aggregated calculations for dashboard.jsp
 */
public class DashboardStats implements Serializable {
    private static final long serialVersionUID = 1L;

    private double overallProgress;
    private double todayStudyHours;
    private double weeklyStudyHours;
    private double monthlyStudyHours;
    private double totalStudyHours;
    private int completedTasks;
    private int pendingTasks;
    private int overdueTasks;
    private int currentStreak;
    private int longestStreak;
    private int totalSubjects;
    private int totalTopics;
    private double averageTestScore;
    private List<Task> upcomingDeadlines;
    private List<Subject> subjectSummaries;

    public DashboardStats() {
    }

    public double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(double overallProgress) {
        this.overallProgress = overallProgress;
    }

    public double getTodayStudyHours() {
        return todayStudyHours;
    }

    public void setTodayStudyHours(double todayStudyHours) {
        this.todayStudyHours = todayStudyHours;
    }

    public double getWeeklyStudyHours() {
        return weeklyStudyHours;
    }

    public void setWeeklyStudyHours(double weeklyStudyHours) {
        this.weeklyStudyHours = weeklyStudyHours;
    }

    public double getMonthlyStudyHours() {
        return monthlyStudyHours;
    }

    public void setMonthlyStudyHours(double monthlyStudyHours) {
        this.monthlyStudyHours = monthlyStudyHours;
    }

    public double getTotalStudyHours() {
        return totalStudyHours;
    }

    public void setTotalStudyHours(double totalStudyHours) {
        this.totalStudyHours = totalStudyHours;
    }

    public int getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(int completedTasks) {
        this.completedTasks = completedTasks;
    }

    public int getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(int pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public int getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(int overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public int getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(int totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public int getTotalTopics() {
        return totalTopics;
    }

    public void setTotalTopics(int totalTopics) {
        this.totalTopics = totalTopics;
    }

    public double getAverageTestScore() {
        return averageTestScore;
    }

    public void setAverageTestScore(double averageTestScore) {
        this.averageTestScore = averageTestScore;
    }

    public List<Task> getUpcomingDeadlines() {
        return upcomingDeadlines;
    }

    public void setUpcomingDeadlines(List<Task> upcomingDeadlines) {
        this.upcomingDeadlines = upcomingDeadlines;
    }

    public List<Subject> getSubjectSummaries() {
        return subjectSummaries;
    }

    public void setSubjectSummaries(List<Subject> subjectSummaries) {
        this.subjectSummaries = subjectSummaries;
    }
}
