package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.response.*;
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
    @Value("${app.protocol}")
    private String protocol;

    public AuctionHistoryResponse mapToAuctionHistory(AuctionHistory auctionHistory) {
        Auction auction = auctionHistory.getAuction();
        assert auction != null;

        Building building = auction.getBuilding();
        assert building != null;

        TypeBuilding typeBuilding = building.getTypeBuilding();
        Map map = building.getMap();
        User userCreatedBy = auction.getUserCreatedBy();
        User client = auctionHistory.getClient();

        List<String> buildingImageUrls = new ArrayList<>();
        if (building.getImage() != null && !building.getImage().isEmpty()) {
            String[] imagePaths = building.getImage().split(";");
            for (String path : imagePaths) {
                if (!path.trim().isEmpty()) {
                    String fileName = Paths.get(path).getFileName().toString();
                    String url = String.format("%s://%s:%s/api/user/building/%s",
                            protocol, serverHost, serverPort, fileName);
                    buildingImageUrls.add(url);
                }
            }
        }

        BuildingResponse buildingResponse = BuildingResponse.builder()
                .id(building.getId())
                .name(building.getName())
                .area(building.getAcreage())
                .status(building.getStatus())
                .structure(building.getStructure())
                .description(building.getDescription())
                .typeBuilding(TypeBuildingResponse.builder()
                        .price(typeBuilding.getPrice())
                        .type_name(typeBuilding.getType_name())
                        .build())
                .map(MapResponse.builder()
                        .id(map.getId())
                        .map_name(map.getMap_name())
                        .latitude(map.getLatitude())
                        .longitude(map.getLongitude())
                        .address(map.getAddress())
                        .province(map.getProvince())
                        .district(map.getDistrict())
                        .ward(map.getWard())
                        .build())
                .image(buildingImageUrls)
                .build();

        AuctionResponse auctionResponse = AuctionResponse.builder()
                .id(auction.getId())
                .name(auction.getName())
                .start_date(auction.getStart_date())
                .start_time(auction.getStart_time())
                .end_time(auction.getEnd_time())
                .description(auction.getDescription())
                .isActive(auction.isActive())
                .identity_key(auction.getIdentity_key())
                .building(buildingResponse)
                .typeBuilding(TypeBuildingResponse.builder()
                .price(typeBuilding.getPrice())
                .type_name(typeBuilding.getType_name())
                .build())
                .map(MapResponse.builder()
                        .id(map.getId())
                        .map_name(map.getMap_name())
                        .latitude(map.getLatitude())
                        .longitude(map.getLongitude())
                        .address(map.getAddress())
                        .province(map.getProvince())
                        .district(map.getDistrict())
                        .ward(map.getWard())
                        .build())
                .userCreatedBy(UserResponse.builder()
                        .id(userCreatedBy.getId())
                        .first_name(userCreatedBy.getFirst_name())
                        .last_name(userCreatedBy.getLast_name())
                        .user_name(userCreatedBy.getUser_name())
                        .status(userCreatedBy.getStatus())
                        .email(userCreatedBy.getEmail())
                        .gender(userCreatedBy.getGender())
                        .phone_number(userCreatedBy.getPhone_number())
                        .birthday(userCreatedBy.getBirthday())
                        .avatar(userCreatedBy.getAvatar())
                        .address(userCreatedBy.getAddress())
                        .roles(userCreatedBy.getRole().getRole_name())
                        .role_id(userCreatedBy.getRole().getId())
                        .role_type(userCreatedBy.getRole().getRole_type())
                        .build())
                .buildingImages(buildingImageUrls)
                .build();

        UserResponse clientResponse = null;
        if (client != null) {
            clientResponse = UserResponse.builder()
                    .id(client.getId())
                    .first_name(client.getFirst_name())
                    .last_name(client.getLast_name())
                    .user_name(client.getUser_name())
                    .status(client.getStatus())
                    .email(client.getEmail())
                    .gender(client.getGender())
                    .phone_number(client.getPhone_number())
                    .birthday(client.getBirthday())
                    .avatar(client.getAvatar())
                    .address(client.getAddress())
                    .roles(client.getRole().getRole_name())
                    .role_id(client.getRole().getId())
                    .role_type(client.getRole().getRole_type())
                    .build();
        }

        return AuctionHistoryResponse.builder()
                .id(auctionHistory.getId())
                .bidAmount(auctionHistory.getBidAmount())
                .bidTime(auctionHistory.getBidTime())
                .identityKey(auctionHistory.getIdentity_key())
                .messageBidId(auctionHistory.getMessageBidId())
                .status(auctionHistory.getStatus())
                .auction(auctionResponse)
                .buildingResponse(buildingResponse)
                .client(clientResponse)
                .buildingImageUrls(buildingImageUrls)
                .build();
    }

}
