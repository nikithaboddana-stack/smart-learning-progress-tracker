package com.smarttracker.controller.api;

import com.smarttracker.dao.AIConversationDAO;
import com.smarttracker.service.AIService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/api/ai/chat")
public class AIChatApiServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final AIService aiService = new AIService();
    private final AIConversationDAO aiDAO = new AIConversationDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Unauthorized. Please sign in.\"}");
            return;
        }

        int studentId = (Integer) session.getAttribute("userId");

        // Parse incoming message (support both JSON body and standard Form POST)
        String userMessage = request.getParameter("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
            }
            if (sb.length() > 0) {
                try {
                    JSONObject reqJson = new JSONObject(sb.toString());
                    userMessage = reqJson.optString("message", "");
                } catch (Exception ignored) {}
            }
        }

        if (userMessage == null || userMessage.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Message cannot be empty.\"}");
            return;
        }

        int convId = aiDAO.getOrCreateConversation(studentId);
        aiDAO.saveMessage(convId, "USER", userMessage.trim());

        // Get AI response grounded in student's academic profile
        String aiResponse = aiService.getAIResponse(studentId, userMessage.trim());
        aiDAO.saveMessage(convId, "ASSISTANT", aiResponse);

        JSONObject res = new JSONObject();
        res.put("success", true);
        res.put("reply", aiResponse);
        res.put("conversationId", convId);

        response.getWriter().write(res.toString());
    }
}
