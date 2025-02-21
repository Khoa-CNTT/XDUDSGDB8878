package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.DeviceRequest;
import org.example.advancedrealestate_be.dto.response.DeviceResponse;
import org.example.advancedrealestate_be.entity.Devices;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    private final BuildingRepository buildingRepository;

    @Autowired
    public DeviceMapper(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    public Devices toEntity(DeviceRequest request){
        Devices devices=new Devices();
        devices.setDevice_name(request.getDevice_name());
        devices.setInstallation_date(request.getInstallation_date());
        devices.setStatus(request.getStatus());
        devices.setPrice(request.getPrice());
        devices.setDescription(request.getDescription());

        if (request.getId_buiding() != null) {
            buildingRepository.findById(request.getId_buiding()).ifPresent(devices::setBuilding);
        }

        if (request.getId_category() != null) {
            buildingRepository.findById(request.getId_category()).ifPresent(devices::setBuilding);
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
