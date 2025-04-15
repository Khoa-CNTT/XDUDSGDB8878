package org.example.advancedrealestate_be.mapper;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.example.advancedrealestate_be.dto.BuildingDto;
import org.example.advancedrealestate_be.dto.response.AuctionResponse;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Map;
import org.example.advancedrealestate_be.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class AuctionMapper {

    @Value("${server.port}")
    private String serverPort;
    @Value("${server.host}")
    private String serverHost;
    @Value("${app.protocol}")
    private String protocol;


    public AuctionResponse mapToAuction(Auction auction) {

        Map map = auction.getBuilding() == null ? null :
                auction.getBuilding().getMap();
        User user = auction.getUserCreatedBy() == null ? null :
                auction.getUserCreatedBy();

        List<String> imageUrls = new ArrayList<>();

        if (auction.getBuilding().getImage() != null && !auction.getBuilding().getImage().isEmpty()) {
            String[] imagePaths = auction.getBuilding().getImage().split(";");
            for (String path : imagePaths) {
                if (!path.trim().isEmpty()) {
                    String fileName = Paths.get(path).getFileName().toString();
                    String url = String.format("%s://%s:%s/api/user/building/%s",
                    protocol, serverHost, serverPort, fileName);
                    imageUrls.add(url);
                }
            }
        }

        AuctionResponse auctionResponse = AuctionResponse.builder()
                .id(auction.getId())
                .name(auction.getName())
                .start_date(auction.getStart_date())
                .start_time(auction.getStart_time())
                .end_time(auction.getEnd_time())
                .description(auction.getDescription())
                .isActive(auction.isActive())
                .building(auction.getBuilding())
                .buildingImages(imageUrls)
                .typeBuilding(auction.getBuilding().getTypeBuilding())
                .map(map)
                .userCreatedBy(user)
                .identity_key(auction.getIdentity_key())
                .build();
        if (auctionResponse != null) {

            return auctionResponse;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
