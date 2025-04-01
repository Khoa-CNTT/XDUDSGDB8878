package org.example.advancedrealestate_be.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "messages")
@Getter
@Setter
public class Message {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_index", unique = true, nullable = false)
    private Integer messageIndex;
    private String roomName;

    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "TEXT")
    private String bot_ai;
    private String type;

    @CreationTimestamp
    private LocalDateTime createdOn;
    @UpdateTimestamp
    private LocalDateTime updatedOn;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = true)
    @JsonBackReference("message-users")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = true)
    @JsonBackReference("message-users")
    private User recipient;
}
