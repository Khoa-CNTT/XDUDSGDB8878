package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.dto.request.DeleteMaintenanceRequest;
import org.example.advancedrealestate_be.dto.request.MaintenanceRequest;
import org.example.advancedrealestate_be.dto.response.MaintenanceResponse;
import org.example.advancedrealestate_be.entity.Maintenances;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.MaintenanceMapper;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.repository.CustomersRepository;
import org.example.advancedrealestate_be.repository.MaintenanceRepository;
import org.example.advancedrealestate_be.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceHandler implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final MaintenanceMapper maintenanceMapper;
    private final BuildingRepository buildingRepository;
    private final CustomersRepository customersRepository;

    @Autowired
    public MaintenanceHandler(MaintenanceRepository maintenanceRepository, MaintenanceMapper maintenanceMapper, BuildingRepository buildingRepository, CustomersRepository customersRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.maintenanceMapper = maintenanceMapper;
        this.buildingRepository = buildingRepository;
        this.customersRepository = customersRepository;
    }

    @Override
    public String createMaintenance(MaintenanceRequest request) {
        Maintenances maintenances=maintenanceMapper.toEntity(request);
        try{
            maintenanceRepository.save(maintenances);
        }catch (DataIntegrityViolationException exception){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return  "Create Successfully !";
    }

    @Override
    public MaintenanceResponse getMaintenanceById(String id) {
        Maintenances maintenances=maintenanceRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Maintenance not found !"));
        return maintenanceMapper.toResponse(maintenances);


    }

    @Override
    public String updateMaintenance(String id, MaintenanceRequest request) {
        try{
            Maintenances maintenances=maintenanceRepository.findById(id)
                    .orElseThrow(()->new RuntimeException("Maintenance not found !"));
            maintenances.setMaintenance_date(request.getMaintenance_date());
            maintenances.setDescription(request.getDescription());
            maintenances.setCost(request.getCost());
            buildingRepository.findById(request.getBuildingId()).ifPresent(maintenances::setBuilding);
            customersRepository.findById(request.getCustomerId()).ifPresent(maintenances::setCustomers);
            maintenanceRepository.save(maintenances);
        }catch(DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }
        return "Update successfully !";
    }

    @Override
    public String deleteMaintenance(String id) {
        try{
            maintenanceRepository.deleteById(id);
        }catch(DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }
        return "Delete successfully !";
    }

//    @Override
//    public List<Maintenances> getAllMaintenance() {
//        return maintenanceRepository.findAll()
//                .stream()
//                .map(maintenanceMapper::toResponse)
//                .collect(Collectors.toList());
//    }


//    @Override
//    public Page<MaintenanceResponse> getAllMaintenance(int page, int size) {
//        Pageable pageable = PageRequest.of(page - 1, size);
//        Page<Maintenances> maintenancesPage = maintenanceRepository.findAll(pageable);
//
//        List<MaintenanceResponse> maintenanceResponses= maintenancesPage.getContent().stream()
//                .map(maintenanceMapper::toResponse)
//                .collect(Collectors.toList());
//
//        // Tạo đối tượng Page<TypeBuildingResponse> từ List<TypeBuildingResponse> và thông tin phân trang của Page<User>
//        return new PageImpl<>(maintenanceResponses, pageable, maintenancesPage.getTotalElements());
//    }

    @Override
    public Page<MaintenanceResponse> getAllMaintenance(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Maintenances> maintenancesPage = maintenanceRepository.findAll(pageable);

        // Correctly map from Maintenances to MaintenanceResponse
        List<MaintenanceResponse> maintenanceResponses = maintenancesPage.getContent().stream()
                .map(maintenanceMapper::toResponse) // Ensure this maps correctly to MaintenanceResponse
                .collect(Collectors.toList());

        // Create Page<MaintenanceResponse> from the mapped list
        return new PageImpl<>(maintenanceResponses, pageable, maintenancesPage.getTotalElements());
    }

    @Override
    public String deleteAllMaintenance(DeleteMaintenanceRequest request) {
        for (String id : request.getIds()) {
            if (maintenanceRepository.existsById(id)) {
                maintenanceRepository.deleteById(id);
            } else {
                throw new RuntimeException("TypeBuilding with ID " + id + " does not exist");
            }
        }
        return "Deleted successfully!";
    }


}
