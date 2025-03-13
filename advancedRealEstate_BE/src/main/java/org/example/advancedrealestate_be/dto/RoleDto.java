package org.example.advancedrealestate_be.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleDto {
    private Long id; // Assuming you have an ID for each role
    private String code; // Role code (e.g., "admin", "manager", etc.)
    private String name; // Role name (e.g., "Administrator", "Manager", etc.)
}
