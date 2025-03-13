package org.example.advancedrealestate_be.service.handler;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.constant.ErrorEnumConstant;
import org.example.advancedrealestate_be.dto.ServiceDto;
import org.example.advancedrealestate_be.entity.Service;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.ServiceMapper;
import org.example.advancedrealestate_be.repository.ServiceRepository;
import org.example.advancedrealestate_be.service.ServiceService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceHandler implements ServiceService {
    @Autowired
    ServiceRepository serviceRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ServiceHandler(ServiceRepository serviceRepository, ModelMapper modelMapper) {
        this.serviceRepository = serviceRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public List<ServiceDto> findAll() {
        List<Service> serviceList = serviceRepository.findAll();
        return serviceList.stream().map(ServiceMapper::mapToService).collect(Collectors.toList());
    }

    @Override
    public JSONObject findById(String id) {
        JSONObject responseObject = new JSONObject();
        Service service = serviceRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        responseObject.put("data", service);
        return responseObject;
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Transactional
    @Override
    public JSONObject create(ServiceDto serviceDto) {
        JSONObject responseObject = new JSONObject();
        Service service = modelMapper.map(serviceDto, Service.class);
        serviceRepository.save(service);
        responseObject.put("message", "Created successfully");
        return responseObject;
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Override
    public JSONObject updateById(String id, ServiceDto serviceDto) {
        JSONObject responseObject = new JSONObject();
        Service service = serviceRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        service.setName(serviceDto.getName() != null ? serviceDto.getName() : service.getName());
        service.setPrice(serviceDto.getPrice() != 0 ? serviceDto.getPrice() : service.getPrice());
        serviceRepository.save(service);
        responseObject.put("message", "Updated successfully");
        return responseObject;
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Override
    public JSONObject deleteById(String id) {
        JSONObject responseObject = new JSONObject();
        Service service = serviceRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        serviceRepository.delete(service);
        responseObject.put("message", "Delete successfully");
        return responseObject;
    }
}
