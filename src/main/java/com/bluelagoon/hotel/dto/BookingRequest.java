package com.bluelagoon.hotel.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numOfAdults;
    private Integer numOfChildren;
    private String specialRequests;
    private Long userId; // For temporary auth bypass

    // Guest contact fields (for booking on behalf of someone)
    private String guestName;
    private String guestEmail;
    private String guestPhone;
}
