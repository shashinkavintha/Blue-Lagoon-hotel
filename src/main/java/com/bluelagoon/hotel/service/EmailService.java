package com.bluelagoon.hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.scheduling.annotation.Async
    public void sendBookingNotification(String toEmail, String subject, String body) {
        System.out.println(">>> STARTING EMAIL SEND PROCESS >>>");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("shashinkavintha@gmail.com");
            message.setTo(toEmail);
            message.setText(body);
            message.setSubject(subject);

            mailSender.send(message);

            System.out.println(">>> EMAIL SENT SUCCESSFULLY to " + toEmail + " >>>");
        } catch (Exception e) {
            System.err.println("!!! EMAIL SENDING FAILED !!!");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
