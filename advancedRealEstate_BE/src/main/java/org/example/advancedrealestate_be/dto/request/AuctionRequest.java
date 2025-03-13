package org.example.advancedrealestate_be.dto.request;


import lombok.*;
import org.example.advancedrealestate_be.entity.Building;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionRequest {

    private String name;
    private String start_date;
    private String start_time;
    private String end_time;
    private String description;
    private boolean isActive;
    private String building_id;
    private String userCreatedBy;
}
