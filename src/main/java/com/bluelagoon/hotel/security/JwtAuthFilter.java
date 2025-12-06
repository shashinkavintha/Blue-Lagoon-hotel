package com.bluelagoon.hotel.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // Check for booking POST requests - be more explicit
        boolean isBookingPost = "POST".equals(method) && path != null && (
            path.equals("/api/bookings") || 
            path.endsWith("/api/bookings") ||
            path.startsWith("/api/bookings")
        );
        
        boolean shouldSkip = path.startsWith("/api/auth/") 
            || path.startsWith("/api/public/")
            || isBookingPost
            || path.startsWith("/uploads/");
        
        System.out.println("JwtAuthFilter.shouldNotFilter: path=" + path + ", method=" + method + ", isBookingPost=" + isBookingPost + ", shouldSkip=" + shouldSkip);
        
        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        System.out.println("JwtAuthFilter: Incoming Request -> " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("JwtAuthFilter: Authorization Header -> "
                + (authHeader != null ? authHeader.substring(0, Math.min(authHeader.length(), 20)) + "..." : "NULL"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("JwtAuthFilter: No Bearer token found in header");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtUtils.extractUsername(jwt);
            System.out.println("JwtAuthFilter: Extracted email: " + userEmail);
        } catch (Exception e) {
            System.out.println("JwtAuthFilter: Failed to extract username from token: " + e.getMessage());
            request.setAttribute("auth_error", "Token extraction failed: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("JwtAuthFilter: Authentication successful for user: " + userEmail);
                } else {
                    System.out.println("JwtAuthFilter: Token invalid for user: " + userEmail);
                    request.setAttribute("auth_error", "Invalid token for user: " + userEmail);
                }
            } catch (Exception e) {
                System.out.println("JwtAuthFilter: User lookup failed: " + e.getMessage());
                request.setAttribute("auth_error", "User lookup failed: " + e.getMessage());
            }
        } else {
            if (userEmail == null) {
                System.out.println("JwtAuthFilter: Skipped auth because userEmail is null");
                request.setAttribute("auth_error", "Token missing subject/email");
            } else {
                System.out.println("JwtAuthFilter: Skipped auth because SecurityContext is already set");
                // This might not be an error, but worth noting if debugging
            }
        }

        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("JwtAuthFilter (Exit): Context Auth = "
                + (auth != null ? auth.getName() + " " + auth.getAuthorities() : "NULL"));

        filterChain.doFilter(request, response);
    }
}
