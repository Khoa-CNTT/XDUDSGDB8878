package org.example.advancedrealestate_be.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;


//@Table(name = "email")
public class Email {
    @NotBlank (message ="Email cannot be blank")
   private String toEmail;
    @NotBlank (message ="Subject cannot be blank")
    private String subject;
    @NotBlank (message ="Body cannot be blank")
    private String body;

    // Getters and setters
    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }




}
