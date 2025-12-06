package com.bluelagoon.hotel.dto;

import com.bluelagoon.hotel.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private String name;
    private String email;
    private Role role;
    private Long userId;
}
