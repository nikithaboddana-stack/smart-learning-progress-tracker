package com.smartlearning.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model class representing a syllabus topic/chapter in a subject.
 */
public class Topic implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int subjectId;
    private String name;
    private String description;
    private String difficulty; // Easy, Medium, Hard
    private String status;     // Not Started, In Progress, Completed
    private double progressPercentage;
    private int confidenceLevel; // 1 to 5
    private Date lastStudied;
    private int revisionCount;
    private Timestamp createdAt;

    // Joined attribute for display
    private String subjectName;

    public Topic() {
    }

    public Topic(int id, int subjectId, String name, String description, String difficulty, 
                 String status, double progressPercentage, int confidenceLevel, 
                 Date lastStudied, int revisionCount, Timestamp createdAt) {
        this.id = id;
        this.subjectId = subjectId;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.status = status;
        this.progressPercentage = progressPercentage;
        this.confidenceLevel = confidenceLevel;
        this.lastStudied = lastStudied;
        this.revisionCount = revisionCount;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
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

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public int getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(int confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public Date getLastStudied() {
        return lastStudied;
    }

    public void setLastStudied(Date lastStudied) {
        this.lastStudied = lastStudied;
    }

    public int getRevisionCount() {
        return revisionCount;
    }

    public void setRevisionCount(int revisionCount) {
        this.revisionCount = revisionCount;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
}
