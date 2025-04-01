package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.AuctionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionDetailRepository extends JpaRepository<AuctionDetail,String> {

    List<AuctionDetail> findAuctionDetailsByClientId(String clientId);
}
