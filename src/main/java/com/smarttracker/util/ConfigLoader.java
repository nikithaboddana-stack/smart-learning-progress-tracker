package com.smarttracker.util;

/**
 * Loads configuration properties and API credentials.
 * Ensures API keys are resolved server-side and never exposed to the client browser.
 */
public class ConfigLoader {

    private static final String DEFAULT_AI_KEY = "";

    /**
     * Resolves the AI Assistant API Key from environment or defaults.
     */
    public static String getAiApiKey() {
        String key = System.getenv("GEMINI_API_KEY");
        if (key != null && !key.trim().isEmpty()) {
            return key.trim();
        }

        key = System.getenv("AI_API_KEY");
        if (key != null && !key.trim().isEmpty()) {
            return key.trim();
        }

        key = System.getProperty("AI_API_KEY");
        if (key != null && !key.trim().isEmpty()) {
            return key.trim();
        }

        return DEFAULT_AI_KEY;
    }

    public static String getGeminiModel() {
        String model = System.getenv("GEMINI_MODEL");
        return (model != null && !model.trim().isEmpty()) ? model.trim() : "gemini-2.5-flash";
    }
}
