package org.example.advancedrealestate_be.dto.request;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionHistoryRequest {
    private double bidAmount;
    private String bidTime;
    private String messageBidId;
    private String auction_id;
    private String client_id;
}
