package org.example.advancedrealestate_be.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuildingResponse {
    private String id;
    private String description;
    private List<String> image;
    private String name;
    private String structure;
    private int status;
    private int number_of_basement;
    private String area;
    private MapResponse map;
    private TypeBuildingResponse typeBuilding;
}
