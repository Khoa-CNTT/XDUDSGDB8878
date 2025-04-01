package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.TypeBuildingCreateResquest;
import org.example.advancedrealestate_be.dto.request.TypeBuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.entity.TypeBuilding;

public interface TypeBuildingMapper {
    TypeBuilding toRequest(TypeBuildingCreateResquest request);
    void toUpdateRequest(TypeBuilding building, TypeBuildingUpdateResquest request);
    TypeBuildingResponse toResponse(TypeBuilding typeBuilding);
}
