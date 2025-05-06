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
public class AuctionDetailMapper {

    @Value("${server.port}")
    private String serverPort;
    @Value("${server.host}")
    private String serverHost;
    @Value("${app.protocol}")
    private String protocol;

    public AuctionDetailResponse mapToAuctionDetail(AuctionDetail auctionDetail) {

        Auction auction = auctionDetail.getAuction() == null ? null :
                auctionDetail.getAuction();
        User client = auctionDetail.getClient() == null ? null :
                auctionDetail.getClient();
        assert auction != null;
        User userCreatedBy = auction.getUserCreatedBy();
        Building building = auctionDetail.getAuction().getBuilding();
        assert building != null;
        Map map = building.getMap();
        TypeBuilding typeBuilding = building.getTypeBuilding();
        List<String> buildingImageUrl = new ArrayList<>();

        if (building.getImage() != null && !building.getImage().isEmpty()) {
            String[] imagePaths = building.getImage().split(";");
            for (String path : imagePaths) {
                if (!path.trim().isEmpty()) {
                    String fileName = Paths.get(path).getFileName().toString();
                    String url = String.format("%s://%s:%s/api/user/building/%s",
                            protocol, serverHost, serverPort, fileName);
                    buildingImageUrl.add(url);
                }
            }
        }
        BuildingResponse buildingResponse = BuildingResponse.builder()
                .id(building.getId())
                .name(building.getName())
                .structure(building.getStructure())
                .area(building.getAcreage())
                .description(building.getDescription())
                .status(building.getStatus())
                .number_of_basement(building.getNumber_of_basement())
                .image(buildingImageUrl)
                .map(MapResponse.builder()
                .map_name(map.getMap_name())
                .address(map.getAddress())
                .build())
                .build();
        AuctionDetailResponse dto = AuctionDetailResponse.builder()
                .id(auctionDetail.getId())
                .note(auctionDetail.getNote())
                .result(auctionDetail.getResult())
                .bidAmount(auctionDetail.getBidAmount())
                .status(auctionDetail.getStatus())
                .identity_key(auctionDetail.getIdentity_key())
                .auction(AuctionResponse.builder()
                .id(auction.getId()).name(auction.getName())
                .start_date(auction.getStart_date())
                .start_time(auction.getStart_time())
                .end_time(auction.getEnd_time())
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
                .isActive(auction.isActive())
                .identity_key(auction.getIdentity_key())
                .build())
                .client(UserResponse.builder()
                        .id(client.getId())
                        .first_name(client.getFirst_name())
                        .last_name(client.getLast_name())
                        .user_name(client.getUser_name())
                        .email(client.getEmail())
                        .phone_number(client.getPhone_number())
                        .birthday(client.getBirthday())
                        .build())
                .building(buildingResponse)
                .buildingImageUrl(buildingImageUrl)
                .typeBuildingResponse(
                TypeBuildingResponse.builder()
                .type_name(typeBuilding.getType_name())
                .price(typeBuilding.getPrice())
                .build())
                .build();
        if (dto != null) {

            return dto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
