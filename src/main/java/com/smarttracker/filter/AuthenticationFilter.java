package com.smarttracker.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter("/*")
public class AuthenticationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());

        // Public resources
        boolean isPublic = path.equals("/") ||
                           path.equals("/index.jsp") ||
                           path.equals("/login") ||
                           path.equals("/register") ||
                           path.equals("/logout") ||
                           path.startsWith("/css/") ||
                           path.startsWith("/js/") ||
                           path.startsWith("/images/") ||
                           path.startsWith("/api/health");

        HttpSession session = httpRequest.getSession(false);
        boolean isLoggedIn = (session != null && session.getAttribute("userId") != null);

        if (isPublic || isLoggedIn) {
            chain.doFilter(request, response);
        } else {
            httpResponse.sendRedirect(httpRequest.getContextPath() + "/login?error=Please+sign+in+to+continue");
        }
    }

    @Override
    public void destroy() {}
}
