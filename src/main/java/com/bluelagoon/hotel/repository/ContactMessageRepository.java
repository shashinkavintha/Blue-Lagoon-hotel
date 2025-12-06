package com.bluelagoon.hotel.repository;

import com.bluelagoon.hotel.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
