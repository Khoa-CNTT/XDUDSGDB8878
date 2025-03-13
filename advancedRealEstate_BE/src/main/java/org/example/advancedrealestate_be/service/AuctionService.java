package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.AuctionRequest;
import org.example.advancedrealestate_be.dto.response.AuctionResponse;

import java.util.List;

public interface AuctionService {

    List<AuctionResponse> findAll();

    JSONObject findById(String id);

    JSONObject create(AuctionRequest dto);

    JSONObject updateById(String id, AuctionRequest dto);

    JSONObject deleteById(String id);
}
