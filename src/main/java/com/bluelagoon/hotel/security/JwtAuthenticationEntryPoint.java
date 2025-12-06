package com.bluelagoon.hotel.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();
        
        System.out.println("JwtAuthenticationEntryPoint: Request = " + method + " " + requestPath);
        System.out.println("JwtAuthenticationEntryPoint: auth_error attribute = " + request.getAttribute("auth_error"));
        
        String errorReason = (String) request.getAttribute("auth_error");
        String message = errorReason != null ? errorReason : "Full authentication is required to access this resource";

        System.out.println("JwtAuthenticationEntryPoint: Sending 401 - " + message);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        response.getWriter().write("{\"message\": \"Unauthorized: " + message + "\"}");
    }
}
