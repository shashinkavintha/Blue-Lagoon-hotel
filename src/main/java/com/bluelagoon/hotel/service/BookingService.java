package com.bluelagoon.hotel.service;

import com.bluelagoon.hotel.dto.BookingRequest;
import com.bluelagoon.hotel.entity.Booking;
import com.bluelagoon.hotel.entity.BookingStatus;
import com.bluelagoon.hotel.entity.Room;
import com.bluelagoon.hotel.entity.User;
import com.bluelagoon.hotel.repository.BookingRepository;
import com.bluelagoon.hotel.repository.RoomRepository;
import com.bluelagoon.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public Booking createBooking(Long userId, BookingRequest request) {
        // 1. Validate User ID presence
        if (userId == null) {
            throw new RuntimeException("User ID is missing in the request. Please re-login.");
        }

        // 2. Use standard findById (Safe Mode - removed Lock)
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!isRoomAvailable(room.getId(), request)) {
            throw new RuntimeException("Room is not available for selected dates");
        }

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (days < 1)
            throw new RuntimeException("Booking must be for at least 1 night");

        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(days));

        Booking booking = Booking.builder()
                .room(room)
                .user(user)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numOfAdults(request.getNumOfAdults())
                .numOfChildren(request.getNumOfChildren())
                .specialRequests(request.getSpecialRequests())
                .totalPrice(totalPrice.doubleValue())
                .bookingCode(UUID.randomUUID().toString())
                .status(BookingStatus.CONFIRMED)
                // Guest contact fields
                .guestName(request.getGuestName())
                .guestEmail(request.getGuestEmail())
                .guestPhone(request.getGuestPhone())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("!!! DB PERSISTENCE CHECK !!! Saved Booking ID=" + savedBooking.getId());

        // 3. Email Notification (Now Async - Won't block or crash booking)
        try {
            // Determine contact info: prefer guest fields, fallback to user
            String contactName = (request.getGuestName() != null && !request.getGuestName().isEmpty())
                    ? request.getGuestName()
                    : user.getName();
            String contactEmail = (request.getGuestEmail() != null && !request.getGuestEmail().isEmpty())
                    ? request.getGuestEmail()
                    : user.getEmail();
            String contactPhone = (request.getGuestPhone() != null && !request.getGuestPhone().isEmpty())
                    ? request.getGuestPhone()
                    : (user.getPhoneNumber() != null ? user.getPhoneNumber() : "Not Provided");

            String emailBody = "NEW BOOKING ALERT\n\n" +
                    "Booked By User: " + user.getName() + " (" + user.getEmail() + ")\n\n" +
                    "Guest Contact Details:\n" +
                    "Name: " + contactName + "\n" +
                    "Email: " + contactEmail + "\n" +
                    "Phone: " + contactPhone + "\n\n" +
                    "Booking Details:\n" +
                    "Booking Code: " + savedBooking.getBookingCode() + "\n" +
                    "Room Type: " + room.getRoomType() + "\n" +
                    "Check-In: " + savedBooking.getCheckInDate() + "\n" +
                    "Check-Out: " + savedBooking.getCheckOutDate() + "\n" +
                    "Total Price: $" + savedBooking.getTotalPrice();

            emailService.sendBookingNotification("shashinkavintha@gmail.com",
                    "New Reservation: " + savedBooking.getBookingCode(), emailBody);
        } catch (Exception e) {
            System.err.println("!!! ASYNC EMAIL INITIATION FAILED (Should not happen) !!! " + e.getMessage());
        }

        return savedBooking;
    }

    private boolean isRoomAvailable(Long roomId, BookingRequest request) {
        List<Booking> existingBookings = bookingRepository.findBookingsByRoomAndDates(
                roomId, request.getCheckInDate(), request.getCheckOutDate());
        return existingBookings.isEmpty();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingByCode(String code) {
        return bookingRepository.findByBookingCode(code)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}
