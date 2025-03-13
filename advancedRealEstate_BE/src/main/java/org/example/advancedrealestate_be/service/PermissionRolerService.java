package org.example.advancedrealestate_be.service;

import java.util.List;
public interface PermissionRolerService {
    List<String> getRolePermissionsWithRoleId(String roleId); // Trả về DTO
}
