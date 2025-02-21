package org.example.advancedrealestate_be.dto.response;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuctionDetailResponse {

    private String id;
    private String note;
    private String result;
    private double bidAmount;
    private String status;
    private Auction auction;
    private User client;
}
