package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.ServiceDto;

import java.util.List;

public interface ServiceService {
    List<ServiceDto> findAll();
    JSONObject findById(String id);

    JSONObject create(ServiceDto serviceDto);

    JSONObject updateById(String id, ServiceDto buildingDto);

    JSONObject deleteById(String id);
}
