package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.service.PermissionRolerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionRoleHandler implements PermissionRolerService {

    private final PermissionRepository permissionRepository;
    @Autowired
    public PermissionRoleHandler(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public List<String> getRolePermissionsWithRoleId(String roleId) {
        List<String> permissions = permissionRepository.findPermissionsByRoleId(roleId);
        return  permissions;
    }
}
