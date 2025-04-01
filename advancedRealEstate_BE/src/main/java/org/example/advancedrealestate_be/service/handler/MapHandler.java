package org.example.advancedrealestate_be.service.handler;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.constant.ErrorEnumConstant;
import org.example.advancedrealestate_be.dto.MapDto;
import org.example.advancedrealestate_be.dto.request.DeleteMapRequest;
import org.example.advancedrealestate_be.entity.*;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.MapMapper;
import org.example.advancedrealestate_be.repository.MapRepository;
import org.example.advancedrealestate_be.service.MapService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MapHandler implements MapService {


    private final ModelMapper modelMapper;
    private final MapRepository mapRepository;

    @Autowired
    public MapHandler(ModelMapper modelMapper, MapRepository mapRepository) {
        this.modelMapper = modelMapper;
        this.mapRepository = mapRepository;
    }


    @Override
    public List<MapDto> findAll() {

        List<Map> mapList = mapRepository.findAll();

        return mapList.stream()
                .map(MapMapper::mapToMap)
                .collect(Collectors.toList());
    }

    @Override
    public JSONObject findById(String id) {
        JSONObject responseObject = new JSONObject();
        Map map = mapRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MAP_NOT_FOUND));
        responseObject.put("data", map);
        return responseObject;
    }

    @Override
    public JSONObject create(MapDto mapDto) {
        JSONObject responseObject = new JSONObject();
        Map map = new Map();
        map.setMap_name(mapDto.getMap_name());
        map.setLatitude(mapDto.getLatitude());
        map.setLongitude(mapDto.getLongitude());
        map.setAddress(mapDto.getAddress());
        map.setProvince(mapDto.getProvince());
        map.setDistrict(mapDto.getDistrict());
        map.setWard(mapDto.getWard());
        mapRepository.save(map);
        responseObject.put("status", 200);
        responseObject.put("message", "Đã thêm mới thành công");
        return responseObject;
    }

    @Override
    public JSONObject updateById(MapDto mapDto, String id) {
        JSONObject responseObject = new JSONObject();
        Map map = mapRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MAP_NOT_FOUND));
        map.setMap_name(mapDto.getMap_name() != null ? mapDto.getMap_name() : map.getMap_name());
        map.setLatitude(mapDto.getLatitude() != null ? mapDto.getLatitude() : map.getLatitude());
        map.setLongitude(mapDto.getLongitude() != null ? mapDto.getLongitude() : map.getLongitude());
        map.setAddress(mapDto.getAddress() != null ? mapDto.getAddress() : map.getAddress());
        map.setProvince(mapDto.getProvince() != null ? mapDto.getProvince() : map.getProvince());
        map.setDistrict(mapDto.getDistrict() != null ? mapDto.getDistrict() : map.getDistrict());
        map.setWard(mapDto.getWard() != null ? mapDto.getWard() : map.getWard());
        Map mapUpdate = mapRepository.save(map);
        responseObject.put("status", 200);
        responseObject.put("message", "Update successfully!");
        return responseObject;
    }

    @Override
    public String deleteAll(DeleteMapRequest request) {
        for (String id : request.getIds()) {
            if (mapRepository.existsById(id)) {
                mapRepository.deleteById(id);
            } else {
                throw new RuntimeException("TypeBuilding with ID " + id + " does not exist");
            }
        }
        return "Deleted successfully!";
    }
}
