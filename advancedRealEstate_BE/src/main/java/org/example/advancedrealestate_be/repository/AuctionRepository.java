package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepository extends JpaRepository<Auction,String> {
    boolean existsByBuildingId(String buildingId);
}
