package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.entity.Customers;

public interface EmailService {
     void sendVerificationEmail(Customers customer, String token);
     void sendEmail(String to, String subject, String body);
}
