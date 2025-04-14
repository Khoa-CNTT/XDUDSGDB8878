package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.DeleteRoleRequest;
import org.example.advancedrealestate_be.dto.request.RoleCreationRequest;
import org.example.advancedrealestate_be.dto.request.RoleUpdateRequest;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.RoleMapper;
import org.example.advancedrealestate_be.repository.RolePermissionRepository;
import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.RoleService;
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

public class RoleServiceHandler implements RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    private final RolePermissionRepository rolePermissionRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoleServiceHandler(RoleRepository roleRepository, RoleMapper roleMapper, RolePermissionRepository rolePermissionRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
        this.rolePermissionRepository = rolePermissionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public JSONObject createRole(RoleCreationRequest request) {
        Role role = roleMapper.toRequest(request);
        roleRepository.save(role);
        JSONObject dataResponse= new JSONObject();
        //trả message từ service về cho controller trả ra cho client
        dataResponse.put("status", 200);
        dataResponse.put("message", "Đã thêm mới thành công");
        return dataResponse;
    }

    @Override
    public String updateRole(String userId, RoleUpdateRequest request) {

        Role role = roleRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy Role với ID: " + userId));
        roleMapper.toUpdateRequest(role, request);
        roleRepository.save(role);
        return "Đã cập nhật thành công";
    }

    @Override
    public String deleteRole(String RoleId) {
        Role role = roleRepository.findById(RoleId).orElseThrow(() -> new RuntimeException("Không tìm thấy Role với ID: " + RoleId));
        roleRepository.delete(role);
        return "Đã xóa thành công";
    }

    @Override
    public Page<RoleResponse> getBuilding(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Role> rolePage = roleRepository.findAll(pageable);

        List<RoleResponse> roleResponses = rolePage.getContent().stream()
                .map(roleMapper::toResponse)
                .collect(Collectors.toList());

        // Tạo đối tượng Page<TypeBuildingResponse> từ List<TypeBuildingResponse> và thông tin phân trang của Page<User>
        return new PageImpl<>(roleResponses, pageable, rolePage.getTotalElements());
    }

    @Override
    public String deleteRoles(DeleteRoleRequest request) {
        for (String id : request.getIds()) {
            // Kiểm tra xem có User nào đang tham chiếu đến Role này không
            Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role with ID " + id + " does not exist"));;
            if (userRepository.existsByRoleId(id)) {
                throw new RuntimeException("Vai trò " + role.getRole_name() + " vẫn được một số người dùng tham chiếu và không thể xóa được");
            }

            // Nếu không có User tham chiếu, tiến hành xóa RolePermission trước
            rolePermissionRepository.deleteByRoleId(id);

            // Sau đó xóa Role
            if (roleRepository.existsById(id)) {
                roleRepository.deleteById(id);
            } else {
                throw new RuntimeException("Role with ID " + id + " does not exist");
            }
        }
        return "Deleted successfully!";
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public boolean isManagementRole(String role_type) {
        return roleRepository.countManagementRole(role_type) > 0;
    }

    @Override
    public List<RoleResponse> findRolesByType(String type) {
        return roleRepository.findRolesByRole_type(type).stream().map(roleMapper::toResponse).collect(Collectors.toList());
    }
}
