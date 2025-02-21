package org.example.advancedrealestate_be.service.handler;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.AuctionDetailRequest;
import org.example.advancedrealestate_be.dto.response.AuctionDetailResponse;
import org.example.advancedrealestate_be.dto.response.AuctionResponse;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.AuctionDetail;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.AuctionDetailMapper;
import org.example.advancedrealestate_be.mapper.AuctionMapper;
import org.example.advancedrealestate_be.repository.AuctionDetailRepository;
import org.example.advancedrealestate_be.repository.AuctionRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.AuctionDetailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuctionDetailHandler implements AuctionDetailService {

    private final AuctionDetailRepository auctionDetailRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final AuctionRepository auctionRepository;
    @Autowired
    public AuctionDetailHandler(AuctionDetailRepository auctionDetailRepository, UserRepository userRepository, ModelMapper modelMapper, AuctionRepository auctionRepository) {
        this.auctionDetailRepository = auctionDetailRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.auctionRepository = auctionRepository;
    }

//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public List<AuctionDetailResponse> findAll() {
        List<AuctionDetail> auctionDetailList = auctionDetailRepository.findAll();

        return auctionDetailList.stream()
                .map(AuctionDetailMapper::mapToAuctionDetail)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuctionDetailResponse> userAuctionDetails(String clientId) {
        List<AuctionDetail> userAuctionDetailList = auctionDetailRepository.findAuctionDetailsByClientId(clientId);
        return userAuctionDetailList.stream()
                .map(AuctionDetailMapper::mapToAuctionDetail)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','USER')")
    @Override
    public JSONObject findById(String id) {
        AuctionDetail auctionDetail = auctionDetailRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.AUCTION_DETAIL_NOT_FOUND));
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", new AuctionDetailResponse(
            auctionDetail.getId(),
            auctionDetail.getNote(),
            auctionDetail.getResult(),
            auctionDetail.getBidAmount(),
            auctionDetail.getStatus(),
            auctionDetail.getAuction(),
            auctionDetail.getClient()
        ));
        return responseObject;
    }

//    @PreAuthorize("hasAnyRole('ADMIN','STAFF','USER')")
    @Override
    public JSONObject create(AuctionDetailRequest dto) {
        JSONObject responseObject = new JSONObject();
        AuctionDetail auctionDetail = modelMapper.map(dto, AuctionDetail.class);
        AuctionDetail auctionDetailNew = auctionDetailRepository.save(auctionDetail);
        responseObject.put("data", auctionDetailNew);
        return responseObject;
    }

//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public JSONObject updateById(String id, AuctionDetailRequest dto) {
        JSONObject responseObject = new JSONObject();
        Auction auction = auctionRepository.findById(dto.getAuction_id()).orElse(null);
        User client = userRepository.findById(dto.getClient_id()).orElse(null);
        AuctionDetail auctionDetail = auctionDetailRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.AUCTION_DETAIL_NOT_FOUND));
        auctionDetail.setNote(dto.getNote());
        auctionDetail.setResult(dto.getResult());
        auctionDetail.setBidAmount(dto.getBidAmount());
        auctionDetail.setStatus(dto.getStatus());
        auctionDetail.setAuction(auction);
        auctionDetail.setClient(client);
        AuctionDetail auctionDetailUpdated = auctionDetailRepository.save(auctionDetail);
        responseObject.put("data", auctionDetailUpdated);
        responseObject.put("message", "Updated successfully!");
        return responseObject;
    }

//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public JSONObject deleteById(String id) {
        JSONObject responseObject = new JSONObject();
        auctionDetailRepository.deleteById(id);
        responseObject.put("message", "Delete successfully!");
        return responseObject;
    }
}
