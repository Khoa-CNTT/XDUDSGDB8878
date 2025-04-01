package org.example.advancedrealestate_be.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ServiceDto {
    private String id;
    private String name;
    private double price;
}
