package org.example.advancedrealestate_be.dto.response;


import lombok.*;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Map;
import org.example.advancedrealestate_be.entity.TypeBuilding;
import org.example.advancedrealestate_be.entity.User;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionResponse {
    private String id;
    private String name;
    private String start_date;
    private String start_time;
    private String end_time;
    private String description;
    private boolean isActive;
    private Building building;
    private TypeBuilding typeBuilding;
    private Map map;
    private User userCreatedBy;
    private String identity_key;
    List<String> buildingImages = new ArrayList<>();
}
