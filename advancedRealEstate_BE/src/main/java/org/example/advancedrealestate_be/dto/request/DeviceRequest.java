package org.example.advancedrealestate_be.dto.request;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Null;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.advancedrealestate_be.entity.Building;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeviceRequest {
    
    @NonNull
    private String id_building;
    private String id_category;

    private String device_name;
    private LocalDate installation_date;
    private int status;
    private double price;

    @Null
    private String description;
}
