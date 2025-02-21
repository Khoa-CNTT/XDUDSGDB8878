package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.CheckRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckRuleService implements CheckRule {

    private final UserRepository userRepository;

    private final PermissionRepository permissionRepository;

    @Autowired
    public CheckRuleService(UserRepository userRepository, PermissionRepository permissionRepository) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public Boolean checkRule(Long idFun) {
        // Lấy Authentication từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            // Lấy email từ SecurityContext
            String email = authentication.getName();

            // Truy vấn User từ cơ sở dữ liệu
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            // Lấy Role ID
            String roleId = user.getRole().getId();

            // Lấy danh sách Permissions
            List<String> permissions = permissionRepository.findPermissionsByRoleId(roleId);

            // In ra thông tin
            System.out.println("Role Name: " + user.getRole().getRole_name());
            System.out.println("Role ID: " + user.getRole().getId());
            System.out.println("Permissions: " + permissions);

            // Kiểm tra quyền
            return permissions.contains(String.valueOf(idFun));
        }

        return false;
    }
}
