package com.bluelagoon.hotel.service;

import com.bluelagoon.hotel.dto.AuthResponse;
import com.bluelagoon.hotel.dto.LoginRequest;
import com.bluelagoon.hotel.dto.RegisterRequest;
import com.bluelagoon.hotel.entity.Role;
import com.bluelagoon.hotel.entity.User;
import com.bluelagoon.hotel.repository.UserRepository;
import com.bluelagoon.hotel.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                var user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .phoneNumber(request.getPhoneNumber())
                                .role(Role.USER) // Default role
                                .build();

                userRepository.save(user);

                var jwtToken = jwtUtils.generateToken(user);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .message("User registered successfully")
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .userId(user.getId())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                var jwtToken = jwtUtils.generateToken(user);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .message("Login successful")
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .userId(user.getId())
                                .build();
        }
}
