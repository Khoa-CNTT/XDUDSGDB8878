package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.entity.Customers;

import java.util.Date;

public interface EmailService {
     void sendVerificationEmail(Customers customer, String token);
     void sendEmail(String to, String subject, String body);
     void sendEmailHasTemplate(String to, String subject, Date deadline, String templateName);

     void sendEmailHasTemplate(
             String to,
             String subject,
             String templateName,
             String clientName,
             String contractId,
             Date settingDate,
             Date approvalDate,
             String staffName);

     void sendEmailHasTemplate(
             String to,
             String subject,
             String templateName,
             String clientName,
             String buildingName,
             String auctionId,
             String winningBid,
             String auctionDate,
             Date confirmDate,
             String staffName);
}
