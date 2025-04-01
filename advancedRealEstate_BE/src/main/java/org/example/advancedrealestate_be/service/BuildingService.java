package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BuildingService {
    String createBuilding(BuildingCreateRequest request);
    String updateBuilding(String buildingId, BuildingUpdateResquest request);
    String updateImageBuilding(String buildingId, BuildingUpdateImageRequest request);
    String deleteBuilding(String buildingId);
    Page<BuildingResponse> getBuilding(int page, int size);
    String deleteBuildings(DeleteBuildingRequest request);
    List<BuildingResponse> getAllBuildings();
    JSONObject findById(String id);


//    List<BuildingDto> findAll();
//
//
//    BuildingDto create(CreateBuildingRequest buildingRequestDto);
//
//    BuildingDto updateById(BuildingUpdateRequest buildingDto, String id);
//
//    BuildingDto deleteById(String id);
//
//    BuildingDto uploadImage(String id, MultipartFile imageFile) throws IOException;

}
