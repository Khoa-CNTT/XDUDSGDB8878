package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.RoleCreationRequest;
import org.example.advancedrealestate_be.dto.request.RoleUpdateRequest;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.MapResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.entity.Role;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class RoleMapperImpl implements RoleMapper{
    @Override
    public Role toRequest(RoleCreationRequest request) {
        if(request == null){
            return null;
        }

        Role role = new Role();
        role.setRole_name(request.getRole_name());
        role.setRole_type(request.getRole_type());
        role.setStatus(request.getStatus());
        return  role;
    }

    @Override
    public void toUpdateRequest(Role role, RoleUpdateRequest request) {
        if (role == null || request == null) {
            return;
        }

        if(role.getRole_name() != null){
            role.setRole_name(request.getRole_name());
        }
        if(role.getStatus() != null){
            role.setStatus(request.getStatus());
        }
    }

    @Override
    public RoleResponse toResponse(Role role) {
        if (role == null) {
            return null;
        }

        return RoleResponse.builder()
                .id(role.getId())
                .role_name(role.getRole_name())
                .role_type(role.getRole_type())
                .status(role.getStatus())
                .build();
    }
}
