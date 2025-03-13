package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.AuctionDetailRequest;
import org.example.advancedrealestate_be.dto.request.AuctionRequest;
import org.example.advancedrealestate_be.dto.response.AuctionDetailResponse;
import org.example.advancedrealestate_be.dto.response.AuctionResponse;

import java.util.List;

public interface AuctionDetailService {

    List<AuctionDetailResponse> findAll();

    List<AuctionDetailResponse> userAuctionDetails(String clientId);

    JSONObject findById(String id);

    JSONObject create(AuctionDetailRequest dto);

    JSONObject updateById(String id, AuctionDetailRequest dto);

    JSONObject deleteById(String id);
}
