package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.DeviceRequest;
import org.example.advancedrealestate_be.dto.response.DeviceResponse;
import org.example.advancedrealestate_be.entity.AuctionDetail;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Category;
import org.example.advancedrealestate_be.entity.Devices;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    private final BuildingRepository buildingRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public DeviceMapper(BuildingRepository buildingRepository, CategoryRepository categoryRepository) {
        this.buildingRepository = buildingRepository;
        this.categoryRepository = categoryRepository;
    }

    public Devices toEntity(DeviceRequest request){
        Devices devices=new Devices();
        devices.setDevice_name(request.getDevice_name());
        devices.setInstallation_date(request.getInstallation_date());
        devices.setStatus(request.getStatus());
        devices.setPrice(request.getPrice());
        devices.setDescription(request.getDescription());

        Building building = buildingRepository.findById(request.getId_building())
        .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
        Category category = categoryRepository.findById(request.getId_category())
        .orElseThrow(() -> new AppException(ErrorCode.DEVICE_CATEGORY_NOT_FOUND));

        if (request.getId_building() != null) {
            devices.setBuilding(building);
        }
        if (request.getId_category() != null) {
            devices.setCategory(category);
        }
        return devices;
    }

    public DeviceResponse toResponse(Devices entity){
        return DeviceResponse.builder()
                .id(entity.getId())
                .device_name(entity.getDevice_name())
                .installation_date(entity.getInstallation_date())
                .status(entity.getStatus())
                .price(entity.getPrice())
                .description(entity.getDescription())
                .id_building(entity.getBuilding() != null ? entity.getBuilding().getId() : null)
                .id_category(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .building_name(entity.getBuilding() != null ? entity.getBuilding().getName() : null)
                .category_name(entity.getCategory() != null ? entity.getCategory().getCategory_name() : null)
                .build();
    }
}
