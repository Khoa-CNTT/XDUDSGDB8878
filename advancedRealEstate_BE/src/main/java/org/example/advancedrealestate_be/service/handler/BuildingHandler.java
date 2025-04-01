package org.example.advancedrealestate_be.service.handler;

import lombok.Value;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.BuildingCreateRequest;
import org.example.advancedrealestate_be.dto.request.BuildingUpdateImageRequest;
import org.example.advancedrealestate_be.dto.request.BuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.request.DeleteBuildingRequest;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.entity.*;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.BuildingMapper;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BuildingHandler implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final BuildingMapper buildingMapper;

    @Autowired
    public BuildingHandler(BuildingRepository buildingRepository, BuildingMapper buildingMapper) {
        this.buildingRepository = buildingRepository;
        this.buildingMapper = buildingMapper;
    }
    private static final String IMAGE_DIRECTORY = "uploads/buiding/images/";
//    }
    @Override
    public String createBuilding(BuildingCreateRequest request) {
        Building building = buildingMapper.toRequest(request);

        try {
            List<MultipartFile> images = request.getImage();
            if (images != null && !images.isEmpty()) {
                // Đường dẫn thư mục lưu trữ
                String uploadDir = "uploads/buiding/images/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                // Lưu ảnh và đường dẫn
                List<String> imagePaths = new ArrayList<>();
                for (MultipartFile image : images) {
                    String originalFilename = image.getOriginalFilename();
                    String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String fileName = UUID.randomUUID() + fileExtension;
                    Path filePath = Paths.get(uploadDir, fileName);
                    try {
                        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        imagePaths.add(filePath.toString());
                    } catch (IOException e) {
                        throw new RuntimeException("Lưu ảnh thất bại: " + e.getMessage());
                    }
                }
                building.setImage(String.join(";", imagePaths));
            }
            buildingRepository.save(building);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return "Đã thêm mới thành công!";
    }


    @Override
    public String updateBuilding(String buildingId, BuildingUpdateResquest request) {
        try{
            Building building = buildingRepository.findById(buildingId).orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
            buildingMapper.toUpdateRequest(building,request);

            buildingRepository.save(building);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return "Đã cập nhật thành công!";
    }

    @Override
    public String updateImageBuilding(String buildingId, BuildingUpdateImageRequest request) {
        // Tìm tòa nhà theo ID
        Building building = buildingRepository.findById(buildingId).orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
        try {
            List<MultipartFile> images = request.getImage();
            if (images != null && !images.isEmpty()) {
                // Lưu các ảnh mới
                String uploadDir = "uploads/buiding/images/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                List<String> imagePaths = new ArrayList<>();
                for (MultipartFile image : images) {
                    String originalFilename = image.getOriginalFilename();
                    String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String fileName = UUID.randomUUID() + fileExtension;
                    Path filePath = Paths.get(uploadDir, fileName);
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    imagePaths.add(filePath.toString());
                }
                // Cập nhật đường dẫn ảnh trong đối tượng Building
                building.setImage(String.join(";", imagePaths));
            }

            // Lưu tòa nhà với thông tin ảnh mới
            buildingRepository.save(building);
        } catch (IOException e) {
            throw new RuntimeException("Cập nhật ảnh thất bại: " + e.getMessage());
        }

        return "Cập nhật hình ảnh thành công!";
    }

    @Override
    public String deleteBuilding(String buildingId) {
        Building building = buildingRepository.findById(buildingId).orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
        buildingRepository.delete(building);
        return "Đã xóa thành công!";
    }

    @Override
    public Page<BuildingResponse> getBuilding(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Building> buildingPage = buildingRepository.findAll(pageable);
        List<BuildingResponse> buildingResponses = buildingPage.getContent().stream().map(buildingMapper::toResponse).collect(Collectors.toList());
        // Tạo đối tượng Page<TypeBuildingResponse> từ List<TypeBuildingResponse> và thông tin phân trang của Page<User>
        return new PageImpl<>(buildingResponses, pageable, buildingPage.getTotalElements());
    }

    @Override
    public String deleteBuildings(DeleteBuildingRequest request) {
        for (String id : request.getIds()) {
            if (buildingRepository.existsById(id)) {
                buildingRepository.deleteById(id);
            } else {
                throw new RuntimeException("TypeBuilding with ID " + id + " does not exist");
            }
        }
        return "Deleted successfully!";
    }

    @Override
    public List<BuildingResponse> getAllBuildings() {
        return buildingRepository.findAll().stream().map(buildingMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public JSONObject findById(String id) {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", buildingRepository.findById(id).stream().map(buildingMapper::toResponse).collect(Collectors.toList()));
        return responseObject;
    }

}
