package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Contracts;
import org.example.advancedrealestate_be.entity.User;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ContractMapperIml implements ContractMapper {

    @Override
    public Contracts toRequest(ContractCreateRequest request) {
        if(request == null) {
            return null;
        }

        Contracts contracts = new Contracts();
        contracts.setFull_name(request.getFull_name());
        contracts.setBirth_date(request.getBirth_date());
        contracts.setEmail(request.getEmail());
        contracts.setPhone(request.getPhone());
        contracts.setAddress(request.getAddress());
        contracts.setStart_date(request.getStart_date());
        contracts.setEnd_date(request.getEnd_date());
        contracts.setCccdid(request.getCccdid());
        contracts.setPlace_of_issue(request.getPlace_of_issue());
        contracts.setPrice(request.getPrice());
        contracts.setTotal_amount(request.getTotal_amount());
        return  contracts;
    }

    @Override
    public ContractResponse toResponse(Contracts contracts) {
        if (contracts == null) {
            return null;
        }

        ContractResponse.ContractResponseBuilder builder = ContractResponse.builder()
                .id(contracts.getId())
                .contract_code(contracts.getContract_code())
                .full_name(contracts.getFull_name())
                .birth_date(contracts.getBirth_date())
                .email(contracts.getEmail())
                .phone(contracts.getPhone())
                .address(contracts.getAddress())
                .start_date(contracts.getStart_date())
                .end_date(contracts.getEnd_date())
                .cccdid(contracts.getCccdid())
                .place_of_issue(contracts.getPlace_of_issue())
                .image_signature(contracts.getImage_signature())
                .price(contracts.getPrice())
                .total_amount(contracts.getTotal_amount())
                .status(contracts.getStatus())
                .file_contract(contracts.getFile_contract())
                .building_id(contracts.getBuilding().getId())
                .user_id(contracts.getUser().getId());

        return builder.build();
    }
}
