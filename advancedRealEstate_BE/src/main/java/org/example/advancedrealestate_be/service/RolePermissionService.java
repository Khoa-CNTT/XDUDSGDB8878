package org.example.advancedrealestate_be.service;

import java.util.List;

public interface RolePermissionService {
    List<String> getRolePermissionsWithRoleId(String roleId);
    void addPermissionsToRole(String roleId, List<Long> permissionIds);
    void deletePermissionsFromRole(String roleId, List<Long> permissionIds);
}
