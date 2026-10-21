package com.smartlearning.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 * Utility for secure password hashing using standard Java Cryptography (SHA-256 with Salt).
 * Avoids storing plain-text passwords in the database.
 */
public class PasswordUtil {

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Generates a random cryptographic hexadecimal salt.
     */
    public static String generateSalt() {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        return bytesToHex(salt);
    }

    /**
     * Hashes password with the provided salt using SHA-256.
     *
     * @param password raw user password
     * @param salt unique hex salt
     * @return hex encoded SHA-256 hash
     */
    public static String hashPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available in Java runtime", e);
        }
    }

    /**
     * Verifies that the provided plain password matches the stored hash and salt.
     */
    public static boolean verifyPassword(String plainPassword, String storedHash, String storedSalt) {
        if (plainPassword == null || storedHash == null || storedSalt == null) {
            return false;
        }
        String calculatedHash = hashPassword(plainPassword, storedSalt);
        return calculatedHash.equalsIgnoreCase(storedHash);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
