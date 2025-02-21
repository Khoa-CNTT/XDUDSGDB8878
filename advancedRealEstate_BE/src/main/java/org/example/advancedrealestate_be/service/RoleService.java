package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Role;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RoleService {
    JSONObject createRole(RoleCreationRequest request);
    String updateRole(String userId, RoleUpdateRequest request);
    String deleteRole(String RoleId);
    Page<RoleResponse> getBuilding(int page, int size);
    String deleteRoles(DeleteRoleRequest request);
    List<RoleResponse> getAllRoles();

    List<RoleResponse> findRolesByType(String type);
}
