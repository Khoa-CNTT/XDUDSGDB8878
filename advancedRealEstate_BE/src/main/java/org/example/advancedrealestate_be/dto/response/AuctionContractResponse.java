package org.example.advancedrealestate_be.dto.response;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionContractResponse {
    private String id;
    private String full_name;
    private String phone_number;
    private String birthday;
    private String address;
    private String note;
    private String contractStatus;
    private String cccd_front;
    private String cccd_back;
    private String avatar;
    private String contractImage;
    private UserResponse client;
    private AuctionDetailResponse auctionDetail;
}
