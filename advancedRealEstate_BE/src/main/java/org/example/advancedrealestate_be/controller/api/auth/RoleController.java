package org.example.advancedrealestate_be.controller.api.auth;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.DeleteRoleRequest;
import org.example.advancedrealestate_be.dto.request.DeleteTypeBuildingsRequest;
import org.example.advancedrealestate_be.dto.request.RoleCreationRequest;
import org.example.advancedrealestate_be.dto.request.RoleUpdateRequest;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.service.RoleService;
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
@RequestMapping("api/admins/role")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name="9. Role API")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<JSONObject> getAllRoles(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        JSONObject data = new JSONObject();
        Map<String, Object> response = new HashMap<>();
        if (page == null || size == null) {
            List<RoleResponse> roleResponses = roleService.getAllRoles();

            response.put("data", roleResponses);
        } else {
            Page<RoleResponse> pageResult = roleService.getBuilding(page, size);

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
    public ResponseEntity<JSONObject> createRole(@Valid @RequestBody RoleCreationRequest request) {
        return new ResponseEntity<>(roleService.createRole(request), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONObject> updateCategory(@Valid @PathVariable String id, @RequestBody RoleUpdateRequest request) {
        JSONObject data = new JSONObject();
        String response = roleService.updateRole(id, request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteCategory(@Valid @PathVariable String id) {
        JSONObject data = new JSONObject();
        String response = roleService.deleteRole(id);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<JSONObject> deleteAllTypeBuilding(@Valid @RequestBody DeleteRoleRequest request) {
        JSONObject data = new JSONObject();
        String response = roleService.deleteRoles(request);
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
//    @PostMapping
//    ApiResponse<RoleResponse> create(@RequestBody RoleCreationRequest request) {
//        return ApiResponse.<RoleResponse>builder()
//                .result(roleService.createRole(request))
//                .build();
//    }
//
//    @GetMapping
//    ApiResponse<List<RoleResponse>> getAll() {
//        return ApiResponse.<List<RoleResponse>>builder()
//                .result(roleService.getAll())
//                .build();
//    }
//
//    @PatchMapping("/{roleName}/permission")
//    ApiResponse<RolePermissionResponse> updateRolePermission(@PathVariable String roleName, @RequestBody RolePermissionRequest request) {
//        var rolePermissionResponse = roleService.updateRolePermission(roleName, request);
//        return ApiResponse.<RolePermissionResponse>builder()
//                .result(rolePermissionResponse)
//                .build();
//    }
//
//    @DeleteMapping("/{role}")
//    ApiResponse<Void> delete(@PathVariable String role) {
//        roleService.delete(role);
//        return ApiResponse.<Void>builder().build();
//    }
}
