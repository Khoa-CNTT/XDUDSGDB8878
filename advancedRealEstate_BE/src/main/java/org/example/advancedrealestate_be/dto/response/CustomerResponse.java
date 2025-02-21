package org.example.advancedrealestate_be.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.entity.Contracts;
import org.example.advancedrealestate_be.entity.Customers;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phoneNumber;

    public CustomerResponse(Customers customer) {
        this.id = customer.getId();
        this.firstName = customer.getFirstName();
        this.lastName = customer.getLastName();
        this.userName = customer.getUserName();
        this.email = customer.getEmail();
        this.phoneNumber = customer.getPhoneNumber();
    }


}
