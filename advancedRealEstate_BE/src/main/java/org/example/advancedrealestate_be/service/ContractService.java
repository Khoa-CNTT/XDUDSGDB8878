package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.ContractRequest;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.dto.response.CustomerResponse;
import org.example.advancedrealestate_be.entity.Contracts;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ContractService {

//    public ContractResponse createContract(ContractRequest request);
//    public ContractResponse updateContract(String id, ContractRequest request);
//    public ContractResponse getContractById(String id);
//    public List<ContractResponse> getAllContracts();
//    public void deleteContract(String id);
//
//    ContractResponse mapContractToResponse(Contracts contract);
//    public void mapRequestToContract(ContractRequest request, Contracts contract);
    String createContract(ContractRequest request);
    ContractResponse getContractById(String id);
    String updateContract(String id, ContractRequest request);
    String deleteContract(String id);
    Page<ContractResponse> getAllContracts(int page, int size);
    String deleteContracts(List<String> ids);

}
