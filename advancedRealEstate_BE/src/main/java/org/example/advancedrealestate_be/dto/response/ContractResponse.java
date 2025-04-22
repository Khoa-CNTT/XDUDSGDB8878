package org.example.advancedrealestate_be.dto.response;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.User;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractResponse {
    private String id;
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
    private String image_signature;
    private Double price;
    private Double total_amount;
    private Integer status;
    private String file_contract;
    private String building_id; // Thay Building bằng String
    private String user_id;    // Thay User bằng String
}
