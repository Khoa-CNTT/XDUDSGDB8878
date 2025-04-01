package org.example.advancedrealestate_be.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String user_name;
    String first_name;
    String last_name;
    Integer status;
    String phone_number;
    LocalDate birthday;
//    String avatar;
    String address;
    String role_id;
    @NotNull
    private String email;

//    private Set<RoleRepository> roles;

}
