package org.example.advancedrealestate_be.dto.request;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionContractRequest {
    private String full_name;
    private String phone_number;
    private String birthday;
    private String address;
    private String note;
    private MultipartFile cccd_front;
    private MultipartFile cccd_back;
    private MultipartFile avatar;
    private String clientId;
    private String auctionDetailId;
}