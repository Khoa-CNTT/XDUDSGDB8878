package org.example.advancedrealestate_be.service.handler;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateFileRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateImageRequest;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Contracts;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.ContractMapper;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.repository.ContractReposetory;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.ContractsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ContractsHandlerService implements ContractsService {
    ContractReposetory contractRepository; // Fixed typo
    ContractMapper contractMapper;
    UserRepository userRepository;
    BuildingRepository buildingRepository;
    JavaMailSender mailSender;
    TemplateEngine templateEngine;

    private String fromEmail = "manhsubcheo2@gmail.com";

    private String uploadDir = "uploads/contract/";

    @Autowired
    public ContractsHandlerService(
            ContractReposetory contractRepository,
            ContractMapper contractMapper,
            UserRepository userRepository,
            BuildingRepository buildingRepository,
            JavaMailSender mailSender,
            TemplateEngine templateEngine) {
        this.contractRepository = contractRepository;
        this.contractMapper = contractMapper;
        this.userRepository = userRepository;
        this.buildingRepository = buildingRepository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public String createContract(ContractCreateRequest request) {
        try {
            Building building = buildingRepository.findById(request.getBuilding_id())
                    .orElseThrow(() -> new RuntimeException("Building not found with ID: " + request.getBuilding_id()));
            User user = userRepository.findById(request.getUser_id())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUser_id()));

            Contracts contracts = contractMapper.toRequest(request);

            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String formattedDateTime = now.format(formatter);
            String uniqueId = UUID.randomUUID().toString().substring(0, 4);
            contracts.setContract_code("HD" + formattedDateTime + uniqueId);

            contracts.setStatus(1); // Trạng thái mặc định
            contracts.setBuilding(building);
            contracts.setUser(user);

            contractRepository.save(contracts);

            return "Đã thêm mới thành công!!";
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create contract: " + e.getMessage());
        }
    }

    @Override
    public String updateFileContract(String contractId, ContractUpdateFileRequest request, MultipartFile file) {
        try {
            // 1. Validate contract exists
            Contracts contract = contractRepository.findById(contractId)
                    .orElseThrow(() -> new RuntimeException("Contract not found with code: " + contractId));

            // 2. Validate file
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is required");
            }

            // 3. Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 4. Generate unique filename
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                throw new RuntimeException("Invalid file name");
            }
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = "contract_" + contractId + "_" + System.currentTimeMillis() + fileExtension;

            // 5. Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 6. Update contract with file info
            contract.setFile_contract(filePath.toString());
            contract.setStatus(2); // 2: Xác nhận gửi hợp đồng
            contractRepository.save(contract);

            // 7. Send email with Word file attachment to customer's email
            sendEmailWithAttachmentAndTemplate(
                    contract,
                    "Thông Báo: File Hợp Đồng Đã Được Tải Lên",
                    "contract-update",
                    filePath,
                    newFilename
            );

            return "File uploaded successfully: " + newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email with attachment: " + e.getMessage());
        }
    }

    private void sendEmailWithAttachmentAndTemplate(
            Contracts contract,
            String subject,
            String templateName,
            Path filePath,
            String fileName) throws MessagingException {
        if (contract.getEmail() == null || contract.getEmail().trim().isEmpty()) {
            log.warn("No email address provided for contract: {}", contract.getContract_code());
            return;
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8"); // true for multipart

        helper.setFrom(fromEmail);
        helper.setTo(contract.getEmail()); // Customer's email from Contracts table
        helper.setSubject(subject);

        // Process Thymeleaf template
        Context context = new Context();
        context.setVariable("fullName", contract.getFull_name() != null ? contract.getFull_name() : "Quý khách");
        context.setVariable("contractCode", contract.getContract_code());
        String body = templateEngine.process(templateName, context);

        helper.setText(body, true);
        helper.addAttachment(fileName, filePath.toFile()); // Attach the Word file

        mailSender.send(message);
        log.info("Email with Word file attachment sent to {} for contract {}", contract.getEmail(), contract.getContract_code());
    }

    // Placeholder for existing sendEmailHasTemplate
    public void sendEmailHasTemplate(String to, String subject, Date deadline, String templateName) {
        try {
            Context context = new Context();
            String body = templateEngine.process(templateName, context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Email sent to {} with subject: {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
//            throw new AppException(ErrorCode.EMAIL_SEND_FAILED, "Failed to send email: " + e.getMessage());
        }
    }


    @Override
    public String changeContractStatus(String id) {
        try {
            Contracts contract = contractRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Contract not found with id: " + id));

            int currentStatus = contract.getStatus();
            if (currentStatus == 2) {
                contract.setStatus(3);
                contractRepository.save(contract);
                return "Contract status changed successfully";
            } else {
                return "Contract status is not change!!";
            }
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update contract status: " + e.getMessage());
        }
    }

    @Override
    public String updateImageContract(String contractId, ContractUpdateImageRequest request) {
        // Implement if needed
        return "Not implemented";
    }

    @Override
    public String deleteContract(String buildingId) {
        // Implement if needed
        return "Not implemented";
    }

    @Override
    public Page<ContractResponse> getContract(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page - 1, size);
            Page<Contracts> contractsPage = contractRepository.findAll(pageable);

            List<ContractResponse> contractResponses = contractsPage.getContent().stream()
                    .map(contractMapper::toResponse)
                    .collect(Collectors.toList());

            return new PageImpl<>(contractResponses, pageable, contractsPage.getTotalElements());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch contracts: " + e.getMessage());
        }
    }

    @Override
    public Page<ContractResponse> getContractsByUserId(String userId, int page, int size) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new RuntimeException("User ID is required");
            }

            userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));


            Pageable pageable = PageRequest.of(page - 1, size);
            Page<Contracts> contractsPage = contractRepository.findByUserId(userId, pageable);

            List<ContractResponse> contractResponses = contractsPage.getContent().stream()
                    .map(contractMapper::toResponse)
                    .collect(Collectors.toList());

            return new PageImpl<>(contractResponses, pageable, contractsPage.getTotalElements());
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch contracts by user ID: " + e.getMessage());
        }
    }
}