package com.bluelagoon.hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingNotification(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("shashinkavintha@gmail.com");
            message.setTo(toEmail);
            message.setText(body);
            message.setSubject(subject);

            System.out.println("!!! ATTEMPTING TO SEND EMAIL !!!");
            System.out.println("FROM: " + message.getFrom());
            System.out.println("TO: " + toEmail);

            mailSender.send(message);

            System.out.println("!!! EMAIL SENT SUCCESSFULLY !!! check inbox/spam");
        } catch (Exception e) {
            System.err.println("!!! EMAIL SENDING FAILED !!!");
            e.printStackTrace(); // Print full stack trace to console
        }
    }
}
