package com.smartlearning.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model class representing test and quiz results.
 */
public class TestRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private int subjectId;
    private Integer topicId;
    private String testName;
    private Date testDate;
    private double marksObtained;
    private double totalMarks;
    private double percentage;
    private String notes;
    private Timestamp createdAt;

    // Joined fields
    private String subjectName;
    private String topicName;

    public TestRecord() {
    }

    public TestRecord(int id, int userId, int subjectId, Integer topicId, String testName, 
                      Date testDate, double marksObtained, double totalMarks, double percentage, 
                      String notes, Timestamp createdAt) {
        this.id = id;
        this.userId = userId;
        this.subjectId = subjectId;
        this.topicId = topicId;
        this.testName = testName;
        this.testDate = testDate;
        this.marksObtained = marksObtained;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.notes = notes;
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

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getTopicId() {
        return topicId;
    }

    public void setTopicId(Integer topicId) {
        this.topicId = topicId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public Date getTestDate() {
        return testDate;
    }

    public void setTestDate(Date testDate) {
        this.testDate = testDate;
    }

    public double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(double marksObtained) {
        this.marksObtained = marksObtained;
        calculatePercentage();
    }

    public double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(double totalMarks) {
        this.totalMarks = totalMarks;
        calculatePercentage();
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public void calculatePercentage() {
        if (this.totalMarks > 0) {
            this.percentage = Math.round((this.marksObtained / this.totalMarks) * 10000.0) / 100.0;
        } else {
            this.percentage = 0.0;
        }
    }
}
