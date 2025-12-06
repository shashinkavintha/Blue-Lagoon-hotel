package com.bluelagoon.hotel.controller;

import com.bluelagoon.hotel.dto.DashboardStats;
import com.bluelagoon.hotel.repository.BookingRepository;
import com.bluelagoon.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long totalBookings = bookingRepository.count();
        long totalRooms = roomRepository.count();
        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return ResponseEntity.ok(DashboardStats.builder()
                .totalBookings(totalBookings)
                .totalRooms(totalRooms)
                .totalRevenue(totalRevenue)
                .build());
    }
}
