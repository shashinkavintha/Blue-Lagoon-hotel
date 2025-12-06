package com.bluelagoon.hotel.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStats {
    private long totalBookings;
    private long totalRooms;
    private BigDecimal totalRevenue;
}
