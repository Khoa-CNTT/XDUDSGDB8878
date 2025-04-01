package org.example.advancedrealestate_be.dto.request;


import lombok.*;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionDetailRequest {
    private String note;
    private String result;
    private double bidAmount;
    private String status;
    private String auction_id;
    private String client_id;
}
