package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.dto.request.ContractRequest;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.dto.response.CustomerResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Contracts;
import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.ContractMapper;
import org.example.advancedrealestate_be.repository.BuildingRepository;
import org.example.advancedrealestate_be.repository.ContractReposetory;
import org.example.advancedrealestate_be.repository.CustomersRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContractHandler implements ContractService {
//    @Autowired
//    private ContractReposetory contractsRepository;
//
//    @Autowired
//    private CustomersRepository customersRepository;
//
//    @Autowired
//    private BuildingRepository buildingRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public ContractResponse createContract(ContractRequest request) {
//        Contracts contract = new Contracts();
//        mapRequestToContract(request, contract);
//        Contracts savedContract = contractsRepository.save(contract);
//        return mapContractToResponse(savedContract);
//    }
//
//    @Override
//    public ContractResponse updateContract(String id, ContractRequest request) {
//        Contracts contract = contractsRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Contract not found"));
//        mapRequestToContract(request, contract);
//        Contracts updatedContract = contractsRepository.save(contract);
//        return mapContractToResponse(updatedContract);
//    }
//
//    @Override
//    public ContractResponse getContractById(String id) {
//        Contracts contract = contractsRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Contract not found"));
//        return mapContractToResponse(contract);
//    }
//
//    @Override
//    public List<ContractResponse> getAllContracts() {
//        return contractsRepository.findAll().stream()
//                .map(this::mapContractToResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public void deleteContract(String id) {
//        contractsRepository.deleteById(id);
//    }
//
//    @Override
//    public void mapRequestToContract(ContractRequest request, Contracts contract) {
//        contract.setContract_name(request.getContractName());
//        contract.setContract_details(request.getContractDetails());
//
//        Customers customer = customersRepository.findById(request.getCustomerId())
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//        contract.setCustomer(customer);
//
//        Building building = buildingRepository.findById(request.getBuildingId())
//                .orElseThrow(() -> new RuntimeException("Building not found"));
//        contract.setBuilding(building);
//
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        contract.setUser(user);
//    }
//
//    public ContractResponse mapContractToResponse(Contracts contract) {
//        ContractResponse response = new ContractResponse();
//        response.setId(contract.getId());
//        response.setContractName(contract.getContract_name());
//        response.setContractDetails(contract.getContract_details());
//        response.setCustomerName(contract.getCustomer().getFirst_name() + " " + contract.getCustomer().getLast_name());
//        response.setBuildingName(contract.getBuilding().getName());
//        response.setUserName(contract.getUser().getUsername());
//        response.setTransactionIds(contract.getTransactions().stream().map(t -> t.getId()).collect(Collectors.toList()));
//        response.setInvoiceIds(contract.getInvoices().stream().map(i -> i.getId()).collect(Collectors.toList()));
//        return response;
//    }
    private final ContractReposetory contractRepository;
    private final ContractMapper contractMapper;
    private final CustomersRepository customersRepository;
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;

    @Autowired
    public ContractHandler(ContractReposetory contractRepository, ContractMapper contractMapper, CustomersRepository customersRepository, BuildingRepository buildingRepository, UserRepository userRepository) {
        this.contractRepository = contractRepository;
        this.contractMapper = contractMapper;
        this.customersRepository = customersRepository;
        this.buildingRepository = buildingRepository;
        this.userRepository = userRepository;
    }
    // Create a new contract

    @Override
    public String createContract(ContractRequest request) {
//        Contracts contract = contractMapper.toEntity(request);
//        contract = contractRepository.save(contract);
//        return contractMapper.toResponse(contract);
        // Map to entity

        try{
            Contracts contract = contractMapper.toEntity(request);

            Customers customer = customersRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            contract.setCustomer(customer);

            Building building = buildingRepository.findById(request.getBuildingId())
                    .orElseThrow(() -> new RuntimeException("Building not found"));
            contract.setBuilding(building);

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            contract.setUser(user);

            // Set the entities to the contract
            contract.setCustomer(customer);
            contract.setBuilding(building);
            contract.setUser(user);
            contract=contractRepository.save(contract);
            // Save the contract entity
            return "Create contract successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }


    }

    // Get a contract by ID
    @Override
    public ContractResponse getContractById(String id) {
        return contractRepository.findById(id)
                .map(contractMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }

    // Update a contract by ID
    @Override
    public String updateContract(String id, ContractRequest request) {
        Contracts contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        try{


            contract.setContract_name(request.getContractName());
//        contract.setContract_details(request.getContractDetails());
            // Set other fields based on the request data as necessary

            contractRepository.save(contract);
            return "Update contract successfully !";
        }catch(DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }


    }

    // Delete a contract by ID
    @Override
    public String deleteContract(String id) {
        Contracts contracts = contractRepository.findById(id).orElseThrow(()-> new RuntimeException("Can not find this id"));
        try{
            contractRepository.delete(contracts);
            return "Delete contract successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }
    }

    // List all contracts


    @Override
    public Page<ContractResponse> getAllContracts(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Contracts> contractsPage = contractRepository.findAll(pageable);

        List<ContractResponse> contractResponses= contractsPage.getContent().stream()
                .map(contractMapper::toResponse)
                .collect(Collectors.toList());

        // Tạo đối tượng Page<TypeBuildingResponse> từ List<TypeBuildingResponse> và thông tin phân trang của Page<User>
        return new PageImpl<>(contractResponses, pageable, contractsPage.getTotalElements());
    }

    // Add this method to your ContractHandler class
    @Override
    public String deleteContracts(List<String> ids) {
        try{
            List<Contracts> contractsToDelete = contractRepository.findAllById(ids);
            if (contractsToDelete.size() != ids.size()) {
                throw new RuntimeException("Some contracts not found");
            }
            contractRepository.deleteAll(contractsToDelete);
            return "Delete all contract successfully !";
        }catch (DataIntegrityViolationException exception){
            throw new RuntimeException(exception);
        }

    }



}
