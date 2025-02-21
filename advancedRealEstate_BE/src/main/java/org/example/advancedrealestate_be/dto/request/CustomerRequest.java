package org.example.advancedrealestate_be.dto.request;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.entity.Contracts;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerRequest {
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phoneNumber;
    private String password;
}
