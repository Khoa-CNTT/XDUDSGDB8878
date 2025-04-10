package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.AuctionContractRequest;
import org.example.advancedrealestate_be.dto.request.AuctionDetailRequest;
import org.example.advancedrealestate_be.dto.request.AuctionPaymentRequest;
import org.example.advancedrealestate_be.dto.response.AuctionContractResponse;
import org.example.advancedrealestate_be.dto.response.AuctionDetailResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AuctionContractService {
    List<AuctionContractResponse> findAll();

    List<AuctionContractResponse> userAuctionContracts(String clientId);

    JSONObject findById(String id);

    JSONObject create(AuctionContractRequest dto);

    JSONObject updateById(String id, AuctionContractRequest dto);

    JSONObject confirm_payment(String id, AuctionPaymentRequest dto);

    JSONObject confirmContract(String id, MultipartFile contractImageFile);

    JSONObject deleteById(String id);
}