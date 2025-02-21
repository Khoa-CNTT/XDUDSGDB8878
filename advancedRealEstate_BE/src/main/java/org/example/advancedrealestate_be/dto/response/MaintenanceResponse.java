package org.example.advancedrealestate_be.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaintenanceResponse {
    private String id;
    private LocalDate maintenance_date;
    private String description;
    private Double cost;
    private String buildingId;
    private String customerId;

    private String full_name;
    private String building_name;
}
