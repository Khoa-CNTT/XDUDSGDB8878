package org.example.advancedrealestate_be.service.handler;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.username}")
    private String fromEmail;
    private final TemplateEngine templateEngine;


    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendVerificationEmail(Customers customer, String token) {
        String verificationUrl = "http://localhost:9090/api/customers/verify?token=" + token;

        String subject = "Verify Your Account";
        String body = "Hello " + customer.getFirstName() + ",\n\n"
                + "Please click the link below to verify your account:\n" + verificationUrl;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail); // Use configurable email sender
            helper.setTo(customer.getEmail());
            helper.setSubject(subject);
            helper.setText(body);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendEmailHasTemplate(String to, String subject, Date deadline, String templateName) {
        try {
            Context context = new Context();
            context.setVariable("name", "");
            context.setVariable("date", new Date());
            context.setVariable("deadline", deadline);
            context.setVariable("pendingContracts", "");
            context.setVariable("systemUrl", "http://localhost:3000/admin/auction-contract");
            String body = templateEngine.process(templateName, context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendEmailHasTemplate(
            String to,
            String subject,
            String templateName,
            String clientName,
            String contractId,
            Date settingDate,
            Date approvalDate,
            String staffName) {
        try {
            Context context = new Context();
            context.setVariable("clientName", clientName);
            context.setVariable("contractId", contractId);
            context.setVariable("settingDate", settingDate);
            context.setVariable("approvalDate", approvalDate);
            context.setVariable("staffName", staffName);
            context.setVariable("systemUrl", "http://localhost:3000/user/auction-manager");
            String body = templateEngine.process(templateName, context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendEmailHasTemplate(
            String to,
            String subject,
            String templateName,
            String clientName,
            String buildingName,
            String auctionId,
            String winningBid,
            String auctionDate,
            Date confirmDate,
            String staffName
    ) {
        try {
            Context context = new Context();
            context.setVariable("clientName", clientName);
            context.setVariable("buildingName", buildingName);
            context.setVariable("auctionId", auctionId);
            context.setVariable("winningBid", winningBid);
            context.setVariable("auctionDate", auctionDate);
            context.setVariable("confirmDate", confirmDate);
            context.setVariable("staffName", staffName);
            context.setVariable("systemUrl", "http://localhost:3000/user/auction-manager");
            String body = templateEngine.process(templateName, context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
