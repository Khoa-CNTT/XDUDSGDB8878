package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.PermissionCreationRequest;
import org.example.advancedrealestate_be.dto.request.PermissionUpdateRequest;
import org.example.advancedrealestate_be.dto.request.RoleCreationRequest;
import org.example.advancedrealestate_be.dto.request.RoleUpdateRequest;
import org.example.advancedrealestate_be.dto.response.PermissionResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapperImpl implements PermissionMapper {
    @Override
    public Permission toRequest(PermissionCreationRequest request) {
        if(request == null){
            return null;
        }

        Permission permission = new Permission();
        permission.setLink(request.getLink());
        permission.setPermissionName(request.getPermission_name());
        return permission;
    }

    @Override
    public void toUpdateRequest(Permission permission, PermissionUpdateRequest request) {
        if (permission == null || request == null) {
            return;
        }

        if(permission.getLink() != null){
            permission.setLink(request.getLink());
        }
        if(permission.getPermissionName() != null){
            permission.setPermissionName(request.getPermission_name());
        }
    }

    @Override
    public PermissionResponse toResponse(Permission permission) {
        if (permission == null) {
            return null;
        }

        return PermissionResponse.builder()
                .id(permission.getId())
                .permission_name(permission.getPermissionName())
                .link(permission.getLink())
                .build();
    }
}
