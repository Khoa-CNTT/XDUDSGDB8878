package org.example.advancedrealestate_be.dto.request;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateBuildingRequest {
    private String id;
    private String name;
    private String structure;
    private String area;
    private String type;
    private String description;
    private int number_of_basement;
    private double price;
    private String map_id;
}
