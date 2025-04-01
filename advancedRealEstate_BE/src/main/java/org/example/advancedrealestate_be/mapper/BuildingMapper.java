package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.BuildingCreateRequest;
import org.example.advancedrealestate_be.dto.request.BuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.entity.Building;

public interface BuildingMapper {
    Building toRequest(BuildingCreateRequest request);
    void toUpdateRequest(Building building, BuildingUpdateResquest request);
    BuildingResponse toResponse(Building building);
}
