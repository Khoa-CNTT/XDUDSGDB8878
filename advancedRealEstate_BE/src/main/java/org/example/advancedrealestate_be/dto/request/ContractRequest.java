package org.example.advancedrealestate_be.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractRequest {
    private String contractName;
//    private String contractDetails;
    private String customerId;  // ID of the customer associated with the contract
    private String buildingId;  // ID of the building associated with the contract
    private String userId;      // ID of the user associated with the contract
}
