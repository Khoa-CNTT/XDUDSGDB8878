package org.example.advancedrealestate_be.service.handler;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.constant.EnumConstant;
import org.example.advancedrealestate_be.dto.request.AuctionContractRequest;
import org.example.advancedrealestate_be.dto.request.AuctionPaymentRequest;
import org.example.advancedrealestate_be.dto.response.*;
import org.example.advancedrealestate_be.entity.*;
import org.example.advancedrealestate_be.entity.Map;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.AuctionContractMapper;
import org.example.advancedrealestate_be.mapper.UserMapperImpl;
import org.example.advancedrealestate_be.repository.AuctionContractRepository;
import org.example.advancedrealestate_be.repository.AuctionDetailRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.AuctionContractService;
import org.example.advancedrealestate_be.service.AuctionDetailService;
import org.example.advancedrealestate_be.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuctionContractHandler implements AuctionContractService {
    private final AuctionDetailRepository auctionDetailRepository;
    private final AuctionContractRepository auctionContractRepository;
    private final UserRepository userRepository;
    private final UserMapperImpl userMapper;
    private final AuctionContractMapper auctionContractMapper;
    @Value("${server.port}")
    private String serverPort;
    @Value("${server.host}")
    private String serverHost;
    @Value("${app.protocol}")
    private String protocol;
    private final EmailService sendEmailService;


    @Autowired
    public AuctionContractHandler(AuctionDetailRepository auctionDetailRepository, AuctionContractRepository auctionContractRepository, UserRepository userRepository, UserMapperImpl userMapper, AuctionContractMapper auctionContractMapper, EmailService sendEmailService) {
        this.auctionDetailRepository = auctionDetailRepository;
        this.auctionContractRepository = auctionContractRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.auctionContractMapper = auctionContractMapper;
        this.sendEmailService = sendEmailService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','USER')")
    @Override
    public JSONObject create(AuctionContractRequest dto) {
        JSONObject data = new JSONObject();
        MultipartFile cccdFrontImage = dto.getCccd_front();
        MultipartFile cccdBackImage = dto.getCccd_back();
        MultipartFile avatarImage = dto.getAvatar();
        AuctionContract auctionContract = new AuctionContract();
        AuctionDetail auctionDetail = auctionDetailRepository.findById(dto.getAuctionDetailId())
        .orElseThrow(() -> new AppException(ErrorCode.AUCTION_DETAIL_NOT_FOUND));
        User user = userRepository.findById(dto.getClientId())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        boolean isExistsAuctionContract = auctionContractRepository
        .existsAuctionContractByAuctionDetailId(auctionDetail.getId());
        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.HOUR, 24);

        Date dateAddTo24H = calendar.getTime();

        if(isExistsAuctionContract){
            throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
        }
        if (cccdFrontImage != null && !cccdFrontImage.isEmpty()
            || cccdBackImage != null && !cccdBackImage.isEmpty()
            || avatarImage != null && !avatarImage.isEmpty()
        ){
            String uploadDir = "uploads/auction-contract/images/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            assert cccdFrontImage != null;
            String originalFilenameCccdFrontImage = cccdFrontImage.getOriginalFilename();
            assert originalFilenameCccdFrontImage != null;
            String fileExtensionCF = originalFilenameCccdFrontImage.substring(originalFilenameCccdFrontImage.lastIndexOf("."));
            String fileNameCF = UUID.randomUUID() + fileExtensionCF;
            Path filePathCF = Paths.get(uploadDir, fileNameCF);

            assert cccdBackImage != null;
            String originalFilenameCccdBackImage = cccdBackImage.getOriginalFilename();
            assert originalFilenameCccdBackImage != null;
            String fileExtensionBK = originalFilenameCccdBackImage.substring(originalFilenameCccdBackImage.lastIndexOf("."));
            String fileNameBK = UUID.randomUUID() + fileExtensionBK;
            Path filePathBK = Paths.get(uploadDir, fileNameBK);

            assert avatarImage != null;
            String originalFilenameAvatarImage = avatarImage.getOriginalFilename();
            assert originalFilenameAvatarImage != null;
            String fileExtensionAV = originalFilenameAvatarImage.substring(originalFilenameAvatarImage.lastIndexOf("."));
            String fileNameAV = UUID.randomUUID() + fileExtensionAV;
            Path filePathAV = Paths.get(uploadDir, fileNameAV);
            try {
                Files.copy(cccdFrontImage.getInputStream(), filePathCF, StandardCopyOption.REPLACE_EXISTING);
                Files.copy(cccdBackImage.getInputStream(), filePathBK, StandardCopyOption.REPLACE_EXISTING);
                Files.copy(avatarImage.getInputStream(), filePathAV, StandardCopyOption.REPLACE_EXISTING);
                auctionContract.setCode(generateCode());
                auctionContract.setAuctionDetail(auctionDetail);
                auctionContract.setClient(user);
                auctionContract.setFull_name(dto.getFull_name());
                auctionContract.setPhone_number(dto.getPhone_number());
                auctionContract.setBirthday(dto.getBirthday());
                auctionContract.setAddress(dto.getAddress());
                auctionContract.setNote(dto.getNote());
                auctionContract.setCccd_front(filePathCF.toString());
                auctionContract.setCccd_back(filePathBK.toString());
                auctionContract.setAvatar(filePathAV.toString());
                auctionContract.setSettingDate(now);
                auctionContract.setPaymentStatus(0);
                auctionContract.setContractStatus(EnumConstant.PENDING.toString());
                auctionContractRepository.save(auctionContract);
                sendEmailService.sendEmailHasTemplate(
                        "lol00sever@gmail.com",
                        "Contract Review Reminder",
                        dateAddTo24H,
                "email-template-send-for-staff"
                );
                data.put("message", "Create successfully!");
                return data;
            } catch (IOException e) {
                throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
            }
        }
        throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public List<AuctionContractResponse> findAll() {
        List<AuctionContract> auctionContractList = auctionContractRepository.findAll();
        return auctionContractList.stream()
            .map(auctionContractMapper::mapToAuctionContract)
            .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','USER')")
    @Override
    public List<AuctionContractResponse> userAuctionContracts(String clientId) {
        List<AuctionContract> auctionContractList = auctionContractRepository.findAuctionContractsByClientId(clientId);
        return auctionContractList.stream()
            .map(auctionContractMapper::mapToAuctionContract)
            .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','USER')")
    @Override
    public JSONObject findById(String id) {
        JSONObject responseObject = new JSONObject();
        AuctionContract auctionContract = auctionContractRepository.findById(id).orElseThrow();
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
                .settingDate(auctionContract.getSettingDate())
                .contractStatus(auctionContract.getContractStatus())
                .depositAmount(auctionContract.getDepositAmount())
                .outstandingBalance(auctionContract.getOutstandingBalance())
                .confirmPaymentDate(auctionContract.getConfirmPaymentDate())
                .paymentCode(auctionContract.getPaymentCode())
                .numberPayment(auctionContract.getNumberPayment())
                .description(auctionContract.getDescription())
                .cccd_front(String.format("%s://%s:%s/api/user/auction-contract/%s",
                protocol, serverHost, serverPort, Paths.get(auctionContract
                .getCccd_front()).getFileName().toString()))
                .cccd_back(String.format("%s://%s:%s/api/user/auction-contract/%s",
                protocol, serverHost, serverPort, Paths.get(auctionContract
                .getCccd_back()).getFileName().toString()))
                .avatar(String.format("%s://%s:%s/api/user/auction-contract/%s",
                protocol, serverHost, serverPort, Paths.get(auctionContract
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
        responseObject.put("data", dto);
        return responseObject;
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public JSONObject updateById(String id, AuctionContractRequest dto) {
        JSONObject responseObject = new JSONObject();
        AuctionContract auctionContract = auctionContractRepository.findById(id)
        .orElseThrow(()->new AppException(ErrorCode.AUCTION_CONTRACT_NOT_FOUND));
        AuctionDetail auctionDetail = auctionDetailRepository.findById(dto.getAuctionDetailId())
        .orElseThrow(()->new AppException(ErrorCode.AUCTION_DETAIL_NOT_FOUND));
        User client = userRepository.findById(dto.getClientId())
        .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        Auction auction = auctionDetail.getAuction();
        Building building = auction.getBuilding();
        TypeBuilding typeBuilding = building.getTypeBuilding();
        Map map = building.getMap();
        auctionContract.setAuctionDetail(auctionDetail);
        auctionContract.setClient(client);
        auctionContract.setFull_name(dto.getFull_name());
        auctionContract.setPhone_number(dto.getPhone_number());
        auctionContract.setBirthday(dto.getBirthday());
        auctionContract.setAddress(dto.getAddress());
        auctionContract.setNote(dto.getNote());
        auctionContractRepository.save(auctionContract);
        responseObject.put("message", "Update successfully!");
        return responseObject;
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public JSONObject confirm_payment(String id, AuctionPaymentRequest dto) {
        JSONObject responseObject = new JSONObject();
        ZonedDateTime currentTimeInVN = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currentDateTime = currentTimeInVN.format(formatter);
        AuctionContract auctionContract = auctionContractRepository.findById(id)
        .orElseThrow(()->new AppException(ErrorCode.AUCTION_CONTRACT_NOT_FOUND));
        if(auctionContract.getNumberPayment() >= 3){
            throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
        }
        double bidAmount =  auctionContract.getAuctionDetail().getBidAmount();
        double outstandingBalance =  auctionContract.getOutstandingBalance();
        if(outstandingBalance < 1){
            throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
        }
        auctionContract.setOutstandingBalance(
        auctionContract.getDepositAmount() < 0 ? bidAmount - dto.getDepositAmount() :
        outstandingBalance - dto.getDepositAmount());
        auctionContract.setNumberPayment(auctionContract.getNumberPayment() + 1);
        auctionContract.setDepositAmount(dto.getDepositAmount());
        auctionContract.setConfirmPaymentDate(currentDateTime);
        auctionContract.setDescription(dto.getDescription());
        auctionContract.setPaymentCode(generateCode());
        auctionContract.setPaymentStatus(1);
        auctionContractRepository.save(auctionContract);
        responseObject.put("message", "Confirm successfully!");
        return responseObject;
    }

    public static String generateCode() {
        String prefix = "ADV";
        int length = 15 - prefix.length();
        Random random = new Random();
        StringBuilder sb = new StringBuilder(prefix);

        for (int i = 0; i < length; i++) {
            int digit = random.nextInt(10);
            sb.append(digit);
        }
        return sb.toString();
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @Override
    public JSONObject confirmContract(String id, MultipartFile contractImageFile) {
        JSONObject responseObject = new JSONObject();
        AuctionContract auctionContract = auctionContractRepository.findById(id)
        .orElseThrow(()->new AppException(ErrorCode.AUCTION_CONTRACT_NOT_FOUND));
        AuctionDetail auctionDetail = auctionDetailRepository.findById(auctionContract.getAuctionDetail().getId())
        .orElseThrow(()->new AppException(ErrorCode.AUCTION_DETAIL_NOT_FOUND));
        String confirmStatus = String.valueOf(EnumConstant.CONFIRMED);
        boolean isConfirmedContract = Objects.equals(auctionContract.getContractStatus(), confirmStatus);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User staffConfirm = userRepository.findByEmail(authentication.getName())
        .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));

        if(isConfirmedContract){
            throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
        }
        if (contractImageFile != null && !contractImageFile.isEmpty()) {
            String uploadDir = "uploads/auction-contract/images/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            String originalFilenameContractImage = contractImageFile.getOriginalFilename();
            assert originalFilenameContractImage != null;
            String fileExtensionContractImage = originalFilenameContractImage.substring(originalFilenameContractImage.lastIndexOf("."));
            String fileNameContractImage = UUID.randomUUID() + fileExtensionContractImage;
            Path filePathContractImage = Paths.get(uploadDir, fileNameContractImage);
            try {
                Files.copy(contractImageFile.getInputStream(), filePathContractImage, StandardCopyOption.REPLACE_EXISTING);
                auctionContract.setContractImage(filePathContractImage.toString());
            } catch (IOException e) {
                throw new AppException(ErrorCode.AUCTION_CONTRACT_BAD_REQUEST);
            }
        }
        auctionContract.setStaffConfirm(staffConfirm);
        auctionContract.setContractStatus(confirmStatus);
        auctionDetail.setStatus(String.valueOf(EnumConstant.CONFIRMED));
        auctionDetailRepository.save(auctionDetail);
        auctionContractRepository.save(auctionContract);
        sendEmailService.sendEmailHasTemplate(
                auctionContract.getClient().getEmail(),
                "Contract Approval Notification",
                "email-template-send-for-client",
                auctionContract.getFull_name(),
                "AUC-2025-"+auctionContract.getId(),
                auctionContract.getSettingDate(),
                new Date(),
                staffConfirm.getUser_name()
        );
        responseObject.put("message", "Confirm successfully!");
        return responseObject;
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public JSONObject deleteById(String id) {
        JSONObject responseObject = new JSONObject();
        AuctionContract auctionContract = auctionContractRepository.findById(id).orElseThrow();
        auctionContractRepository.delete(auctionContract);
        responseObject.put("message", "Delete successfully!");
        return responseObject;
    }
}