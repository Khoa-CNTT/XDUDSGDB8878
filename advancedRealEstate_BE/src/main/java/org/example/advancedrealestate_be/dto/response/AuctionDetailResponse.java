package org.example.advancedrealestate_be.dto.response;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.User;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionDetailResponse {

    private String id;
    private String note;
    private String result;
    private double bidAmount;
    private String status;
    private String identity_key;
    private User client;
    private AuctionResponse auction;
    private BuildingResponse building;
    private TypeBuildingResponse typeBuildingResponse;
    List<String> buildingImageUrl = new ArrayList<>();
}
