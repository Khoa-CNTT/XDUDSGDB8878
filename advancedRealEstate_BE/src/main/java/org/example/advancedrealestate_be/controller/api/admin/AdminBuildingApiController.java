package org.example.advancedrealestate_be.controller.api.admin;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/buildings")
@Tag(name = "4. Building API", description = "API for building")
public class AdminBuildingApiController {
    private final BuildingService buildingService;

    @Autowired
    public AdminBuildingApiController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JSONObject> create(
            @ModelAttribute @Valid BuildingCreateRequest request,
            @RequestPart(value = "image", required = false) List<MultipartFile> images) {
        JSONObject data = new JSONObject();
        request.setImage(images); // Set images vào request
        String response = buildingService.createBuilding(request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<JSONObject> getAllBuildings(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        JSONObject data = new JSONObject();
        Map<String, Object> response = new HashMap<>();
        if (page == null || size == null) {
            List<BuildingResponse> allBuilding = buildingService.getAllBuildings();
            response.put("data", allBuilding);
        } else {
            Page<BuildingResponse> pageResult = buildingService.getBuilding(page, size);
            Map<String, Object> pagination = new HashMap<>();
            pagination.put("total", pageResult.getTotalElements());
            pagination.put("per_page", pageResult.getSize());
            pagination.put("current_page", pageResult.getNumber() + 1);
            pagination.put("last_page", pageResult.getTotalPages());
            pagination.put("from", (pageResult.getNumber() * pageResult.getSize()) + 1);
            pagination.put("to", Math.min((pageResult.getNumber() + 1) * pageResult.getSize(), pageResult.getTotalElements()));
            response.put("pagination", pagination);
            response.put("data", pageResult.getContent());
        }
        data.put("status", 200);
        data.put("data", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONObject> updateBuilding(@Valid @PathVariable String id, @RequestBody BuildingUpdateResquest request) {
        JSONObject data = new JSONObject();
        String response = buildingService.updateBuilding(id, request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PutMapping(value = "/image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JSONObject> updateImageBuilding(@Valid @PathVariable String id, @ModelAttribute @Valid BuildingUpdateImageRequest request,
                                                          @RequestPart(value = "image", required = false) List<MultipartFile> images) {
        JSONObject data = new JSONObject();
        String response = buildingService.updateImageBuilding(id, request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @CheckPermissionUtil("/admin/delete-building")
    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteBuilding(@PathVariable String id) {
        JSONObject data = new JSONObject();
        String response = buildingService.deleteBuilding(id);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @CheckPermissionUtil("/admin/delete-building")
    @DeleteMapping("/delete-all")
    public ResponseEntity<JSONObject> deleteAllBuilding(@Valid @RequestBody DeleteBuildingRequest request) {
        JSONObject data = new JSONObject();
        String response = buildingService.deleteBuildings(request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
