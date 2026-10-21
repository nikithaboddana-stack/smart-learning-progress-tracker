package com.smarttracker.model;

import java.io.Serializable;
import java.util.List;

public class AdminDashboardDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private int totalStudents;
    private int activeStudents;
    private int totalSubjects;
    private int testsConducted;
    private double institutionalAverage;
    private int totalStudySessionsLogged;
    private List<User> recentStudents;
    private List<Subject> subjects;

    public AdminDashboardDTO() {}

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }

    public int getActiveStudents() { return activeStudents; }
    public void setActiveStudents(int activeStudents) { this.activeStudents = activeStudents; }

    public int getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(int totalSubjects) { this.totalSubjects = totalSubjects; }

    public int getTestsConducted() { return testsConducted; }
    public void setTestsConducted(int testsConducted) { this.testsConducted = testsConducted; }

    public double getInstitutionalAverage() { return institutionalAverage; }
    public void setInstitutionalAverage(double institutionalAverage) { this.institutionalAverage = institutionalAverage; }

    public int getTotalStudySessionsLogged() { return totalStudySessionsLogged; }
    public void setTotalStudySessionsLogged(int totalStudySessionsLogged) { this.totalStudySessionsLogged = totalStudySessionsLogged; }

    public List<User> getRecentStudents() { return recentStudents; }
    public void setRecentStudents(List<User> recentStudents) { this.recentStudents = recentStudents; }

    public List<Subject> getSubjects() { return subjects; }
    public void setSubjects(List<Subject> subjects) { this.subjects = subjects; }
}
