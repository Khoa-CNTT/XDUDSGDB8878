package org.example.advancedrealestate_be.service.handler;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.UserResponse;
import org.example.advancedrealestate_be.entity.EmailVerificationToken;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.UserMapper;
import org.example.advancedrealestate_be.repository.EmailVerificationTokenRepository;
import org.example.advancedrealestate_be.repository.RoleRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserServiceHandler implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SendEmailHandler sendEmailHandler;

    private final EmailVerificationTokenRepository tokenRepository;


    @Autowired
    public UserServiceHandler(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, SendEmailHandler sendEmailHandler, EmailVerificationTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.sendEmailHandler = sendEmailHandler;
        this.tokenRepository = tokenRepository;

    }

    private static final String IMAGE_DIRECTORY = "IMAGE";

    @Override
    public String createUser(@Valid UserCreationRequest request) {

        User user = userMapper.toUser(request);
        System.out.println(userRepository.findByEmail(request.getEmail()));

        Optional<User> existUser = userRepository.findByEmail(request.getEmail());
        if(existUser.isPresent()){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRawPassword(passwordEncoder.encode(request.getPassword()));

        MultipartFile avatar = request.getAvatar();
        if (avatar != null && !avatar.isEmpty()) {
            // Kiểm tra và tạo thư mục "IMAGE" nếu chưa tồn tại
            File directory = new File(IMAGE_DIRECTORY);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lưu ảnh vào thư mục "IMAGE"
            String fileName = avatar.getOriginalFilename();
            Path filePath = Paths.get(IMAGE_DIRECTORY, fileName);
            try {
                avatar.transferTo(filePath);
                // Bạn có thể lưu đường dẫn vào DB nếu cần
                user.setAvatar(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Lưu ảnh thất bại", e);
            }
        }
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            System.out.println("error: "+exception);
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return "tao user thanh cong !";
    }

    @Override
    @Transactional
    public String createUserbyEmail(UserRequest userRequest) {
        if (userRequest.getRawPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }

        User user = new User();
        user.setFirst_name(userRequest.getFirstName());
        user.setLast_name(userRequest.getLastName());
        user.setUser_name(userRequest.getUserName());
        user.setEmail(userRequest.getEmail());
        // Set the raw password
        user.setRawPassword(userRequest.getRawPassword());

        // Encrypt the password (if needed)
        String encryptedPassword = passwordEncoder.encode(userRequest.getRawPassword());
        user.setPassword(encryptedPassword);
        User newUser = userRepository.save(user);

        // Generate email verification token and send email
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(newUser);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        tokenRepository.save(verificationToken);

//         Send verification email with the token
//        sendEmailHandler.sendVerificationEmail(userRequest.getEmail(), token);

        return "User created and verification email sent.";
    }


//    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'STAFF')")
    @Override
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        System.out.println("user: " + context.getAuthentication());

        User user = userRepository.findByEmail(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getMyInfo(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @Override
    public String updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        userRepository.save(user);
        return "Đã cập nhập thành công!";
    }

    @Override
    public String updatePasswordUser(String userId, UserUpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        System.out.println(user.getPassword());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        System.out.println(user);

        userRepository.save(user);
        return "Đã cập nhập thành công!";
    }

    @Override
    public UserResponse updateUserInfo(String userId, UpdateInfoUserRequest request) {
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setUser_name(request.getFirst_name() +" "+ request.getLast_name());
        user.setFirst_name(request.getFirst_name());
        user.setLast_name(request.getLast_name());
        user.setPhone_number(request.getPhone_number());
        user.setAddress(request.getAddress());
        user.setBirthday(request.getBirthday());
        user.setGender(request.getGender());

        User userUpdate = userRepository.save(user);
        System.out.println("update phone: "+userUpdate.getGender());
        return new UserResponse(
            userUpdate.getId(),
            userUpdate.getFirst_name(),
            userUpdate.getLast_name(),
            userUpdate.getUser_name(),
            userUpdate.getStatus(),
            userUpdate.getEmail(),
            userUpdate.getPhone_number(),
            userUpdate.getBirthday(),
            userUpdate.getGender(),
            userUpdate.getAvatar(),
            userUpdate.getAddress(),
            null,
            null,
                null
        );
    }


//    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<UserResponse> getAllUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).collect(Collectors.toList());
    }

    @Override
    public Page<UserResponse> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage = userRepository.findAll(pageable);

        // Chuyển đổi Page<User> thành List<UserResponse>
        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());

        // Tạo đối tượng Page<UserResponse> từ List<UserResponse> và thông tin phân trang của Page<User>
        return new PageImpl<>(userResponses, pageable, userPage.getTotalElements());
    }

//  @PreAuthorize("hasRole('ADMIN')")
    @Override
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    @Override
    public List<UserResponse> getUserByStaffRole() {
        List<User> userList = userRepository.findUsersByRoleType("MANAGEMENT");
        return userList.stream().map(
            userMapper::toUserResponseByRole
        ).collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public List<UserResponse> getUserByClientRole() {
        List<User> userList = userRepository.findUsersByRoleType("NORMAL");
        return userList.stream().map(
                userMapper::toUserResponseByRole
        ).collect(Collectors.toList());
    }
}
