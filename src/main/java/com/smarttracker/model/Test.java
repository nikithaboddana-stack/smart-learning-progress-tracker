package com.smarttracker.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

public class Test implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int subjectId;
    private String testName;
    private Date testDate;
    private double maxMarks;
    private String testType; // QUIZ, MID_TERM, FINAL_EXAM, ASSIGNMENT
    private Integer createdBy;
    private Timestamp createdAt;

    // Joined
    private String subjectName;
    private String subjectCode;

    public Test() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSubjectId() { return subjectId; }
    public void setSubjectId(int subjectId) { this.subjectId = subjectId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public Date getTestDate() { return testDate; }
    public void setTestDate(Date testDate) { this.testDate = testDate; }

    public double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(double maxMarks) { this.maxMarks = maxMarks; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
}
