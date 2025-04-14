package org.example.advancedrealestate_be.mapper;

import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import org.example.advancedrealestate_be.dto.request.UserCreationRequest;
import org.example.advancedrealestate_be.dto.request.UserUpdatePasswordRequest;
import org.example.advancedrealestate_be.dto.request.UserUpdateRequest;
//import org.example.advancedrealestate_be.dto.response.PermissionResponse;
import org.example.advancedrealestate_be.dto.response.*;
//import org.example.advancedrealestate_be.entity.Permission;
//import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.User;
//import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
//@Component
//public class UserMapperImpl implements UserMapper {
////    @Autowired
////    RoleRepository roleRepository;
//
//    @Autowired
//    PasswordEncoder passwordEncoder;
//    @Value("${server.port}")
//    private String serverPort;
//    @Value("${server.host}")
//    private String serverHost;
//
//    private String url = "http://";
//    @Autowired
//    private PermissionService permissionService;
//    @Autowired
//    private PermissionRepository permissionRepository;
//
//    @Override
//    public User toUser(UserCreationRequest request) {
//        if (request == null) {
//            return null;
//        }
//
//        User user = new User();
//        user.setUser_name(request.getUser_name());
//        user.setPassword(request.getPassword()); // Note: Password should be encoded later
//        user.setEmail(request.getEmail());
//        user.setFirst_name(request.getFirst_name());
//        user.setLast_name(request.getLast_name());
//        user.setBirthday(request.getBirthday());
//        user.setAddress(request.getAddress());
//        user.setPhone_number(request.getPhone_number());
//        user.setAvatar(String.valueOf(request.getAvatar()));
//        user.setStatus(request.getStatus());
//        // Add additional fields as necessary
//        return user;
//    }
//
//    @Override
//    public UserResponse toUserResponse(User user) {
//        if (user == null) {
//            return null; // Return null if the user is null
//        }
//
//        // Map Role to RoleResponse
//        RoleResponse roleResponse = null;
//        List<String> permissions = new ArrayList<>();
//
//        if (user.getRole() == null) {
//            System.out.println("Role is null for user: " + user.getUser_name());
//            roleResponse = RoleResponse.builder()
//                    .role_name("Unknown Role")
//                    .build();
//        } else {
//            Role role = user.getRole();
//            System.out.println("Role Name: " + role.getRole_name());
//
//            // Map Role to RoleResponse
//            roleResponse = RoleResponse.builder()
//                    .role_name(role.getRole_name())
//                    .build();
//
//            permissions = permissionRepository.findPermissionsByRoleLink(user.getRole().getId());
//        }
//
//        // Map Avatar to URL
//        String avatarUrl = null;
//        if (user.getAvatar() != null) {
//            String fileName = Paths.get(user.getAvatar()).getFileName().toString();
//            avatarUrl = url + serverHost + ":" + serverPort + "/api/user/" + fileName;
//        }
//
//        // Build UserResponse
//        return UserResponse.builder()
//                .id(user.getId())
//                .user_name(user.getUser_name())
//                .email(user.getEmail())
//                .first_name(user.getFirst_name())
//                .last_name(user.getLast_name())
//                .birthday(user.getBirthday())
//                .gender(user.getGender())
//                .phone_number(user.getPhone_number())
//                .status(user.getStatus())
//                .address(user.getAddress())
//                .avatar(avatarUrl)
//                .roles(roleResponse != null ? roleResponse.getRole_name() : "Unknown Role")
//                .permission(permissions)
//                .build();
//    }
//
////    public PermissionResponse toPermissionResponse(Permission permission) {
////        if (permission == null) {
////            return null;
////        }
////
////        return PermissionResponse.builder()
////                .name(permission.getName())
////                .description(permission.getDescription())
////                .build();
////    }
//
////    private RoleResponse toRoleResponse(Role role) {
////        if (role == null) {
////            return null; // Return null if the role is null
////        }
////
////        Set<PermissionResponse> permissionResponses = role.getPermissions().stream()
////                .map(this::toPermissionResponse)
////                .collect(Collectors.toSet());
////
////        return RoleResponse.builder()
////                .name(role.getName())
////                .description(role.getDescription())
////                .permissions(permissionResponses) // Assuming permissions is properly mapped
////                .build();
////    }
//    @Override
//    public void updateUser(User user, UserUpdateRequest request) {
//        // Check if user or request is null to prevent NullPointerException
//        if (user == null || request == null) {
//            return; // You might want to throw an exception or log this
//        }
//
//        // Update fields based on request
//        if (request.getUser_name() != null) {
//            user.setUser_name(request.getUser_name());
//        }
//
//        if (request.getFirst_name() != null) {
//            user.setFirst_name(request.getFirst_name());
//        }
//
//        if (request.getLast_name() != null) {
//            user.setLast_name(request.getLast_name());
//        }
//
//        if (request.getStatus() != null) {
//            user.setStatus(request.getStatus());
//        }
//
//
//        // Add any additional fields you need to update
//        if (request.getAddress() != null) {
//            user.setAddress(request.getAddress());
//        }
//
////        if (request.getAvatar() != null) {
////            user.setAvatar(request.getAvatar());
////        }
//
//        if (request.getEmail() != null) {
//            user.setEmail(request.getEmail());
//        }
//
//        if (request.getPhone_number() != null) {
//            user.setPhone_number(request.getPhone_number());
//        }
//    }
//}
//package org.example.advancedrealestate_be.mapper;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.example.advancedrealestate_be.dto.request.UserCreationRequest;
import org.example.advancedrealestate_be.dto.request.UserUpdateRequest;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.dto.response.UserResponse;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements UserMapper {

    private final PasswordEncoder passwordEncoder;
    @Value("${server.port}")
    private String serverPort;

    @Value("${server.host}")
    private String serverHost;
    private String url = "http://";
    @Value("${app.protocol}")
    private String protocol;

    private final PermissionService permissionService;

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserMapperImpl(@Lazy PasswordEncoder passwordEncoder, PermissionService permissionService, PermissionRepository permissionRepository, RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.permissionService = permissionService;
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public User toUser(UserCreationRequest request) {
        if (request == null) {
            return null;
        }
        Role role = roleRepository.findById(request.getRole_id()).orElse(null);

        User user = new User();
        user.setUser_name(request.getUser_name());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password
        user.setEmail(request.getEmail());
        user.setFirst_name(request.getFirst_name());
        user.setLast_name(request.getLast_name());
        user.setBirthday(request.getBirthday());
        user.setAddress(request.getAddress());
        user.setPhone_number(request.getPhone_number());
        user.setAvatar(request.getAvatar() != null ? String.valueOf(request.getAvatar()) : null); // Handle avatar if present
        user.setStatus(request.getStatus());
        user.setRole(role);
        // Add additional fields as necessary
        return user;
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        // Map Role to RoleResponse
        RoleResponse roleResponse = null;
        List<String> permissions = new ArrayList<>();

        if (user.getRole() == null) {
            System.out.println("Role is null for user: " + user.getUser_name());
            roleResponse = RoleResponse.builder()
                    .role_name("Unknown Role")
                    .build();
        } else {
            Role role = user.getRole();
            System.out.println("Role Name: " + role.getRole_name());

            // Map Role to RoleResponse
            roleResponse = RoleResponse.builder()
                    .id(role.getId())
                    .role_name(role.getRole_name())
                    .role_type(role.getRole_type())
                    .build();

            permissions = permissionRepository.findPermissionsByRoleLink(user.getRole().getId());
        }

        // Map Avatar to URL
        String avatarUrl = null;
        if (user.getAvatar() != null) {
            String fileName = Paths.get(user.getAvatar()).getFileName().toString();
            avatarUrl = protocol + serverHost + ":" + serverPort + "/api/user/" + fileName;
        }

        // Build UserResponse
        assert roleResponse != null;
        return UserResponse.builder()
                .id(user.getId())
                .user_name(user.getUser_name())
                .email(user.getEmail())
                .first_name(user.getFirst_name())
                .last_name(user.getLast_name())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .phone_number(user.getPhone_number())
                .status(user.getStatus())
                .address(user.getAddress())
                .avatar(avatarUrl)
                .roles(roleResponse.getRole_name())
                .role_id(roleResponse.getId())
                .role_type(roleResponse.getRole_type())
                .permission(permissions)
                .build();
    }

    @Override
    public UserResponse toUserResponseByRole(User user) {
        UserResponse dto = UserResponse.builder()
//                .id(user.getId())
                .roles(user.getRole().getRole_name())
                .email(user.getEmail())
                .build();
        if (dto != null) {
            return dto;
        } else {
            System.out.println(Optional.empty());
            return null;
        }
    }

    // Helper method to map Role to RoleResponse
    private RoleResponse mapRoleToRoleResponse(Role role) {
        if (role == null) {
            return RoleResponse.builder().role_name("Unknown Role").build();
        }

        return RoleResponse.builder()
                .role_name(role.getRole_name())
                .build();
    }

    // Helper method to map Permissions to List
    private List<String> mapPermissionsToList(User user) {
        List<String> permissions = new ArrayList<>();
        if (user.getRole() != null && user.getRole().getId() != null) {
            permissions = permissionRepository.findPermissionsByRoleLink(user.getRole().getId());
        }
        return permissions;
    }

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if (user == null || request == null) {
            return; // You might want to throw an exception or log this
        }

        // Update fields based on request
        if (request.getUser_name() != null) {
            user.setUser_name(request.getUser_name());
        }

        if (request.getFirst_name() != null) {
            user.setFirst_name(request.getFirst_name());
        }

        if (request.getLast_name() != null) {
            user.setLast_name(request.getLast_name());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        if (request.getPhone_number() != null) {
            user.setPhone_number(request.getPhone_number());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(String.valueOf(request.getBirthday()));
        }

        Role role = roleRepository.findById(request.getRole_id()).orElse(null);

        if(request.getRole_id() != null) {
            user.setRole(role);
        }
    }
}
