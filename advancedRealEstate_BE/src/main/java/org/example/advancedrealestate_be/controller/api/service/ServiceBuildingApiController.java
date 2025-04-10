package org.example.advancedrealestate_be.controller.api.service;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.ServiceDto;
import org.example.advancedrealestate_be.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/")
@Tag(name = "18. Service", description = "API for service")
@Slf4j
public class ServiceBuildingApiController {
    @Autowired
    ServiceService serviceService;

    @Autowired
    public ServiceBuildingApiController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping("/services")
    private ResponseEntity<JSONObject> create(@RequestBody ServiceDto serviceDto) {
        return new ResponseEntity<>(serviceService.create(serviceDto), HttpStatus.OK);
    }

    @GetMapping("/services")
    private ResponseEntity<JSONObject> index() {
        JSONObject data = new JSONObject();
        data.put("total", serviceService.findAll().size());
        data.put("data", serviceService.findAll());
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/services/{id}")
    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
        return new ResponseEntity<>(serviceService.findById(id), HttpStatus.OK);
    }

    @PatchMapping("/services/{id}")
    private ResponseEntity<JSONObject> update(@PathVariable String id, @RequestBody ServiceDto serviceDto) {
        return new ResponseEntity<>(serviceService.updateById(id, serviceDto), HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-service")
    @DeleteMapping("/services/{id}")
    private ResponseEntity<JSONObject> remove(@PathVariable String id) {
        return new ResponseEntity<>(serviceService.deleteById(id), HttpStatus.OK);
    }
}
