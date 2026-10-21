package com.smarttracker.model;

import java.io.Serializable;
import java.sql.Date;

public class Topic implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int subjectId;
    private String topicName;
    private String difficulty; // EASY, MEDIUM, HARD

    // Student specific progress fields
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
    private double progressPercentage;
    private int confidenceLevel; // 1 to 5
    private int revisionCount;
    private Date lastRevised;
    private String subjectName;

    public Topic() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSubjectId() { return subjectId; }
    public void setSubjectId(int subjectId) { this.subjectId = subjectId; }

    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getStatus() { return status != null ? status : "NOT_STARTED"; }
    public void setStatus(String status) { this.status = status; }

    public double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }

    public int getConfidenceLevel() { return confidenceLevel > 0 ? confidenceLevel : 3; }
    public void setConfidenceLevel(int confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public int getRevisionCount() { return revisionCount; }
    public void setRevisionCount(int revisionCount) { this.revisionCount = revisionCount; }

    public Date getLastRevised() { return lastRevised; }
    public void setLastRevised(Date lastRevised) { this.lastRevised = lastRevised; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
}
