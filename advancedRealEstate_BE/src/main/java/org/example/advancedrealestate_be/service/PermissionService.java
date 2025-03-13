package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.DeletePermissionRequest;
import org.example.advancedrealestate_be.dto.request.PermissionCreationRequest;
import org.example.advancedrealestate_be.dto.request.PermissionUpdateRequest;
import org.example.advancedrealestate_be.dto.response.PermissionResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Permission;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PermissionService {
    String createPermission(PermissionCreationRequest request);
    String updatePermission(String permissionId, PermissionUpdateRequest request);
    String deletePermission(String permissionId);
    Page<PermissionResponse> getPermission(int page, int size);
    String deletePermissions(DeletePermissionRequest request);
    List<PermissionResponse> getAllPermissions();
}
