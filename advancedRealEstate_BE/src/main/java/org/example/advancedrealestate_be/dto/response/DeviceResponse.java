package org.example.advancedrealestate_be.dto.response;

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
public class DeviceResponse {
    private String id;
    private String device_name;
    private LocalDate installation_date;
    private int status;
    private double price;
    private String description;
    private String id_building;
    private String building_name;
    private String id_category;
    private String category_name;
}
