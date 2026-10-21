package com.smartlearning.servlet;

import com.smartlearning.dao.SubjectDAO;
import com.smartlearning.dao.TestDAO;
import com.smartlearning.dao.TopicDAO;
import com.smartlearning.model.Subject;
import com.smartlearning.model.TestRecord;
import com.smartlearning.model.Topic;
import com.smartlearning.util.DateUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

/**
 * Controller for Test and Quiz tracking.
 */
@WebServlet("/tests")
public class TestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final TestDAO testDAO = new TestDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        List<TestRecord> tests = testDAO.findByUserId(userId);
        double avgScore = testDAO.getAverageScore(userId);
        List<Subject> subjects = subjectDAO.findByUserId(userId);
        List<Topic> topics = topicDAO.findByUserId(userId);

        request.setAttribute("tests", tests);
        request.setAttribute("avgScore", avgScore);
        request.setAttribute("subjects", subjects);
        request.setAttribute("topics", topics);
        request.getRequestDispatcher("/tests.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        String action = request.getParameter("action");
        if (action == null) action = "add";

        if ("add".equalsIgnoreCase(action)) {
            try {
                int subjectId = Integer.parseInt(request.getParameter("subjectId"));
                String topicIdStr = request.getParameter("topicId");
                Integer topicId = (topicIdStr != null && !topicIdStr.isEmpty()) ? Integer.parseInt(topicIdStr) : null;
                
                String testName = request.getParameter("testName");
                Date testDate = DateUtil.parseDate(request.getParameter("testDate"));
                double marksObtained = Double.parseDouble(request.getParameter("marksObtained"));
                double totalMarks = Double.parseDouble(request.getParameter("totalMarks"));
                String notes = request.getParameter("notes");

                if (marksObtained > totalMarks) {
                    response.sendRedirect(request.getContextPath() + "/tests?error=Marks+obtained+cannot+exceed+total+marks");
                    return;
                }

                TestRecord tr = new TestRecord();
                tr.setUserId(userId);
                tr.setSubjectId(subjectId);
                tr.setTopicId(topicId);
                tr.setTestName(testName.trim());
                tr.setTestDate(testDate);
                tr.setMarksObtained(marksObtained);
                tr.setTotalMarks(totalMarks);
                tr.setNotes(notes != null ? notes.trim() : "");

                testDAO.create(tr);
                response.sendRedirect(request.getContextPath() + "/tests?msg=Test+result+recorded+successfully");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/tests?error=Failed+to+record+test+result");
                return;
            }

        } else if ("delete".equalsIgnoreCase(action)) {
            try {
                int id = Integer.parseInt(request.getParameter("id"));
                testDAO.delete(id, userId);
                response.sendRedirect(request.getContextPath() + "/tests?msg=Test+record+deleted");
                return;
            } catch (Exception e) {
                response.sendRedirect(request.getContextPath() + "/tests?error=Failed+to+delete+record");
            }
        }
    }
}
