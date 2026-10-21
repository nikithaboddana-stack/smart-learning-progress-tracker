package com.smarttracker.controller.student;

import com.smarttracker.dao.StudyPlanDAO;
import com.smarttracker.dao.StudySessionDAO;
import com.smarttracker.dao.SubjectDAO;
import com.smarttracker.dao.TestDAO;
import com.smarttracker.model.StudentDashboardDTO;
import com.smarttracker.model.StudentSubject;
import com.smarttracker.service.RecommendationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.LocalTime;
import java.util.List;

@WebServlet("/student/dashboard")
public class StudentDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TestDAO testDAO = new TestDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final StudyPlanDAO planDAO = new StudyPlanDAO();
    private final RecommendationService recommendationService = new RecommendationService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int studentId = (Integer) session.getAttribute("userId");
        String fullName = (String) session.getAttribute("userName");
        String firstName = (fullName != null && fullName.contains(" ")) ? fullName.split(" ")[0] : fullName;

        // Dynamic Time of Day Greeting
        int hour = LocalTime.now().getHour();
        String greeting = "Good morning";
        if (hour >= 12 && hour < 17) greeting = "Good afternoon";
        else if (hour >= 17) greeting = "Good evening";

        // Query Student Database Records
        List<StudentSubject> subjects = subjectDAO.findStudentSubjects(studentId);
        double overallScore = testDAO.calculateStudentAverage(studentId);
        double todayHours = sessionDAO.getTodayHours(studentId);
        double weeklyHours = sessionDAO.getWeeklyHours(studentId);
        double totalHours = sessionDAO.getTotalHours(studentId);
        int[] streaks = sessionDAO.calculateStreaks(studentId);

        int weakCount = 0;
        for (StudentSubject ss : subjects) {
            if (ss.isLagging()) weakCount++;
        }

        StudentDashboardDTO dto = new StudentDashboardDTO();
        dto.setOverallPerformance(overallScore);
        dto.setTotalEnrolledSubjects(subjects.size());
        dto.setTodayStudyHours(todayHours);
        dto.setWeeklyStudyHours(weeklyHours);
        dto.setTotalStudyHours(totalHours);
        dto.setCurrentStreak(streaks[0]);
        dto.setLongestStreak(streaks[1]);
        dto.setWeakSubjectsCount(weakCount);
        dto.setSubjects(subjects);
        dto.setRecentTestResults(testDAO.findStudentTestResults(studentId));
        dto.setUpcomingTests(testDAO.findUpcomingTestsForStudent(studentId, 4));
        dto.setTodayPlans(planDAO.findTodayPlans(studentId));
        dto.setRecommendations(recommendationService.generateRecommendations(studentId));

        request.setAttribute("dashboard", dto);
        request.setAttribute("greeting", greeting);
        request.setAttribute("studentFirstName", firstName);

        request.getRequestDispatcher("/WEB-INF/views/student/dashboard.jsp").forward(request, response);
    }
}
