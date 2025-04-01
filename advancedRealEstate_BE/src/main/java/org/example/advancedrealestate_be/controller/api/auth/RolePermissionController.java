package org.example.advancedrealestate_be.controller.api.auth;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.CreateRolePermissionRequest;
import org.example.advancedrealestate_be.dto.request.DeleteRolePermissionRequest;
import org.example.advancedrealestate_be.service.RolePermissionService;
import org.example.advancedrealestate_be.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("api/admins/role-permission")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name="10. Role Permission API")
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;
    @Autowired
    public RolePermissionController(RolePermissionService rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }

    @PostMapping
    public ResponseEntity<JSONObject> addRolePermissions(@RequestBody @Valid CreateRolePermissionRequest request) {
        JSONObject data = new JSONObject();
        rolePermissionService.addPermissionsToRole(request.getId(), request.getList());
        data.put("status", 200);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<JSONObject> deleteRolePermissions(@RequestBody @Valid DeleteRolePermissionRequest request) {
        JSONObject data = new JSONObject();
        rolePermissionService.deletePermissionsFromRole(request.getId(), request.getList());
        data.put("status", 200);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<JSONObject> getPermissionRole(@PathVariable String id) {
        JSONObject data = new JSONObject();
        // Gọi service để lấy RolePermissionResponse
        List<String> permissions = rolePermissionService.getRolePermissionsWithRoleId(id);
        // Tạo response JSON
        data.put("status", 200);
        data.put("data", permissions);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

}
