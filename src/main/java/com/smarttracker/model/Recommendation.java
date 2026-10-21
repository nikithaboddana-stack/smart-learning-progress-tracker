package com.smarttracker.model;

import java.io.Serializable;

public class Recommendation implements Serializable {
    private static final long serialVersionUID = 1L;

    private String type; // URGENT, WARNING, MOTIVATION, REVISION
    private String title;
    private String message;
    private String actionLink;
    private String actionText;
    private String priority; // HIGH, MEDIUM, LOW

    public Recommendation() {}

    public Recommendation(String type, String title, String message, String actionLink, String actionText, String priority) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.actionLink = actionLink;
        this.actionText = actionText;
        this.priority = priority;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getActionLink() { return actionLink; }
    public void setActionLink(String actionLink) { this.actionLink = actionLink; }

    public String getActionText() { return actionText; }
    public void setActionText(String actionText) { this.actionText = actionText; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
