package com.bluelagoon.hotel.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/db-test")
@RequiredArgsConstructor
public class DbTestController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    public String testDatabaseConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return "Database Connection Successful! System is working.";
        } catch (Exception e) {
            return "Database Connection FAILED: " + e.getMessage();
        }
    }
}
