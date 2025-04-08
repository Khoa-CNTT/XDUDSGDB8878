package org.example.advancedrealestate_be.dto.response;


import lombok.*;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.User;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionHistoryResponse {
    private String id;
    private double bidAmount;
    private String bidTime;
    private String messageBidId;
    private String identityKey;
    private String status;
    private Auction auction;
    private BuildingResponse buildingResponse;
    private User client;
    List<String> buildingImageUrls;
}
