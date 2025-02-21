package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.DeleteTypeBuildingsRequest;
import org.example.advancedrealestate_be.dto.request.TypeBuildingCreateResquest;
import org.example.advancedrealestate_be.dto.request.TypeBuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.dto.response.UserResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TypeBuildingService {
    String createTypeBuilding(TypeBuildingCreateResquest request);
    String updateTypeBuilding(String typeBuildingId, TypeBuildingUpdateResquest request);
    String deleteTypeBuilding(String typeBuildingId);
    Page<TypeBuildingResponse> getTypeBuilding(int page, int size);
    String deleteTypeBuildings(DeleteTypeBuildingsRequest request);
    List<TypeBuildingResponse> getAllTypeBuilding();
}
