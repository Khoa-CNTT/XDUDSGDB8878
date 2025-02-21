package org.example.advancedrealestate_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TypeBuildingCreateResquest {
    @NotBlank(message = "Name is required and cannot be empty")
    String type_name;

    @NotNull(message = "Status cannot be null")
    Integer status;
    @NotNull(message = "Price cannot be null")
    Double price;
}
