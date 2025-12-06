package com.bluelagoon.hotel.controller;

import com.bluelagoon.hotel.entity.Booking;
import com.bluelagoon.hotel.repository.BookingRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingRepository bookingRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody PaymentRequest request)
            throws StripeException {
        // ... (existing logic if needed, or remove)
        // Kept for backward compatibility or reference
        return ResponseEntity.ok(Map.of("message", "Use /create-checkout-session instead"));
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody PaymentRequest request)
            throws StripeException {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTotalPrice() == null) {
            throw new RuntimeException("Booking price is invalid");
        }

        // Stripe expects amount in cents
        long amountInCents = BigDecimal.valueOf(booking.getTotalPrice()).multiply(BigDecimal.valueOf(100)).longValue();

        com.stripe.param.checkout.SessionCreateParams params = com.stripe.param.checkout.SessionCreateParams.builder()
                .setMode(com.stripe.param.checkout.SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/my-bookings?success=true")
                .setCancelUrl("http://localhost:5173/rooms/" + booking.getRoom().getId() + "?canceled=true")
                .addLineItem(com.stripe.param.checkout.SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amountInCents)
                                .setProductData(
                                        com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData.ProductData
                                                .builder()
                                                .setName("Room Booking: " + booking.getRoom().getRoomType())
                                                .build())
                                .build())
                        .build())
                .build();

        com.stripe.model.checkout.Session session = com.stripe.model.checkout.Session.create(params);

        return ResponseEntity.ok(Map.of("url", session.getUrl()));
    }

    @Data
    public static class PaymentRequest {
        private Long bookingId;
    }
}
