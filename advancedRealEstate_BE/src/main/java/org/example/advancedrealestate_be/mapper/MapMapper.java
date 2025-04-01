package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.BuildingDto;
import org.example.advancedrealestate_be.dto.MapDto;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Map;

import java.util.Optional;

public class MapMapper {

    public static MapDto mapToMap(Map map) {

        MapDto mapDto = MapDto.builder()
                .id(map.getId())
                .map_name(map.getMap_name())
                .latitude(map.getLatitude())
                .longitude(map.getLongitude())
                .address(map.getAddress())
                .province(map.getProvince())
                .district(map.getDistrict())
                .ward(map.getWard())
                .build();
        if (mapDto != null) {

            return mapDto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
