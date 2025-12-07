package com.bluelagoon.hotel.controller;

import com.bluelagoon.hotel.entity.ContactMessage;
import com.bluelagoon.hotel.entity.Review;
import com.bluelagoon.hotel.entity.User;
import com.bluelagoon.hotel.repository.ContactMessageRepository;
import com.bluelagoon.hotel.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private com.bluelagoon.hotel.service.EmailService emailService;

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam(required = false) String to) {
        try {
            String recipient = (to != null && !to.isEmpty()) ? to : "shashinkavintha@gmail.com";
            emailService.sendBookingNotification(recipient, "Test Email from Blue Lagoon",
                    "If you see this, email is working!");
            return ResponseEntity.ok("Email Sent Successfully to " + recipient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Email Failed: " + e.getMessage());
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(contactMessageRepository.save(message));
    }
}
