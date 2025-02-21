package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.dto.request.DeviceRequest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.dto.response.DeviceResponse;
import org.example.advancedrealestate_be.entity.Category;
import org.example.advancedrealestate_be.entity.Devices;
import org.example.advancedrealestate_be.mapper.DeviceMapper;
import org.example.advancedrealestate_be.repository.DeviceRepository;
import org.example.advancedrealestate_be.service.DeviceService;
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
public class DeviceHandler implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceMapper deviceMapper;

    @Autowired
    public DeviceHandler(DeviceRepository deviceRepository, DeviceMapper deviceMapper) {
        this.deviceRepository = deviceRepository;
        this.deviceMapper = deviceMapper;
    }

    @Override
    public String createDevice(DeviceRequest request) {
        Devices devices = deviceMapper.toEntity(request);
        try{
            deviceRepository.save(devices);
            return "Create device successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }
    }

    @Override
    public DeviceResponse getDeviceById(String id) {
        Devices devices = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found!"));
        return deviceMapper.toResponse(devices);
    }

    @Override
    public List<DeviceResponse> getAllDevice() {
        return deviceRepository.findAll()
                .stream()
                .map(deviceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String deleteAllDevices(List<String> ids) {
        List<Devices> devicesList=deviceRepository.findAllById(ids);
        try{

            if(devicesList.size() != ids.size()){
                throw new RuntimeException("Some devices not found");
            }
            deviceRepository.deleteAll(devicesList);
            return "Delete all devices successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }
    }

    @Override
    public String updateDevice(String id, DeviceRequest request) {
        Devices devices = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found!"));
        try{

            devices.setDevice_name(request.getDevice_name());
            devices.setInstallation_date(request.getInstallation_date()); // Ensure this is java.time.LocalDate
            devices.setStatus(request.getStatus());
            devices.setPrice(request.getPrice());
            devices.setDescription(request.getDescription());
            deviceRepository.save(devices);
            return "Update device successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);

        }


    }

    @Override
    public String deleteDevice(String id) {
        try{
            deviceRepository.deleteById(id);
            return  "Delete device successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }

    }

    @Override
    public Page<DeviceResponse> getDevice(int page, int size) {

        Pageable pageable = PageRequest.of(page - 1, size);

        Page<Devices> categoryPage = deviceRepository.findAll(pageable);

        List<DeviceResponse> deviceResponses = categoryPage.getContent().stream()
                .map(deviceMapper::toResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(deviceResponses, pageable, categoryPage.getTotalElements());
    }
}
