package com.smarttracker.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class AIMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int conversationId;
    private String sender; // USER, ASSISTANT
    private String message;
    private Timestamp timestamp;

    public AIMessage() {}

    public AIMessage(String sender, String message) {
        this.sender = sender;
        this.message = message;
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getConversationId() { return conversationId; }
    public void setConversationId(int conversationId) { this.conversationId = conversationId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }
}
