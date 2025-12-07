package com.bluelagoon.hotel.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(org.springframework.security.config.Customizer.withDefaults())
                .authorizeHttpRequests(req -> {
                    // Public endpoints - order matters, most specific first
                    // CRITICAL: POST /api/bookings must be explicitly allowed
                    req.requestMatchers(new AntPathRequestMatcher("/api/bookings", "POST")).permitAll();
                    req.requestMatchers(org.springframework.http.HttpMethod.POST, "/api/bookings").permitAll();
                    req.requestMatchers(org.springframework.http.HttpMethod.GET, "/api/bookings").permitAll(); // Allow
                                                                                                               // Admin
                                                                                                               // retrieval
                    req.requestMatchers("/api/auth/**").permitAll();
                    req.requestMatchers("/api/public/**").permitAll();
                    req.requestMatchers("/uploads/**").permitAll();
                    req.requestMatchers("/api/rooms/search/**").permitAll();
                    req.requestMatchers("/api/test-email").permitAll();
                    req.requestMatchers("/api/bookings/**").permitAll();
                    req.requestMatchers("/api/bookings/user/**").permitAll(); // Allow public retrieval
                    req.requestMatchers("/error").permitAll(); // Allow error page to be shown
                    req.anyRequest().authenticated();
                })
                .exceptionHandling(ex -> {
                    // Custom exception handling that logs more details
                    ex.authenticationEntryPoint((request, response, authException) -> {
                        String path = request.getRequestURI();
                        String method = request.getMethod();
                        System.out.println("Security Exception Handler: " + method + " " + path);
                        System.out.println("Security Exception Handler: Exception = " + authException.getMessage());
                        jwtAuthenticationEntryPoint.commence(request, response, authException);
                    });
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.List.of("*"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer webSecurityCustomizer() {
        // Completely bypass Spring Security for POST /api/bookings
        return (web) -> web.ignoring().requestMatchers(
                new AntPathRequestMatcher("/api/bookings", "POST"),
                new AntPathRequestMatcher("/api/bookings", "GET"), // For Admin Panel
                new AntPathRequestMatcher("/api/bookings/user/**", "GET"));
    }
}
