package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.MaintenanceRequest;
import org.example.advancedrealestate_be.dto.response.MaintenanceResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.entity.Maintenances;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.repository.CustomersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//@Component
//public class MaintenanceMapper {
//    @Autowired
//    private BuildingRepository buildingRepository;
//    public Maintenances toEntity(MaintenanceRequest request){
//        Maintenances maintenances=new Maintenances();
//        maintenances.setMaintenance_date(request.getMaintenance_date());
//        maintenances.setDescription(request.getDescription());
//        maintenances.setCost(request.getCost());
//        buildingRepository.findById(request.getBuildingId()).ifPresent(maintenances::setBuilding);
//        return maintenances;
//    }
//
//    public Maintenances toResponse(Maintenances entity){
//        return Maintenances.builder()
//                .id(entity.getId())
//                .maintenance_date(entity.getMaintenance_date())
//                .cost(entity.getCost())
//                .description(entity.getDescription())
//                .build();
//    }
//}
@Component
public class MaintenanceMapper {

    private final BuildingRepository buildingRepository;
    private final CustomersRepository customersRepository;

    @Autowired
    public MaintenanceMapper(BuildingRepository buildingRepository, CustomersRepository customersRepository) {
        this.buildingRepository = buildingRepository;
        this.customersRepository = customersRepository;
    }

    // Method to convert MaintenanceRequest to Maintenances entity
    public Maintenances toEntity(MaintenanceRequest request) {
        Maintenances maintenances = new Maintenances();
        maintenances.setMaintenance_date(request.getMaintenance_date());
        maintenances.setDescription(request.getDescription());
        maintenances.setCost(request.getCost());
        buildingRepository.findById(request.getBuildingId()).ifPresent(maintenances::setBuilding);
        customersRepository.findById(request.getCustomerId()).ifPresent(maintenances::setCustomers);
        return maintenances;
    }

    // Corrected method to return MaintenanceResponse instead of Maintenances
    public MaintenanceResponse toResponse(Maintenances entity) {
        MaintenanceResponse response = new MaintenanceResponse();
        response.setId(entity.getId());
        response.setMaintenance_date(entity.getMaintenance_date());
        response.setCost(entity.getCost());
        response.setDescription(entity.getDescription());
        response.setBuildingId(entity.getBuilding().getId());
        response.setCustomerId(entity.getCustomers().getId());
        Building building = buildingRepository.findById(entity.getBuilding().getId()).orElse(null);
        Customers customers = customersRepository.findById(entity.getCustomers().getId()).orElse(null);
//        response.setFull_name(customers.getFirst_name() + " " + customers.getLast_name());
        response.setBuilding_name(building.getName());
        return response;
    }
}

