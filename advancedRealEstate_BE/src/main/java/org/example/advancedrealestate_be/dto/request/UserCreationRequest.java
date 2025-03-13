package org.example.advancedrealestate_be.dto.request;


import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.validator.DobConstraint;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.validator.DobConstraint;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 4, message = "USERNAME_TOO_SHORT")
    String user_name;

    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    @Email(message = "EMAIL_INVALID_FORMAT")
    @NotBlank(message = "EMAIL_REQUIRED")
    @Size(min = 4, message = "EMAIL_TOO_SHORT")
    String email;

    String first_name;
    String last_name;
    Integer status;
    String phone_number;
    String birthday;
    MultipartFile avatar;
    String address;
    String role_id;
}
