package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.PermissionCreationRequest;
import org.example.advancedrealestate_be.dto.request.PermissionUpdateRequest;
import org.example.advancedrealestate_be.dto.response.PermissionResponse;
import org.example.advancedrealestate_be.entity.Permission;

public interface PermissionMapper {
    Permission toRequest(PermissionCreationRequest request);
    void toUpdateRequest(Permission permission, PermissionUpdateRequest request);
    PermissionResponse toResponse(Permission permission);
}
