package com.bluelagoon.hotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BlueLagoonHotelApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlueLagoonHotelApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner commandLineRunner(
            com.bluelagoon.hotel.repository.BookingRepository bookingRepository) {
        return args -> {
            System.out.println("!!! STARTUP DB CHECK !!!");
            long count = bookingRepository.count();
            System.out.println("!!! CURRENT BOOKING COUNT: " + count + " !!!");

            if (count > 0) {
                System.out.println("!!! DATA EXISTS - API RETRIEVAL ISSUE !!!");
                bookingRepository.findAll().forEach(b -> System.out.println(
                        "Booking: " + b.getId() + " User: " + (b.getUser() != null ? b.getUser().getId() : "null")));
            } else {
                System.out.println("!!! DATABASE IS EMPTY - PERSISTENCE ISSUE !!!");
            }
        };
    }
}
