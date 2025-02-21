package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.DeleteMaintenanceRequest;
import org.example.advancedrealestate_be.dto.request.MaintenanceRequest;
import org.example.advancedrealestate_be.dto.response.MaintenanceResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MaintenanceService {
    String createMaintenance(MaintenanceRequest request);
    MaintenanceResponse getMaintenanceById(String id);
    String updateMaintenance(String id, MaintenanceRequest request);
    String deleteMaintenance(String id);
    Page<MaintenanceResponse> getAllMaintenance(int page, int size);
    String deleteAllMaintenance(DeleteMaintenanceRequest request);
}
