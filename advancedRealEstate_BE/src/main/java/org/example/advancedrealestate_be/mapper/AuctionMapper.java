package org.example.advancedrealestate_be.mapper;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.example.advancedrealestate_be.dto.BuildingDto;
import org.example.advancedrealestate_be.dto.response.*;
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
        User userCreatedBy = auction.getUserCreatedBy() == null ? null :
                auction.getUserCreatedBy();
        Building building = auction.getBuilding();

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

        BuildingResponse buildingResponse = BuildingResponse.builder()
                .id(building.getId())
                .name(building.getName())
                .area(building.getAcreage())
                .status(building.getStatus())
                .structure(building.getStructure())
                .description(building.getDescription())
                .typeBuilding(TypeBuildingResponse.builder()
                        .price(building.getTypeBuilding().getPrice())
                        .type_name(building.getTypeBuilding().getType_name())
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
                .image(imageUrls)
                .build();

        AuctionResponse auctionResponse = AuctionResponse.builder()
                .id(auction.getId())
                .name(auction.getName())
                .start_date(auction.getStart_date())
                .start_time(auction.getStart_time())
                .end_time(auction.getEnd_time())
                .description(auction.getDescription())
                .isActive(auction.isActive())
                .building(buildingResponse)
                .buildingImages(imageUrls)
                .typeBuilding(TypeBuildingResponse.builder()
                        .price(building.getTypeBuilding().getPrice())
                        .type_name(building.getTypeBuilding().getType_name())
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
