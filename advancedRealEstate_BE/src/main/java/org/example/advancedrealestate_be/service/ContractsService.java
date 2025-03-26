package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Service
public interface ContractsService {
    String createContract(ContractCreateRequest request);
    String updateFileContract(String contractId, ContractUpdateFileRequest request, MultipartFile file);
    String changeContractStatus(String contractId);
    String updateImageContract(String contractId, ContractUpdateImageRequest request);
    String deleteContract(String buildingId);
    Page<ContractResponse> getContract(int page, int size);
}
