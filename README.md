# SMART LEARNING PROGRESS TRACKER
### Advanced Java Web Application (Jakarta Servlet 6.0 • JSP • JDBC • MySQL • Apache Tomcat 10.1+)

For complete documentation, architectural diagrams, MySQL database schema, step-by-step Eclipse IDE and Tomcat 10.1 setup instructions, see `SmartLearningProgressTracker/README.md`.

## Quick Run in Eclipse IDE
1. Ensure **JDK 17**, **Apache Tomcat 10.1+**, and **MySQL 8.0+** are installed.
2. Execute `database.sql` in MySQL to create the `smart_learning_tracker` database and seed data.
3. Verify MySQL credentials in `SmartLearningProgressTracker/src/main/java/com/smartlearning/util/DBConnection.java`.
4. In Eclipse: **File → Import → Maven → Existing Maven Projects**, select `SmartLearningProgressTracker`.
5. Add project to **Tomcat 10.1 Server** and Start.
6. Open `http://localhost:8080/SmartLearningProgressTracker/`
7. Demo login: `student@college.edu` / `password123`
