package com.bluelagoon.hotel.repository;

import com.bluelagoon.hotel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

        Optional<Booking> findByBookingCode(String bookingCode);

        List<Booking> findByUserId(Long userId);

        @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND " +
                        "((b.checkInDate <= :checkOutDate) AND (b.checkOutDate >= :checkInDate)) AND " +
                        "b.status != 'CANCELLED'")
        List<Booking> findBookingsByRoomAndDates(@Param("roomId") Long roomId,
                        @Param("checkInDate") LocalDate checkInDate,
                        @Param("checkOutDate") LocalDate checkOutDate);

        @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'CONFIRMED'")
        BigDecimal calculateTotalRevenue();
}
