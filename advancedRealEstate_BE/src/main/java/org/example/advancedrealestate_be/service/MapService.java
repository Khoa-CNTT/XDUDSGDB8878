package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.BuildingDto;
import org.example.advancedrealestate_be.dto.MapDto;
import org.example.advancedrealestate_be.dto.request.DeleteCategoryRequest;
import org.example.advancedrealestate_be.dto.request.DeleteMapRequest;

import java.util.List;

public interface MapService {

    List<MapDto> findAll();

    JSONObject findById(String id);

    JSONObject create(MapDto MapDto);

    JSONObject updateById(MapDto MapDto, String id);

    String deleteAll(DeleteMapRequest request);
}
