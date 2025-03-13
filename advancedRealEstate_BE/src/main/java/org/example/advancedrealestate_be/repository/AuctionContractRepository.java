package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.AuctionContract;
import org.example.advancedrealestate_be.entity.AuctionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionContractRepository extends JpaRepository<AuctionContract,String> {
    boolean existsAuctionContractByAuctionDetailId(String auctionDetailId);
    List<AuctionContract> findAuctionContractsByClientId(String clientId);
}
