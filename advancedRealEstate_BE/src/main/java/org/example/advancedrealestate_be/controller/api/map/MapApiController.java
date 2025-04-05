package org.example.advancedrealestate_be.controller.api.map;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.MapDto;
import org.example.advancedrealestate_be.dto.ServiceDto;
import org.example.advancedrealestate_be.dto.request.DeleteCategoryRequest;
import org.example.advancedrealestate_be.dto.request.DeleteMapRequest;
import org.example.advancedrealestate_be.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/")
@Tag(name = "17. Map API", description = "API for map")
@Slf4j
public class MapApiController {

    private final MapService mapService;

    @Autowired
    public MapApiController(MapService mapService) {
        this.mapService = mapService;
    }

    @PostMapping("/maps")
    private ResponseEntity<JSONObject> create(@RequestBody MapDto mapDto) {
        return new ResponseEntity<>(mapService.create(mapDto), HttpStatus.OK);
    }

    @GetMapping("/maps")
    private ResponseEntity<JSONObject> index() {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", mapService.findAll());
        responseObject.put("total", mapService.findAll().size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/maps/{id}")
    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
        return new ResponseEntity<>(mapService.findById(id), HttpStatus.OK);
    }

    @PatchMapping("/maps/{id}")
    private ResponseEntity<JSONObject> update(@PathVariable String id, @RequestBody MapDto mapDto) {
        return new ResponseEntity<>(mapService.updateById(mapDto ,id), HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-map")
    @DeleteMapping("/maps")
    public ResponseEntity<JSONObject> deleteAllMap(@Valid @RequestBody DeleteMapRequest request) {
        JSONObject data = new JSONObject();
        String response = mapService.deleteAll(request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
