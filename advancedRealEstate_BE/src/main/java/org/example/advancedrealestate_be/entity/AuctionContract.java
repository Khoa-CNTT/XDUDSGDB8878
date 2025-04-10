package org.example.advancedrealestate_be.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auction_contracts")
@Getter
@Setter
public class AuctionContract {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String code;
    private String full_name;
    private String phone_number;
    private String birthday;
    private String address;
    private String contractStatus;
    private Date settingDate;
    private int paymentStatus;
    private String confirmPaymentDate;
    private String paymentCode;
    private double depositAmount;
    private double outstandingBalance;
    private int numberPayment;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String note;

    @Column(columnDefinition = "text")
    private String cccd_front;

    @Column(columnDefinition = "text")
    private String cccd_back;

    @Column(columnDefinition = "text")
    private String avatar;

    @Column(columnDefinition = "text")
    private String contractImage;

    @ManyToOne
    @JoinColumn(name = "auction_detail_id", nullable = true)
    //annotion này giúp gỡ lỗi lặp vô hạn khi mapper
    @JsonBackReference("auction_contract-auction_details")
    private AuctionDetail auctionDetail;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true)
    @JsonBackReference("auction_contract-users")
    private User client;

    @ManyToOne
    @JoinColumn(name = "staff_confirm_id", nullable = true)
    @JsonBackReference("auction_contract-users")
    private User staffConfirm;
}