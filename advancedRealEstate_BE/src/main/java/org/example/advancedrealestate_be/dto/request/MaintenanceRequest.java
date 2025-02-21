package org.example.advancedrealestate_be.dto.request;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.entity.Building;


import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaintenanceRequest {

    private LocalDate maintenance_date;
    private String description;
    private Double cost;
    private String customerId;
    private String buildingId;
}
