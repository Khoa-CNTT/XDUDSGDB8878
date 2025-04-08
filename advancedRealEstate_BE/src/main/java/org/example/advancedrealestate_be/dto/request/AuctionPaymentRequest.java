package org.example.advancedrealestate_be.dto.request;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionPaymentRequest {

    private String description;
    private double depositAmount;
}
