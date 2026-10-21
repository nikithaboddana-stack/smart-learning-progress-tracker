package com.smarttracker.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

public class StudyPlan implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int studentId;
    private int subjectId;
    private String dayOfWeek;
    private Date planDate;
    private int plannedMinutes;
    private String focusNotes;
    private String status; // PENDING, COMPLETED, MISSED
    private Timestamp createdAt;

    // Joined
    private String subjectName;
    private String subjectPriority;

    public StudyPlan() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public int getSubjectId() { return subjectId; }
    public void setSubjectId(int subjectId) { this.subjectId = subjectId; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public Date getPlanDate() { return planDate; }
    public void setPlanDate(Date planDate) { this.planDate = planDate; }

    public int getPlannedMinutes() { return plannedMinutes; }
    public void setPlannedMinutes(int plannedMinutes) { this.plannedMinutes = plannedMinutes; }

    public double getPlannedHours() {
        return Math.round((plannedMinutes / 60.0) * 10.0) / 10.0;
    }

    public String getFocusNotes() { return focusNotes; }
    public void setFocusNotes(String focusNotes) { this.focusNotes = focusNotes; }

    public String getStatus() { return status != null ? status : "PENDING"; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectPriority() { return subjectPriority; }
    public void setSubjectPriority(String subjectPriority) { this.subjectPriority = subjectPriority; }
}
