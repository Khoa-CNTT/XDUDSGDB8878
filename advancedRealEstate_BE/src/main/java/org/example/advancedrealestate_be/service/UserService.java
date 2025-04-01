package org.example.advancedrealestate_be.service;

import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.UserResponse;
//import org.example.advancedrealestate_be.dto.response.UserRoleResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    UserResponse getMyInfo();
    UserResponse getMyInfo(String email);
    UserResponse getUser(String id);
    List<UserResponse> getAllUsers();
    void deleteUser(String userId);
    String updateUser(String userId, UserUpdateRequest request);
    String updatePasswordUser(String userId, UserUpdatePasswordRequest request);
    UserResponse updateUserInfo(String userId, UpdateInfoUserRequest request);
//    UserRoleResponse updateRoleUser(String userId, UserRoleRequest request);
    String createUser(@Valid UserCreationRequest request);
    Page<UserResponse> getUsers(int page, int size);
    String createUserbyEmail(UserRequest userRequest);

    List<UserResponse> getUserByStaffRole();

    List<UserResponse> getUserByClientRole();
}