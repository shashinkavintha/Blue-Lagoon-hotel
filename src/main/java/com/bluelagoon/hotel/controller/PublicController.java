package com.bluelagoon.hotel.controller;

import com.bluelagoon.hotel.entity.ContactMessage;
import com.bluelagoon.hotel.entity.Review;
import com.bluelagoon.hotel.entity.User;
import com.bluelagoon.hotel.repository.ContactMessageRepository;
import com.bluelagoon.hotel.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicController {

    private final ReviewRepository reviewRepository;
    private final ContactMessageRepository contactMessageRepository;

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @PostMapping("/reviews")
    public ResponseEntity<Review> createReview(@AuthenticationPrincipal User user, @RequestBody Review review) {
        review.setUser(user);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(contactMessageRepository.save(message));
    }
}
