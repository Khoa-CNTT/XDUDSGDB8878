package org.example.advancedrealestate_be.dto.response;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.Null;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String first_name;
    String last_name;
    String user_name;
    Integer status;
    String email;
    String gender;
    String phone_number;
    String birthday;
    String avatar;
    String address;
    String roles;
    List<String> permission; // Danh sách các permission
    String role_id;
    String role_type;
//    Set<RoleResponse> roles;
}