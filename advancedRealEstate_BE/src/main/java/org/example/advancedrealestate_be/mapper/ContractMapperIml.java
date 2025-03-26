package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.entity.Contracts;
import org.springframework.stereotype.Component;

@Component
public class ContractMapperIml implements ContractMapper {

    @Override
    public Contracts toRequest(ContractCreateRequest request) {
        if(request == null) {
            return null;
        }

        Contracts contracts = new Contracts();
        contracts.setContract_code(request.getContract_code());
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
}
