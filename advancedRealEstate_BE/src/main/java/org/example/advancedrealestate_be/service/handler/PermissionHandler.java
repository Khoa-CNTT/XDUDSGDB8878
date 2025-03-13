package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.dto.request.DeletePermissionRequest;
import org.example.advancedrealestate_be.dto.request.PermissionCreationRequest;
import org.example.advancedrealestate_be.dto.request.PermissionUpdateRequest;
import org.example.advancedrealestate_be.dto.response.PermissionResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.PermissionMapper;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.service.PermissionService;
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
public class PermissionHandler implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;
    private final RoleRepository roleRepository;

    @Autowired
    public PermissionHandler(PermissionRepository permissionRepository, PermissionMapper permissionMapper, RoleRepository roleRepository) {
        this.permissionRepository = permissionRepository;
        this.permissionMapper = permissionMapper;
        this.roleRepository = roleRepository;
    }

    @Override
    public String createPermission(PermissionCreationRequest request) {
        Permission permission = permissionMapper.toRequest(request);
        try {
            permissionRepository.save(permission);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return "Đã thêm mới thành công";
    }

    @Override
    public String updatePermission(String permissionId, PermissionUpdateRequest request) {
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Role với ID: " + permissionId));

        permissionMapper.toUpdateRequest(permission, request);
        permissionRepository.save(permission);
        return "Đã cập nhật thành công";
    }

    @Override
    public String deletePermission(String permissionId) {
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Role với ID: " + permissionId));

        permissionRepository.delete(permission);
        return "Đã xóa thành công";
    }

    @Override
    public Page<PermissionResponse> getPermission(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Permission> permissionPage = permissionRepository.findAll(pageable);

        List<PermissionResponse> permissionResponses = permissionPage.getContent().stream()
                .map(permissionMapper::toResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(permissionResponses, pageable, permissionPage.getTotalElements());
    }


    @Override
    public String deletePermissions(DeletePermissionRequest request) {
        for (String id : request.getIds()) {
            if (permissionRepository.existsById(id)) {
                permissionRepository.deleteById(id);
            } else {
                throw new RuntimeException("Permission with ID " + id + " does not exist");
            }
        }
        return "Deleted successfully!";
    }

    @Override
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream().map(permissionMapper::toResponse).collect(Collectors.toList());
    }

}
