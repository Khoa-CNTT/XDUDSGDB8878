package org.example.advancedrealestate_be.dto;


import lombok.*;
import org.example.advancedrealestate_be.constant.EnumConstant;
import org.example.advancedrealestate_be.constant.EnumEntityConstant;
import org.example.advancedrealestate_be.entity.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BuildingDto {

    private String id;
    private String name;
    private String structure;
    private String area;
    private String type;
    private String status;
    private String description;
    private int number_of_basement;
    private double price;
    private byte[] image;
    private String file_type;
    private Map map;
}
