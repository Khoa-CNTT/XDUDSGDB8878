package org.example.advancedrealestate_be.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuildingUpdateResquest {
    private String id_type_building;
    private String id_map;
    private String description;
    private String name;
    private String structure;
    private Integer status;
    private Integer number_of_basement;
    private String acreage;
}
