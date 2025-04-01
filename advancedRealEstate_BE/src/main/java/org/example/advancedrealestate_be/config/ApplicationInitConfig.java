package org.example.advancedrealestate_be.config;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.constant.EnumConstant;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.RolePermission;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.repository.RolePermissionRepository;
import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    @Autowired
    @Lazy
    PasswordEncoder passwordEncoder;

    static String ADMIN_PASSWORD = "123456";
    static String ADMIN_EMAIL="admin@gmail.com";
    static Integer ADMIN_STATUS = 1;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository, RolePermissionRepository rolePermissionRepository) {
        log.info("Initializing application.....");
        return args -> {
            if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
                Role role =  roleRepository.save(Role.builder()
                                            .role_name("ADMIN")
                                            .role_type(String.valueOf(EnumConstant.MANAGEMENT))
                                            .status(1)
                                            .build());

                List<Permission> permissions = Arrays.asList(
                        Permission.builder().permissionName("View admin").link("/admin").build(),

                        Permission.builder().permissionName("View Building").link("/admin/building").build(),
                        Permission.builder().permissionName("Thêm building").link("/admin/create-building").build(),
                        Permission.builder().permissionName("Sửa building").link("/admin/update-building").build(),
                        Permission.builder().permissionName("Xóa building").link("/admin/delete-building").build(),

                        Permission.builder().permissionName("View Chat").link("/admin/chat").build(),
                        Permission.builder().permissionName("View Room Chat").link("/admin/room-chat").build(),
                        Permission.builder().permissionName("View Service").link("/admin/service").build(),
                        Permission.builder().permissionName("View Map").link("/admin/map").build(),
                        Permission.builder().permissionName("View Auction").link("/admin/auction").build(),
                        Permission.builder().permissionName("View auction history").link("/admin/auction-history").build(),
                        Permission.builder().permissionName("View auction detail").link("/admin/auction-detail").build(),
                        Permission.builder().permissionName("View auction contract").link("/admin/auction-contract").build(),
                        Permission.builder().permissionName("View Type Building").link("/admin/type-building").build(),
                        Permission.builder().permissionName("View Device").link("/admin/device").build(),
                        Permission.builder().permissionName("View Customer").link("/admin/customer").build(),
                        Permission.builder().permissionName("View Category").link("/admin/category").build(),
                        Permission.builder().permissionName("View Contract").link("/admin/contract").build(),
                        Permission.builder().permissionName("View Contract Detail").link("/admin/contract-detail").build(),
                        Permission.builder().permissionName("View Role").link("/admin/role").build(),
                        Permission.builder().permissionName("View Maintenances").link("/admin/maintenances").build()
                );

                // Kiểm tra và thêm Permission nếu chưa tồn tại
                for (Permission permission : permissions) {
                    if (!permissionRepository.existsByPermissionName((permission.getPermissionName()))){
                        permissionRepository.save(permission);
                    }
                }

                // Lấy danh sách Permission từ DB
                List<Permission> persistedPermissions = permissionRepository.findAll();

                // Tạo RolePermission cho mỗi Permission với Role "ADMIN"
                for (Permission permission : persistedPermissions) {
                    if (!rolePermissionRepository.existsByRoleAndPermission(role, permission)) {
                        rolePermissionRepository.save(RolePermission.builder()
                                .role(role)
                                .permission(permission)
                                .build());
                    }
                }

                User user = User.builder()
                        .email(ADMIN_EMAIL)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .rawPassword(passwordEncoder.encode(ADMIN_PASSWORD))
                        .status(ADMIN_STATUS)
                        .role(role)
                        .build();

                userRepository.save(user);
                log.warn("Admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}