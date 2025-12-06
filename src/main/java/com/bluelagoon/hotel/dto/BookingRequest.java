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
}
