package com.bluelagoon.hotel.repository;

import com.bluelagoon.hotel.entity.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT r FROM Room r WHERE r.id = :id")
        Optional<Room> findByIdWithLock(@Param("id") Long id);

        @Query("SELECT DISTINCT r FROM Room r WHERE " +
                        "(:roomType IS NULL OR r.roomType = :roomType) AND " +
                        "(:minPrice IS NULL OR r.pricePerNight >= :minPrice) AND " +
                        "(:maxPrice IS NULL OR r.pricePerNight <= :maxPrice) AND " +
                        "(:maxGuests IS NULL OR r.maxGuests >= :maxGuests)")
        List<Room> findAvailableRooms(
                        @Param("roomType") String roomType,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        @Param("maxGuests") Integer maxGuests);
        // Note: Availability check with dates requires joining with bookings, will
        // implement later in Service
}
