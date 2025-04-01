package org.example.advancedrealestate_be.dto.response;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.advancedrealestate_be.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageResponse {
    private String id;
    private String roomName;
    private String content;
    private String bot_ai;
    private String type;
    private Integer index;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private UserResponse sender;
}
