package org.example.advancedrealestate_be.dto.request;

import lombok.Getter;

@Getter
public class UpdateInfoUserRequest {

    String first_name;
    String last_name;
    String phone_number;
    String address;
    String birthday;
    String gender;
}
