package org.example.advancedrealestate_be.service.handler;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateFileRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateImageRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateResquest;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Contracts;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.ContractMapper;
import org.example.advancedrealestate_be.repository.ContractReposetory;
import org.example.advancedrealestate_be.service.ContractsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ContractsHandlerService implements ContractsService {
    private final ContractReposetory contractReposetory;
    private final ContractMapper contractMapper;
    @Autowired
    public ContractsHandlerService(ContractReposetory contractReposetory, ContractMapper contractMapper) {
        this.contractReposetory = contractReposetory;
        this.contractMapper = contractMapper;
    }

    @Override
    public String createContract(ContractCreateRequest request) {
        try {
            Contracts contracts = contractMapper.toRequest(request);
            contracts.setStatus(1);
            contractReposetory.save(contracts);
            return "Đã thêm mới thành công!!";

        } catch (Exception e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
    }


    private String uploadDir = "uploads/contract/";

    @Override
    public String updateFileContract(String contractId, ContractUpdateFileRequest request, MultipartFile file) {
        try {
            // 1. Validate contract exists
            Contracts contract = contractReposetory.findByContractCode(contractId)
                    .orElseThrow(() -> new RuntimeException("Contract not found"));

            // 2. Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 3. Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = "contract_" + contractId + "_" + System.currentTimeMillis() + fileExtension;

            // 4. Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. Update contract with file info
            contract.setFile_contract(filePath.toString());
            contract.setStatus(2);//2: Xác nhận gửi hợp đồng
//            contract.setFileContractPath(filePath.toString());
            contractReposetory.save(contract);

            return "File uploaded successfully: " + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public String changeContractStatus(String id) {
        Contracts contract = contractReposetory.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found with id: " + id));

        // Logic thay đổi trạng thái
        int currentStatus = contract.getStatus();
        if(currentStatus == 2) {
            contract.setStatus(3);
            contractReposetory.save(contract);
            return "Contract status changed successfully";
        } else {
            contract.setStatus(4);
            contractReposetory.save(contract);
            return "The contract has been cancelled.";
        }
    }

    @Override
    public String updateImageContract(String contractId, ContractUpdateImageRequest request) {
        return "";
    }

    @Override
    public String deleteContract(String buildingId) {
        return "";
    }

    @Override
    public Page<ContractResponse> getContract(int page, int size) {
        return null;
    }
}
