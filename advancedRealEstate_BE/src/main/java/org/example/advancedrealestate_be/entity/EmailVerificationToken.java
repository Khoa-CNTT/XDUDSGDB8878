package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "email_verification_token")
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private LocalDateTime expiryDate;

    @ManyToOne
    @JoinColumn(name = "user_id")  // This is the only place where user_id should be mapped
    private User user;

    // Token expires after 24 hours (or your desired duration)
    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }
}
