package com.smartlearning.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Model class representing an academic subject.
 */
public class Subject implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private String name;
    private String description;
    private String priority; // High, Medium, Low
    private double targetPercentage;
    private Timestamp createdAt;

    // Derived statistics for UI
    private int totalTopics;
    private int completedTopics;
    private double overallProgress;
    private double averageTestScore;

    public Subject() {
    }

    public Subject(int id, int userId, String name, String description, String priority, double targetPercentage, Timestamp createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.targetPercentage = targetPercentage;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public double getTargetPercentage() {
        return targetPercentage;
    }

    public void setTargetPercentage(double targetPercentage) {
        this.targetPercentage = targetPercentage;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public int getTotalTopics() {
        return totalTopics;
    }

    public void setTotalTopics(int totalTopics) {
        this.totalTopics = totalTopics;
    }

    public int getCompletedTopics() {
        return completedTopics;
    }

    public void setCompletedTopics(int completedTopics) {
        this.completedTopics = completedTopics;
    }

    public double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(double overallProgress) {
        this.overallProgress = overallProgress;
    }

    public double getAverageTestScore() {
        return averageTestScore;
    }

    public void setAverageTestScore(double averageTestScore) {
        this.averageTestScore = averageTestScore;
    }
}
