package com.smarttracker.service;

import com.smarttracker.dao.UserDAO;
import com.smarttracker.model.User;
import com.smarttracker.util.PasswordHasher;

public class UserService {

    private final UserDAO userDAO = new UserDAO();

    public User authenticate(String emailOrUsername, String plainPassword) {
        if (emailOrUsername == null || plainPassword == null || emailOrUsername.trim().isEmpty()) {
            return null;
        }

        User user = userDAO.findByEmailOrUsername(emailOrUsername.trim());
        if (user != null && "ACTIVE".equalsIgnoreCase(user.getStatus())) {
            if (PasswordHasher.verify(plainPassword, user.getPasswordHash())) {
                return user;
            }
        }
        return null;
    }

    public String register(User user, String plainPassword, String confirmPassword) {
        if (user.getName() == null || user.getName().trim().isEmpty() ||
            user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "Please fill in all required fields.";
        }

        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return "Invalid email address format.";
        }

        if (plainPassword == null || plainPassword.length() < 6) {
            return "Password must be at least 6 characters long.";
        }

        if (!plainPassword.equals(confirmPassword)) {
            return "Passwords do not match.";
        }

        if (userDAO.isEmailOrUsernameTaken(user.getEmail(), user.getUsername())) {
            return "An account with this email or username already exists.";
        }

        user.setPasswordHash(PasswordHasher.hash(plainPassword));
        user.setRole("STUDENT");
        user.setStatus("ACTIVE");

        boolean created = userDAO.register(user);
        return created ? null : "Database registration failed. Please try again.";
    }

    public User getUserById(int id) {
        return userDAO.findById(id);
    }

    public boolean updateProfile(User user) {
        return userDAO.updateProfile(user);
    }

    public boolean changePassword(int userId, String currentPassword, String newPassword) {
        User user = userDAO.findById(userId);
        if (user != null && PasswordHasher.verify(currentPassword, user.getPasswordHash())) {
            String newHash = PasswordHasher.hash(newPassword);
            return userDAO.updatePassword(userId, newHash);
        }
        return false;
    }
}
