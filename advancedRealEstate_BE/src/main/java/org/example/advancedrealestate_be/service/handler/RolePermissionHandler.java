package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.RolePermission;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.repository.RolePermissionRepository;
import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.service.RolePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RolePermissionHandler implements RolePermissionService {
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Autowired
    public RolePermissionHandler(PermissionRepository permissionRepository, RoleRepository roleRepository, RolePermissionRepository rolePermissionRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Override
    public List<String> getRolePermissionsWithRoleId(String roleId) {
        List<String> permission = permissionRepository.findPermissionsByRoleId(roleId);
        return  permission;
    }

    @Override
    public void addPermissionsToRole(String roleId, List<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        List<RolePermission> rolePermissions = permissionIds.stream()
                .map(permissionId -> {
                    Permission permission = permissionRepository.findById(String.valueOf(permissionId))
                            .orElseThrow(() -> new RuntimeException("Permission not found with ID: " + permissionId));
                    return RolePermission.builder()
                            .role(role)
                            .permission(permission)
                            .build();
                })
                .collect(Collectors.toList());

        rolePermissionRepository.saveAll(rolePermissions);
    }

    @Override
    public void deletePermissionsFromRole(String roleId, List<Long> permissionIds) {
        List<RolePermission> rolePermissions = rolePermissionRepository.findByRoleIdAndPermissionIdIn(roleId, permissionIds);

        if (rolePermissions.isEmpty()) {
            throw new RuntimeException("No matching RolePermissions found to delete.");
        }

        rolePermissionRepository.deleteAll(rolePermissions);
    }
}
