package org.example.advancedrealestate_be.dto.response;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionContractResponse {
    private String id;
    private String code;
    private String full_name;
    private String phone_number;
    private String birthday;
    private String address;
    private String note;
    private Date settingDate;
    private String contractStatus;
    private String cccd_front;
    private String cccd_back;
    private String avatar;
    private String contractImage;
    private int paymentStatus;
    private int numberPayment;
    private String confirmPaymentDate;
    private String paymentCode;
    private double depositAmount;
    private double outstandingBalance;
    private String description;
    private UserResponse client;
    private UserResponse staffConfirm;
    private AuctionDetailResponse auctionDetail;
}