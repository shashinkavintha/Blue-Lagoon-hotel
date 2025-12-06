package com.bluelagoon.hotel.config;

import com.bluelagoon.hotel.entity.Role;
import com.bluelagoon.hotel.entity.User;
import com.bluelagoon.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            if (!userRepository.existsByEmail("admin@bluelagoon.com")) {
                User admin = User.builder()
                        .email("admin@bluelagoon.com")
                        .password(passwordEncoder.encode("admin123"))
                        .name("Admin User")
                        .role(Role.ADMIN)
                        .phoneNumber("1234567890")
                        .build();

                userRepository.save(admin);
                log.info("Admin user created: admin@bluelagoon.com / admin123");
            } else {
                log.info("Admin user already exists.");
            }
        };
    }
}
