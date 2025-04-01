package org.example.advancedrealestate_be.service.handler;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.advancedrealestate_be.model.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class SendEmailHandler {

    private final JavaMailSender mailSender;

    @Autowired
    public SendEmailHandler(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(Email email){
        MimeMessage message=mailSender.createMimeMessage();
        try{
            MimeMessageHelper helper =new MimeMessageHelper(message,true);
            helper.setFrom("nguyenngockhanhtech@gmail.com");
            helper.setTo(email.getToEmail());
            helper.setSubject(email.getSubject());
            helper.setText(email.getBody());
            mailSender.send(message);
        }catch (MessagingException e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

    }
}
