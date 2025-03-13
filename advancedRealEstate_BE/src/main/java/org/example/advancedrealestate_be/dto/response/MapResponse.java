package org.example.advancedrealestate_be.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MapResponse {
    private String id;
    private String map_name;
    private String latitude;
    private String longitude;
    private String address;
    private String province;
    private String district;
    private String ward;
}
