package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.BuildingCreateRequest;
import org.example.advancedrealestate_be.dto.request.BuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.MapResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Map;
import org.example.advancedrealestate_be.entity.TypeBuilding;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.repository.MapRepository;
import org.example.advancedrealestate_be.repository.TypeBuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class BuidingMapperIml implements BuildingMapper{

    private final BuildingRepository buildingRepository;
    private final MapRepository mapRepository;
    private final TypeBuildingRepository typeBuildingRepository;

    @Value("${server.port}")
    private String serverPort;
    @Value("${server.host}")
    private String serverHost;
    @Value("${app.protocol}")
    private String protocol;
    @Autowired
    public BuidingMapperIml(BuildingRepository buildingRepository, MapRepository mapRepository, TypeBuildingRepository typeBuildingRepository) {
        this.buildingRepository = buildingRepository;
        this.mapRepository = mapRepository;
        this.typeBuildingRepository = typeBuildingRepository;
    }

    @Override
    public Building toRequest(BuildingCreateRequest request) {
        if(request == null) {
            return null;
        }

        Building building = new Building();

        building.setDescription(request.getDescription());
        building.setImage(String.valueOf(request.getImage()));
        building.setName(request.getName());
        building.setStructure(request.getStructure());
        building.setStatus(request.getStatus());
        building.setNumber_of_basement(request.getNumber_of_basement());
        building.setAcreage(request.getAcreage());
        // Ánh xạ id_map sang entity Map
        if (request.getId_map() != null) {
            Map mapEntity = mapRepository.findById(request.getId_map())
            .orElseThrow(() -> new AppException(ErrorCode.MAP_NOT_FOUND));
            building.setMap(mapEntity);
        }

        // Ánh xạ id_type_building sang entity TypeBuilding
        if (request.getId_type_building() != null) {
            TypeBuilding typeBuildingEntity = typeBuildingRepository.findById(request.getId_type_building())
            .orElseThrow(() -> new AppException(ErrorCode.TYPE_BUILDING_NOT_FOUND));
            building.setTypeBuilding(typeBuildingEntity);
        }

        return  building;
    }

    @Override
    public void toUpdateRequest(Building building, BuildingUpdateResquest request) {

        if (building == null || request == null) {
            return;
        }

        if (request.getDescription() != null) {
            building.setDescription(request.getDescription());
        }

        if (request.getName() != null) {
            building.setName(request.getName());
        }
        if (request.getStructure() != null) {
            building.setStructure(request.getStructure());
        }

        if (request.getStatus() != null) {
            building.setStatus(request.getStatus());
        }

        if (request.getNumber_of_basement() != null) {
            building.setNumber_of_basement(request.getNumber_of_basement());
        }

        if (request.getAcreage() != null) {
            building.setAcreage(request.getAcreage());
        }

        // Ánh xạ id_map sang entity Map
        if (request.getId_map() != null) {
            Map mapEntity = mapRepository.findById(request.getId_map())
            .orElseThrow(() -> new AppException(ErrorCode.MAP_NOT_FOUND));
            building.setMap(mapEntity);
        }

        // Ánh xạ id_type_building sang entity TypeBuilding
        if (request.getId_type_building() != null) {
            TypeBuilding typeBuildingEntity = typeBuildingRepository.findById(request.getId_type_building())
            .orElseThrow(() -> new AppException(ErrorCode.TYPE_BUILDING_NOT_FOUND));
            building.setTypeBuilding(typeBuildingEntity);
        }
    }

    @Override
    public BuildingResponse toResponse(Building building) {
        if (building == null) {
            return null;
        }

        // Ánh xạ Map entity sang MapResponse
        MapResponse mapResponse = null;
        if (building.getMap() != null) {
            mapResponse = MapResponse.builder()
            .id(building.getMap().getId())
            .map_name(building.getMap().getMap_name())
            .latitude(building.getMap().getLatitude())
            .longitude(building.getMap().getLongitude())
            .address(building.getMap().getAddress())
            .province(building.getMap().getProvince())
            .district(building.getMap().getDistrict())
            .ward(building.getMap().getWard())
            .build();
        }

        // Ánh xạ TypeBuilding entity sang TypeBuildingResponse
        TypeBuildingResponse typeBuildingResponse = null;
        if (building.getTypeBuilding() != null) {
            typeBuildingResponse = TypeBuildingResponse.builder()
            .id(building.getTypeBuilding().getId())
            .type_name(building.getTypeBuilding().getType_name())
            .status(building.getTypeBuilding().getStatus())
            .price(building.getTypeBuilding().getPrice())
            .build();
        }
        List<String> imageUrls = new ArrayList<>();

        if (building.getImage() != null && !building.getImage().isEmpty()) {
            String[] imagePaths = building.getImage().split(";");
            for (String path : imagePaths) {
                if (!path.trim().isEmpty()) {
                    String fileName = Paths.get(path).getFileName().toString();
                    String url = String.format("%s://%s:%s/api/user/building/%s",
                    protocol, serverHost, serverPort, fileName);
                    imageUrls.add(url);
                }
            }
        }

        // Tạo BuildingResponse
        return BuildingResponse.builder()
                .id(building.getId())
                .name(building.getName())
                .structure(building.getStructure())
                .description(building.getDescription())
                .image(imageUrls) // Gán danh sách URL ảnh
                .status(building.getStatus())
                .number_of_basement(building.getNumber_of_basement())
                .area(building.getAcreage())
                .map(mapResponse)
                .typeBuilding(typeBuildingResponse)
                .build();
    }
}
