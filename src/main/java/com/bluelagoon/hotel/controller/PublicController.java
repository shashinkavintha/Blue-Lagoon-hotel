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
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam(required = false) String to) {
        try {
            String recipient = (to != null && !to.isEmpty()) ? to : "shashinkavintha@gmail.com";

            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setTo(recipient);
            message.setFrom("shashinkavintha@gmail.com");
            message.setSubject("Test Email from Blue Lagoon (Sync)");
            message.setText(
                    "If you see this, email is working! Sent synchronously and explicitly from shashinkavintha@gmail.com.");

            mailSender.send(message);

            return ResponseEntity.ok("SYNC Email Sent Successfully to " + recipient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("SYNC Email Failed: " + e.getMessage());
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(contactMessageRepository.save(message));
    }
}
