package org.example.advancedrealestate_be.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auctions")
@Getter
@Setter
public class Auction {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String name;
    private String start_date;
    private String start_time;
    private String end_time;
    @Column(columnDefinition = "text")
    private String description;
    private boolean isActive;
    private String identity_key;

    @CreationTimestamp
    private LocalDateTime createdOn;
    @UpdateTimestamp
    private LocalDateTime updatedOn;

    @ManyToOne
    @JoinColumn(name = "building_id", nullable = true)
    //annotion này giúp gỡ lỗi lặp vô hạn khi mapper
    @JsonBackReference("auction-buildings")
    private Building building;

    @ManyToOne
    @JoinColumn(name = "userCreatedBy", nullable = true)
    @JsonBackReference("auction-users")
    private User userCreatedBy;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.REMOVE)
    @JsonManagedReference("auction-auction-details")
    private List<AuctionDetail> auction_details = new ArrayList<>();

    @OneToMany(mappedBy = "auction", cascade = CascadeType.REMOVE)
    @JsonManagedReference("auction-auction-histories")
    private List<AuctionHistory> auction_histories = new ArrayList<>();
}
