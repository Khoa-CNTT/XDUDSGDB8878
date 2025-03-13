package org.example.advancedrealestate_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor // Constructor có tham số
@NoArgsConstructor  // Constructor không tham số
public class RolePermissionResponse {
    private String roleId;
    private List<Integer> permissions;
}
