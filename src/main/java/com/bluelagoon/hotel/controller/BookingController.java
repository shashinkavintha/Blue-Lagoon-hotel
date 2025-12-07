package com.bluelagoon.hotel.controller;

import com.bluelagoon.hotel.dto.BookingRequest;
import com.bluelagoon.hotel.entity.Booking;
import com.bluelagoon.hotel.entity.User;
import com.bluelagoon.hotel.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    // Explicitly allow this endpoint without authentication
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            System.out.println("!!! BOOKING CREATION REQUEST !!! UserID from FE=" + request.getUserId());
            if (request.getUserId() == null) {
                System.out.println("!!! WARNING: UserID is NULL in request !!!");
                return ResponseEntity.badRequest().body("User ID is required. Please logout and login again.");
            }
            Booking booking = bookingService.createBooking(request.getUserId(), request);
            System.out.println("!!! BOOKING CREATED !!! ID=" + booking.getId());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("!!! BOOKING CRASH !!! " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(java.util.Collections.singletonMap("message", "Error creating booking: " + e.getMessage()));
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for Auth Bypass
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getUserBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @GetMapping("/user/{userId}") // Public endpoint for "Escape Hatch" retrieval
    public ResponseEntity<List<Booking>> getUserBookingsById(@PathVariable Long userId) {
        System.out.println("!!! GET BOOKINGS REQUEST !!! UserID=" + userId);
        List<Booking> bookings = bookingService.getUserBookings(userId);
        System.out.println("!!! BOOKINGS FOUND: " + bookings.size());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Booking> getBookingByCode(@PathVariable String code) {
        return ResponseEntity.ok(bookingService.getBookingByCode(code));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }
}
