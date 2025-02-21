package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.TypeBuildingCreateResquest;
import org.example.advancedrealestate_be.dto.request.TypeBuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.entity.TypeBuilding;
import org.springframework.stereotype.Component;

@Component
public class TypeBuildingMapperImpl implements TypeBuildingMapper {
    @Override
    public TypeBuilding toRequest(TypeBuildingCreateResquest request) {
        if (request == null) {
            return null;
        }

        TypeBuilding typeBuilding = new TypeBuilding();
        typeBuilding.setType_name(request.getType_name());
        typeBuilding.setPrice(request.getPrice());
        typeBuilding.setStatus(request.getStatus());

        return typeBuilding;
    }

    @Override
    public void toUpdateRequest(TypeBuilding typeBuilding, TypeBuildingUpdateResquest request) {
        if (typeBuilding == null || request == null) {
            return;
        }

        if (request.getType_name() != null) {
            typeBuilding.setType_name(request.getType_name());
        }

        if (request.getPrice() != null) {
            typeBuilding.setPrice(request.getPrice());
        }

        if (request.getStatus() != null) {
            typeBuilding.setStatus(request.getStatus());
        }

    }

    @Override
    public TypeBuildingResponse toResponse(TypeBuilding typeBuilding) {
        if(typeBuilding == null) {
            return null;
        }

        return TypeBuildingResponse.builder()
                .id(typeBuilding.getId())
                .type_name(typeBuilding.getType_name())
                .price(typeBuilding.getPrice())
                .status(typeBuilding.getStatus())
                .build();
    }

}
