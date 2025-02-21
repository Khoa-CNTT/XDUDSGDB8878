package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.response.AuctionDetailResponse;
import org.example.advancedrealestate_be.dto.response.AuctionResponse;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.AuctionDetail;
import org.example.advancedrealestate_be.entity.Map;
import org.example.advancedrealestate_be.entity.User;

import java.util.Optional;

public class AuctionDetailMapper {
    public static AuctionDetailResponse mapToAuctionDetail(AuctionDetail auctionDetail) {

        Auction auction = auctionDetail.getAuction() == null ? null :
                auctionDetail.getAuction();
        User client = auctionDetail.getClient() == null ? null :
                auctionDetail.getClient();
        AuctionDetailResponse dto = AuctionDetailResponse.builder()
                .id(auctionDetail.getId())
                .note(auctionDetail.getNote())
                .result(auctionDetail.getResult())
                .bidAmount(auctionDetail.getBidAmount())
                .status(auctionDetail.getStatus())
                .auction(auction)
                .client(client)
                .build();
        if (dto != null) {

            return dto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
