package com.smarttracker.controller.student;

import com.smarttracker.dao.AIConversationDAO;
import com.smarttracker.model.AIMessage;
import com.smarttracker.service.AIService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/student/assistant")
public class StudentAIChatServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final AIConversationDAO aiDAO = new AIConversationDAO();
    private final AIService aiService = new AIService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");

        int convId = aiDAO.getOrCreateConversation(studentId);
        List<AIMessage> history = aiDAO.getRecentMessages(convId, 30);

        request.setAttribute("conversationId", convId);
        request.setAttribute("chatHistory", history);
        request.setAttribute("academicContext", aiService.buildStudentAcademicContext(studentId));

        request.getRequestDispatcher("/WEB-INF/views/student/assistant.jsp").forward(request, response);
    }
}
