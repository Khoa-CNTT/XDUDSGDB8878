package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.response.AuctionDetailResponse;
import org.example.advancedrealestate_be.dto.response.AuctionHistoryResponse;
import org.example.advancedrealestate_be.entity.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Component
public class AuctionHistoryMapper {

    @Value("${server.port}")
    private String serverPort;
    @Value("${server.host}")
    private String serverHost;

    public AuctionHistoryResponse mapToAuctionHistory(AuctionHistory auctionHistory) {

        Auction auction = auctionHistory.getAuction() == null ? null : auctionHistory.getAuction();
        assert auction != null;
        Building building = auction.getBuilding() == null ? null : auction.getBuilding();
        User client = auctionHistory.getClient() == null ? null : auctionHistory.getClient();
        List<String> buildingImageUrls = new ArrayList<>();

        if (auction.getBuilding().getImage() != null && !auction.getBuilding().getImage().isEmpty()) {
            String[] imagePaths = auction.getBuilding().getImage().split(";");
            for (String path : imagePaths) {
                if (!path.trim().isEmpty()) {
                    String fileName = Paths.get(path).getFileName().toString();
                    String url = String.format("http://%s:%s/api/user/building/%s",
                    serverHost, serverPort, fileName);
                    buildingImageUrls.add(url);
                }
            }
        }
        AuctionHistoryResponse dto = AuctionHistoryResponse.builder()
                .id(auctionHistory.getId())
                .bidAmount(auctionHistory.getBidAmount())
                .bidTime(auctionHistory.getBidTime())
                .identityKey(auctionHistory.getIdentity_key())
                .messageBidId(auctionHistory.getMessageBidId())
                .status(auctionHistory.getStatus())
                .auction(auction)
                .building(building)
                .client(client)
                .buildingImageUrls(buildingImageUrls)
                .build();
        if (dto != null) {

            return dto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
