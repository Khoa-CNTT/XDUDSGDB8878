package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.BuildingCreateRequest;
import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Contracts;
import org.mapstruct.Mapper;

public interface ContractMapper {
//
//    @Mapping(source = "customer.id", target = "customerId")
//    @Mapping(source = "building.id", target = "buildingId")
//    @Mapping(source = "user.id", target = "userId")
////    @Mapping(source = "contractDetails", target = "contractDetails")
//    ContractResponse toResponse(Contracts contract);
//
//    @Mapping(target = "customer", ignore = true)
//    @Mapping(target = "building", ignore = true)
//    @Mapping(target = "user", ignore = true)
//    Contracts toEntity(ContractRequest request);
//
//
////    default String map(Contract_details value) {
////        // Example: Convert Contract_details to a string representation
////        return value != null ? value.getContent() + " - Amount: " + value.getAmount() : null;
////    }


    Contracts toRequest(ContractCreateRequest request);
}


