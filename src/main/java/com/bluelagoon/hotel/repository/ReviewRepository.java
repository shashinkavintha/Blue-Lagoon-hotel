package com.bluelagoon.hotel.repository;

import com.bluelagoon.hotel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
