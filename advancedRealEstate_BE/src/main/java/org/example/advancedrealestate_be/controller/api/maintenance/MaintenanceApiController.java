package org.example.advancedrealestate_be.controller.api.maintenance;

import com.sun.tools.javac.Main;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.request.DeleteMaintenanceRequest;
import org.example.advancedrealestate_be.dto.request.MaintenanceRequest;
import org.example.advancedrealestate_be.dto.response.CustomerResponse;
import org.example.advancedrealestate_be.dto.response.MaintenanceResponse;
import org.example.advancedrealestate_be.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/maintenance")
@Tag(name = "16. Maintenance API", description = "API for maintenance")
public class MaintenanceApiController {
    private final MaintenanceService maintenanceService;

    @Autowired
    public MaintenanceApiController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<JSONObject> getAllMaintenance(@RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "5") int size) {
        JSONObject data = new JSONObject();
        // Lấy dữ liệu người dùng với phân trang
        Page<MaintenanceResponse> pageResult = maintenanceService.getAllMaintenance(page, size);
        // Tạo đối tượng response chứa thông tin phân trang và danh sách người dùng
        Map<String, Object> response = new HashMap<>();
        // Metadata về phân trang
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("total", pageResult.getTotalElements());
        pagination.put("per_page", pageResult.getSize());
        pagination.put("current_page", pageResult.getNumber() + 1);
        pagination.put("last_page", pageResult.getTotalPages());
        pagination.put("from", (pageResult.getNumber() * pageResult.getSize()) + 1);
        pagination.put("to", Math.min((pageResult.getNumber() + 1) * pageResult.getSize(), pageResult.getTotalElements()));
        response.put("pagination", pagination);
        response.put("data", pageResult.getContent());
        data.put("status", 200);
        data.put("data", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<JSONObject> createMaintenance(@Valid @RequestBody MaintenanceRequest request){
        JSONObject data=new JSONObject();
        maintenanceService.createMaintenance(request);
        data.put("status", 200);
        data.put("message", "Maintenance form was created successfully !");
        return new ResponseEntity<>(data,HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONObject>updateMaintenance(@Valid @PathVariable String id, @RequestBody MaintenanceRequest request){
        JSONObject data=new JSONObject();
        maintenanceService.updateMaintenance(id,request);
        data.put("status",200);
        data.put("message","Maintenance form was updated successfully !");
        return new ResponseEntity<>(data,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteMaintenance(@PathVariable String id){
        JSONObject data=new JSONObject();
        maintenanceService.deleteMaintenance(id);
        data.put("status",200);
        data.put("message","Delete maintenance form was deleted successfully");
        return new ResponseEntity<>(data,HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-maintenance")
    @DeleteMapping("/delete-all")
    public ResponseEntity<JSONObject> deleteAllMaintenance(@RequestBody DeleteMaintenanceRequest request){
        JSONObject data=new JSONObject();
        String response = maintenanceService.deleteAllMaintenance(request);
        data.put("message", response);
        data.put("status", 200);
        return new ResponseEntity<>(data,HttpStatus.OK);
    }
}
