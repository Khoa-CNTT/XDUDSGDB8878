package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.RoleCreationRequest;
import org.example.advancedrealestate_be.dto.request.RoleUpdateRequest;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Role;

public interface RoleMapper {
    Role toRequest(RoleCreationRequest request);
    void toUpdateRequest(Role role, RoleUpdateRequest request);
    RoleResponse toResponse(Role role);
}
