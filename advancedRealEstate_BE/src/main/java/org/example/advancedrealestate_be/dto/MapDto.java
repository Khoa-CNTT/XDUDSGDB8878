package org.example.advancedrealestate_be.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MapDto {

    private String id;
    private String map_name;
    private String latitude;
    private String longitude;
    private String address;
    private String province;
    private String district;
    private String ward;
}
