package com.smartlearning.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

/**
 * Model class representing a logged study session.
 */
public class StudySession implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private int subjectId;
    private Integer topicId;
    private Date studyDate;
    private Time startTime;
    private Time endTime;
    private int durationMinutes;
    private String notes;
    private Timestamp createdAt;

    // Joined fields
    private String subjectName;
    private String topicName;

    public StudySession() {
    }

    public StudySession(int id, int userId, int subjectId, Integer topicId, Date studyDate, 
                        Time startTime, Time endTime, int durationMinutes, String notes, 
                        Timestamp createdAt) {
        this.id = id;
        this.userId = userId;
        this.subjectId = subjectId;
        this.topicId = topicId;
        this.studyDate = studyDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
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

    public Date getStudyDate() {
        return studyDate;
    }

    public void setStudyDate(Date studyDate) {
        this.studyDate = studyDate;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
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

    public double getDurationHours() {
        return Math.round((durationMinutes / 60.0) * 10.0) / 10.0;
    }
}
