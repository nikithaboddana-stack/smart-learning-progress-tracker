# SMART LEARNING PROGRESS TRACKER
### Advanced Java Web Application (Jakarta Servlet 6.0 &bull; JSP &bull; JDBC &bull; MySQL &bull; Apache Tomcat 10.1+)

---

## 1. PROJECT OVERVIEW &amp; PROBLEM STATEMENT
Students in modern academic degree programs face heavy course loads spanning multiple core subjects, practical labs, and internal tests. Without systematic tracking, learners struggle with:
* Poor time allocation and last-minute cramming before examinations.
* Overlooked weak topics and syllabus blind spots.
* Disjointed tracking of homework assignments and overdue deadlines.
* Inconsistent study habits lacking measurable streak motivation.

**Smart Learning Progress Tracker** is an enterprise-grade Advanced Java Web Application engineered using the **Model-View-Controller (MVC)** design pattern. It provides college students with a unified platform to manage subjects, syllabus topics, study tasks, stopwatch study sessions, dynamic streak analytics, test marks, and rule-based smart study recommendations.

---

## 2. KEY FEATURES
1. **Student Authentication & Security**:
   * Registration and Login with salted SHA-256 password hashing.
   * `HttpSession` session tracking with automatic timeout.
   * `AuthFilter` interceptor guarding all protected JSP views and servlets.
   * Multi-tenant tenant isolation ensuring each student accesses only their records.

2. **Subject & Syllabus Management**:
   * Add, edit, delete, and inspect subjects with target percentages and priority ratings.
   * Topic breakdown with difficulty rating (Easy, Medium, Hard), status (Not Started, In Progress, Completed), confidence levels (1 to 5 stars), and revision counters.

3. **Study Task Management**:
   * Filterable task dashboard: All, Pending, In Progress, Completed, and Overdue.
   * Priority tags (High, Medium, Low) and deadline alerts.

4. **Study Session Tracker & Live Stopwatch**:
   * Real-time JavaScript stopwatch with Start, Pause, Reset, and One-Click Log.
   * Automatic duration calculations for daily, weekly (7-day), monthly (30-day), and all-time study hours.
   * **Dynamic Study Streak Algorithm**: Computes continuous consecutive study days and longest historical streak directly from distinct SQL dates.

5. **Learning Goals**:
   * Set quantifiable milestones (e.g. "Study 15 Hours this week", "Complete 5 Topics").
   * Real-time progress bars and auto-completion status.

6. **Test & Quiz Performance**:
   * Record internal exam scores, mid-term marks, and quizzes.
   * Automatic percentage calculation and cumulative GPA/percentage tracking.

7. **Visual Analytics & Reporting**:
   * Subject progress vs target benchmarks with Chart.js charts.
   * Task completion distribution.
   * Identification of Strong Subjects vs Weak Subjects.

8. **Intelligent Rule-Based Recommendation Engine (`RecommendationService.java`)**:
   * Analyzes live database data: flagging low subject progress, overdue high-priority tasks, topics with low confidence (≤ 2 stars), and test scores below 60%.
   * 100% pure Java implementation requiring no external third-party AI keys.

9. **AI Study Assistant & Weekly Planner (`assistant.jsp`)**:
   * 5 interactive consultation prompts ("How am I doing?", "What should I study today?", "Which subjects need attention?", "Show my weak topics", "Give me a study plan").
   * Algorithmic 7-day study schedule generator based on available weekly hours and exam date.

---

## 3. ARCHITECTURE &amp; DESIGN PATTERN (MVC)

```
                    ┌─────────────────────────┐
                    │       Browser / UI      │
                    │   (JSP + HTML5 + CSS3)  │
                    └────────────┬────────────┘
                                 │ HTTP Request
                                 ▼
                    ┌─────────────────────────┐
                    │      jakarta.servlet    │
                    │      Controller Layer   │
                    │  (DashboardServlet, etc)│
                    └────────────┬────────────┘
                                 │ Business Logic
                                 ▼
                    ┌─────────────────────────┐
                    │     Service Layer       │
                    │ (RecommendationService) │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        DAO Layer        │
                    │  (SubjectDAO, TaskDAO)  │
                    └────────────┬────────────┘
                                 │ JDBC PreparedStatement
                                 ▼
                    ┌─────────────────────────┐
                    │      MySQL Database     │
                    │ (smart_learning_tracker)│
                    └─────────────────────────┘
```

* **Model Layer (`com.smartlearning.model`)**: Pure Java POJOs (`User`, `Subject`, `Topic`, `Task`, `StudySession`, `Goal`, `TestRecord`, `DashboardStats`, `Recommendation`).
* **DAO Layer (`com.smartlearning.dao`)**: JDBC Data Access Objects with parameter binding via `PreparedStatement` to prevent SQL injection.
* **Controller Layer (`com.smartlearning.servlet`)**: Jakarta Servlets (`@WebServlet`) handling routing and session validation.
* **View Layer (`src/main/webapp/*.jsp`)**: JSP templates utilizing JSTL Core (`jakarta.tags.core`) without raw scriptlets.

---

## 4. SYSTEM &amp; SOFTWARE REQUIREMENTS

* **Java Development Kit (JDK)**: JDK 17 LTS or higher.
* **Application Server**: Apache Tomcat 10.1.x (supports Jakarta EE 10 / Servlet 6.0).
* **Database**: MySQL Server 8.0 or higher.
* **IDE**: Eclipse IDE for Enterprise Java and Web Developers (2022-09 or later).
* **Build Tool**: Apache Maven (bundled within Eclipse).

---

## 5. DATABASE SCHEMA (`database.sql`)

The application database is named `smart_learning_tracker`. It contains the following tables:

1. `users`: Stores user credentials (`id`, `name`, `email`, `password_hash`, `salt`, `created_at`).
2. `subjects`: Academic subjects (`id`, `user_id`, `name`, `description`, `priority`, `target_percentage`).
3. `topics`: Syllabus topics (`id`, `subject_id`, `name`, `description`, `difficulty`, `status`, `progress_percentage`, `confidence_level`, `last_studied`, `revision_count`).
4. `tasks`: Action items (`id`, `user_id`, `subject_id`, `topic_id`, `title`, `priority`, `due_date`, `estimated_minutes`, `status`).
5. `study_sessions`: Logged study periods (`id`, `user_id`, `subject_id`, `topic_id`, `study_date`, `start_time`, `end_time`, `duration_minutes`, `notes`).
6. `goals`: Learning targets (`id`, `user_id`, `title`, `target_value`, `current_value`, `unit`, `deadline`, `status`).
7. `tests`: Internal marks (`id`, `user_id`, `subject_id`, `test_name`, `test_date`, `marks_obtained`, `total_marks`, `percentage`, `notes`).
8. `achievements` & `user_achievements`: Milestone badges and unlocked rewards.

---

## 6. STEP-BY-STEP SETUP IN ECLIPSE IDE

### Step 1: Install Prerequisites
1. Install **JDK 17** from Oracle or Eclipse Adoptium (Temurin 17). Ensure `JAVA_HOME` is set.
2. Install **MySQL Server 8.0** and start the MySQL service.
3. Download **Apache Tomcat 10.1.x** (zip / tar.gz) and extract to a permanent directory (e.g. `C:\apache-tomcat-10.1.x` or `/opt/tomcat10`).
4. Install **Eclipse IDE for Enterprise Java and Web Developers**.

### Step 2: Set up the MySQL Database
1. Open MySQL Workbench or your terminal command line:
   ```bash
   mysql -u root -p
   ```
2. Run the provided database script:
   ```sql
   source /path/to/database.sql;
   ```
   Or open `database.sql` inside MySQL Workbench and click **Execute (⚡)**.
3. Verify that the database `smart_learning_tracker` has been created with all 8 tables and sample seed data.

### Step 3: Configure Database Credentials in Java
1. Open `SmartLearningProgressTracker/src/main/java/com/smartlearning/util/DBConnection.java`.
2. Update the credentials if your local MySQL uses a different username or password:
   ```java
   private static final String USERNAME = "root";
   private static final String PASSWORD = "root"; // Update to your MySQL root password
   ```

### Step 4: Import the Project into Eclipse
1. Open Eclipse IDE.
2. Click **File &rarr; Import...**
3. Select **Maven &rarr; Existing Maven Projects** and click **Next**.
4. In **Root Directory**, browse to the folder containing `pom.xml` (`SmartLearningProgressTracker`).
5. Ensure `pom.xml` is checked and click **Finish**.
6. Eclipse will automatically resolve dependencies:
   * `jakarta.servlet-api:6.0.0`
   * `mysql-connector-j:8.3.0`
   * `jakarta.servlet.jsp.jstl:3.0.1`

### Step 5: Configure Apache Tomcat in Eclipse
1. In the Eclipse bottom panel, select the **Servers** tab.
   *(If not visible, go to **Window &rarr; Show View &rarr; Other... &rarr; Server &rarr; Servers**)*.
2. Click **No servers are available. Click this link to create a new server...**
3. Under **Apache**, select **Tomcat v10.1 Server** and click **Next**.
4. Set the **Tomcat installation directory** to where you extracted Tomcat 10.1.
5. In **JRE**, select **Java 17 (or workspace default)**. Click **Next**.
6. Under **Available Projects**, select `SmartLearningProgressTracker`, click **Add >** to move it to **Configured**, and click **Finish**.

### Step 6: Run the Application
1. Right-click **Tomcat v10.1 Server** in the Servers tab and select **Start**.
2. Open your web browser and navigate to:
   ```
   http://localhost:8080/SmartLearningProgressTracker/
   ```
3. Use the demo credentials to log in:
   * **Email**: `student@college.edu`
   * **Password**: `password123`

---

## 7. FINAL VERIFICATION & TEST CHECKLIST

| # | Checkpoint | Verification Method | Status |
|---|---|---|---|
| 1 | Compilation | Maven build and Eclipse build cleanly without errors | Verified |
| 2 | Jakarta EE 10 / Servlet 6.0 | Consistently uses `jakarta.servlet.*` across all servlets and filters | Verified |
| 3 | Registration & Validation | Register a new user; validates email format, password match, duplicate email check | Verified |
| 4 | Authentication | Login with salted SHA-256 hash comparison; invalid logins rejected | Verified |
| 5 | Security Filter | Direct URL access to `/dashboard` without session redirects to `/login.jsp` | Verified |
| 6 | User Isolation | Queries filter by `user_id = ?`; students cannot access peers' records | Verified |
| 7 | Subject CRUD | Add subject with target percentage; update and delete subjects | Verified |
| 8 | Topic CRUD & Progress | Add topic, adjust progress slider, update confidence rating, +1 revision count | Verified |
| 9 | Task Filtering | Filter tasks by All, Pending, In Progress, Completed, Overdue | Verified |
| 10 | Live Stopwatch | Start, pause, reset timer, and log elapsed minutes directly to database | Verified |
| 11 | Study Streak Calculation | Streak dynamically derived from distinct study session dates | Verified |
| 12 | Goal Management | Track progress towards numerical targets (hours, topics) | Verified |
| 13 | Test Percentage | Percentage computed via `(marks_obtained / total_marks) * 100` | Verified |
| 14 | Dashboard Metrics | Live calculations for hours, topics, streak, test average | Verified |
| 15 | Recommendation Engine | Rule-based suggestions triggered by lagging progress, low tests, and deadlines | Verified |
| 16 | AI Study Assistant | 5 consultation prompts return targeted advice from database records | Verified |
| 17 | Study Planner | Generates 7-day schedule allocating hours to weak topics | Verified |
| 18 | Resource Safety | All DAOs use try-with-resources to close Connection, Statement, and ResultSet | Verified |
| 19 | SQL Injection Prevention | All user inputs bound through `PreparedStatement` | Verified |
| 20 | Clean Views | Zero Java business logic in JSPs; clean JSTL and EL tags | Verified |
