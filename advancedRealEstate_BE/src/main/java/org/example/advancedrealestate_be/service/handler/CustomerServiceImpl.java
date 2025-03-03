package org.example.advancedrealestate_be.service.handler;

import jakarta.transaction.Transactional;
import org.example.advancedrealestate_be.Utils.JwtUtil;
import org.example.advancedrealestate_be.dto.request.CustomerRequest;
import org.example.advancedrealestate_be.entity.CustomerQueue;
import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.repository.CustomerQueueRepository;
import org.example.advancedrealestate_be.repository.CustomersRepository;
import org.example.advancedrealestate_be.service.CustomerService;
import org.example.advancedrealestate_be.service.EmailService;
import org.example.advancedrealestate_be.service.QueueService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class CustomerServiceImpl implements CustomerService {
    private final EmailService emailService;
    private final CustomersRepository customersRepository;
    private final CustomerQueueRepository customerQueueRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public CustomerServiceImpl(EmailService emailService, CustomersRepository customersRepository, CustomerQueueRepository customerQueueRepository, PasswordEncoder passwordEncoder) {
        this.emailService = emailService;
        this.customersRepository = customersRepository;
        this.customerQueueRepository = customerQueueRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Gửi email yêu cầu reset mật khẩu
    public void requestPasswordReset(String email) {
        Customers customer = customersRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Email not found"));
        // Tạo token
        String token = UUID.randomUUID().toString();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(30);

        // Lưu token vào bảng queue
        CustomerQueue queue = CustomerQueue.builder()
                .customerId(customer.getId())
                .token(token)
                .expirationTime(expirationTime)
                .build();
        customerQueueRepository.save(queue);

        // Gửi email reset mật khẩu
        String resetUrl = "http://localhost:9090/api/customers/reset-password?token=" + token;
        emailService.sendEmail(customer.getEmail(), "Reset Password",
                "Click the link to reset your password: " + resetUrl);
    }

    // Xác nhận token và cập nhật mật khẩu mới
    public void resetPassword(String token, String newPassword) {
        // Tìm token trong bảng queue
        CustomerQueue queue = customerQueueRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        // Kiểm tra token còn hạn
        if (queue.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        // Lấy thông tin customer từ token
        Customers customer = customersRepository.findById(queue.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Cập nhật mật khẩu mới
        customer.setPassword(passwordEncoder.encode(newPassword));
        customersRepository.save(customer);

        // Xóa token khỏi queue
        customerQueueRepository.delete(queue);
    }

    @Transactional
    public String registerCustomer(CustomerRequest request) {


        if (customersRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        Customers customer = Customers.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .userName(request.getUserName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(0) // Unverified
                .isActivity(0) // Inactive
                .build();

        Customers savedCustomer = customersRepository.save(customer);

        String token = UUID.randomUUID().toString();


        CustomerQueue queueEntry = CustomerQueue.builder()
                .customerId(savedCustomer.getId())
                .token(token)
                .build();
        customerQueueRepository.save(queueEntry);

        emailService.sendVerificationEmail(savedCustomer, token);

        return "Tạo tài khoản thành công, hãy check email để kick hoạt tài khoản !";
    }

    @Transactional
    public boolean verifyCustomer(String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token cannot be null or empty.");
        }
        CustomerQueue queueEntry = customerQueueRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token."));

        Customers customer = customersRepository.findById(queueEntry.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        customer.setStatus(1); // Verified
        customer.setIsActivity(1); // Active
        customersRepository.save(customer);

        customerQueueRepository.delete(queueEntry);



        return true;
    }

    public String login(String email, String password) {
        Customers customer = customersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return JwtUtil.generateToken(email);
    }

}
