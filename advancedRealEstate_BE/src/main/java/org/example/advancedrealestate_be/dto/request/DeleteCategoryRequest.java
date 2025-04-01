package org.example.advancedrealestate_be.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeleteCategoryRequest {
    @NotEmpty(message = "The list of IDs cannot be empty")
    List<String> ids;
}
