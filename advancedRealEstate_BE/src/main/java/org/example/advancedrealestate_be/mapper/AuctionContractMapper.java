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
public class AuctionContractMapper {

    @Value("${server.port}")
    private String serverPort;
    @Value("${server.host}")
    private String serverHost;
    @Value("${app.protocol}")
    private String protocol;

    public AuctionContractResponse mapToAuctionContract(AuctionContract auctionContract) {

        AuctionDetail auctionDetail = auctionContract.getAuctionDetail();
        User client = auctionContract.getClient();
        User staffConfirm = auctionContract.getStaffConfirm();
        Auction auction = auctionDetail.getAuction();
        Building building = auction.getBuilding();
        TypeBuilding typeBuilding = building.getTypeBuilding();
        Map map = building.getMap();
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

        String contractImagePath = auctionContract.getContractImage() != null ? String.format("http://%s:%s/api/user/auction-contract/%s",
                serverHost, serverPort, Paths.get(auctionContract
                .getContractImage()).getFileName().toString()) : null;

        AuctionContractResponse dto = AuctionContractResponse.builder()
                .id(auctionContract.getId())
                .code(auctionContract.getCode())
                .full_name(auctionContract.getFull_name())
                .phone_number(auctionContract.getPhone_number())
                .birthday(auctionContract.getBirthday())
                .address(auctionContract.getAddress())
                .note(auctionContract.getNote())
                .paymentCode(auctionContract.getPaymentCode())
                .description(auctionContract.getDescription())
                .confirmPaymentDate(auctionContract.getConfirmPaymentDate())
                .outstandingBalance(auctionContract.getOutstandingBalance())
                .depositAmount(auctionContract.getDepositAmount())
                .settingDate(auctionContract.getSettingDate())
                .paymentStatus(auctionContract.getPaymentStatus())
                .numberPayment(auctionContract.getNumberPayment())
                .contractStatus(auctionContract.getContractStatus())
                .cccd_front(String.format("http://%s:%s/api/user/auction-contract/%s",
                serverHost, serverPort, Paths.get(auctionContract
                .getCccd_front()).getFileName().toString()))
                .cccd_back(String.format("http://%s:%s/api/user/auction-contract/%s",
                serverHost, serverPort, Paths.get(auctionContract
                .getCccd_back()).getFileName().toString()))
                .avatar(String.format("http://%s:%s/api/user/auction-contract/%s",
                serverHost, serverPort, Paths.get(auctionContract
                .getAvatar()).getFileName().toString()))
                .contractImage(contractImagePath)
                .staffConfirm(UserResponse.builder()
                .first_name(Optional.ofNullable(staffConfirm).map(User::getFirst_name).orElse(null))
                .last_name(Optional.ofNullable(staffConfirm).map(User::getLast_name).orElse(null))
                .user_name(Optional.ofNullable(staffConfirm).map(User::getUser_name).orElse(null))
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
                .auctionDetail(AuctionDetailResponse.builder()
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
                .userCreatedBy(client)
                .isActive(auction.isActive())
                .identity_key(auction.getIdentity_key())
                .build())
                .building(BuildingResponse.builder()
                .id(building.getId())
                .structure(building.getStructure())
                .name(building.getName())
                .area(building.getAcreage())
                .number_of_basement(building.getNumber_of_basement())
                .image(buildingImageUrl)
                .typeBuilding(TypeBuildingResponse.builder()
                .id(typeBuilding.getId())
                .price(typeBuilding.getPrice())
                .type_name(typeBuilding.getType_name())
                .build())
                .map(MapResponse.builder()
                .id(map.getId()).address(map.getAddress())
                .build())
                .build())
                .buildingImageUrl(buildingImageUrl)
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