package com.smartlearning.servlet;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Security Filter intercepting incoming HTTP requests.
 * Enforces session authentication and role-based authorization (Student vs Admin).
 */
@WebFilter("/*")
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String contextPath = httpRequest.getContextPath();
        String uri = httpRequest.getRequestURI().substring(contextPath.length());

        // Static resources and public routes allowed without authentication
        boolean isPublic = uri.equals("/") ||
                           uri.equals("/index.jsp") ||
                           uri.equals("/login") ||
                           uri.equals("/login.jsp") ||
                           uri.equals("/register") ||
                           uri.equals("/register.jsp") ||
                           uri.startsWith("/css/") ||
                           uri.startsWith("/js/") ||
                           uri.startsWith("/images/") ||
                           uri.startsWith("/favicon.ico");

        HttpSession session = httpRequest.getSession(false);
        boolean isLoggedIn = (session != null && session.getAttribute("userId") != null);

        if (isPublic) {
            chain.doFilter(request, response);
            return;
        }

        if (!isLoggedIn) {
            httpResponse.sendRedirect(contextPath + "/login.jsp?msg=Please+log+in+to+continue");
            return;
        }

        // Role-based protection: /admin/* requires ADMIN role
        if (uri.startsWith("/admin/")) {
            String role = (String) session.getAttribute("role");
            if (!"ADMIN".equalsIgnoreCase(role)) {
                httpResponse.sendRedirect(contextPath + "/dashboard?error=unauthorized");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
