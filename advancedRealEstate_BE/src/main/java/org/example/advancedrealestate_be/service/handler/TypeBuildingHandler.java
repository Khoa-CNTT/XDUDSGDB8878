package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.dto.request.DeleteTypeBuildingsRequest;
import org.example.advancedrealestate_be.dto.request.TypeBuildingCreateResquest;
import org.example.advancedrealestate_be.dto.request.TypeBuildingUpdateResquest;
import org.example.advancedrealestate_be.dto.response.TypeBuildingResponse;
import org.example.advancedrealestate_be.entity.TypeBuilding;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.TypeBuildingMapper;
import org.example.advancedrealestate_be.repository.TypeBuildingRepository;
import org.example.advancedrealestate_be.service.TypeBuildingService;
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
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TypeBuildingHandler implements TypeBuildingService {

    private final TypeBuildingRepository typeBuildingRepository;

    private final TypeBuildingMapper typeBuildingMapper;

    @Autowired
    public TypeBuildingHandler(TypeBuildingRepository typeBuildingRepository, TypeBuildingMapper typeBuildingMapper) {
        this.typeBuildingRepository = typeBuildingRepository;
        this.typeBuildingMapper = typeBuildingMapper;
    }

    @Override
    public String createTypeBuilding(TypeBuildingCreateResquest request) {
        TypeBuilding typeBuilding = typeBuildingMapper.toRequest(request);

        try {
            typeBuildingRepository.save(typeBuilding);
            return  "Create Successfully !";
        } catch (DataIntegrityViolationException exception) {
            throw new RuntimeException(exception);
        }
    }

    @Override
    public String updateTypeBuilding(String typeBuildingId, TypeBuildingUpdateResquest request) {
        try{
            TypeBuilding typeBuilding = typeBuildingRepository.findById(typeBuildingId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            typeBuildingMapper.toUpdateRequest(typeBuilding,request);

            typeBuildingRepository.save(typeBuilding);
            return "Update successfully !";
        } catch (DataIntegrityViolationException exception) {
            throw new RuntimeException(exception);
        }

    }

    @Override
    public String deleteTypeBuilding(String typeBuildingId) {
        try {
            typeBuildingRepository.deleteById(typeBuildingId);
            return "Delete successfully !";
        } catch (DataIntegrityViolationException exception) {
            throw new RuntimeException(exception);
        }


    }

    @Override
    public Page<TypeBuildingResponse> getTypeBuilding(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<TypeBuilding> typeBuildingPage = typeBuildingRepository.findAll(pageable);

        List<TypeBuildingResponse> typeBuildingResponses = typeBuildingPage.getContent().stream()
                .map(typeBuildingMapper::toResponse)
                .collect(Collectors.toList());

        // Tạo đối tượng Page<TypeBuildingResponse> từ List<TypeBuildingResponse> và thông tin phân trang của Page<User>
        return new PageImpl<>(typeBuildingResponses, pageable, typeBuildingPage.getTotalElements());
    }

    @Override
    public String deleteTypeBuildings(DeleteTypeBuildingsRequest request) {
            for (String id : request.getIds()) {
                if (typeBuildingRepository.existsById(id)) {
                    typeBuildingRepository.deleteById(id);

                } else {
                    throw new RuntimeException("TypeBuilding with ID " + id + " does not exist");
                }
            }
        return "Deleted successfully!";


    }

    @Override
    public List<TypeBuildingResponse> getAllTypeBuilding() {
        return typeBuildingRepository.findAll().stream().map(typeBuildingMapper::toResponse).collect(Collectors.toList());
    }
}
