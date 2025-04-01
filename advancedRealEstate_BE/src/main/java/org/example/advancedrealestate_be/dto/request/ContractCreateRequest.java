package org.example.advancedrealestate_be.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractCreateRequest {
    private String contract_code;
    private String full_name;
    private Date birth_date;
    private String email;
    private String phone;
    private String address;
    private Date start_date;
    private Date end_date;
    private String cccdid;
    private String place_of_issue;
    private Double price;
    private Double total_amount;
    private Integer status;
}
