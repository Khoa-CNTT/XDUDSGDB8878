package org.example.advancedrealestate_be.controller.api.auth;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.ApiResponse;
import org.example.advancedrealestate_be.dto.response.PermissionResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("api/admin/permissions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "8. Permission API")
public class PermissionController {

    private final PermissionService permissionService;

    @Autowired
    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public ResponseEntity<JSONObject> getAllPermissions(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        JSONObject data = new JSONObject();
        Map<String, Object> response = new HashMap<>();
        if (page == null || size == null) {
            List<PermissionResponse> allPermissions = permissionService.getAllPermissions();

            response.put("data", allPermissions);
        } else {
            Page<PermissionResponse> pageResult = permissionService.getPermission(page, size);

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

    @PostMapping
    public ResponseEntity<JSONObject> createPermission(@Valid @RequestBody PermissionCreationRequest request) {
        JSONObject data = new JSONObject();
        //trả message từ service về cho controller trả ra cho client
        String response = permissionService.createPermission(request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONObject> updatePermission(@Valid @PathVariable String id, @RequestBody PermissionUpdateRequest request) {
        JSONObject data = new JSONObject();
        String response = permissionService.updatePermission(id, request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deletePermission(@Valid @PathVariable String id) {
        JSONObject data = new JSONObject();
        String response = permissionService.deletePermission(id);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-permission")
    @DeleteMapping("/delete-all")
    public ResponseEntity<JSONObject> deleteAllTypeBuilding(@Valid @RequestBody DeletePermissionRequest request) {
        JSONObject data = new JSONObject();
        String response = permissionService.deletePermissions(request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
