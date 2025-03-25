package org.example.advancedrealestate_be.repository;

import jakarta.transaction.Transactional;
import org.example.advancedrealestate_be.entity.AuctionDetail;
import org.example.advancedrealestate_be.entity.AuctionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuctionHistoryRepository extends JpaRepository<AuctionHistory,String> {
    @Query("SELECT CASE WHEN " +
           "COUNT(ah) > 0 THEN true ELSE false END " +
           "FROM AuctionHistory ah " +
           "WHERE ah.bidAmount IS NOT NULL " +
           "AND ah.identity_key IS NOT NULL")
    boolean existsByBidAmountAndIdentityHistoryKey();
    @Modifying
    @Transactional
    @Query("DELETE FROM AuctionHistory as ah WHERE ah.identity_key = :identity_key")
    void deleteAuctionHistoriesByIdentity_key(@Param("identity_key") String identity_key);
    @Modifying
    @Transactional
    @Query("UPDATE AuctionHistory as ah SET ah.status = 'CONFIRMED'  WHERE ah.identity_key = :identity_key")
    void handleAcceptanceAuctionHistories(@Param("identity_key") String identity_key);
    @Query("SELECT COUNT(ah) FROM AuctionHistory as ah WHERE ah.identity_key = :identity_key AND ah.status = 'CONFIRMED'")
    int checkAuctionHistoriesIfConfirmed(@Param("identity_key") String identity_key);
    @Query(value = "SELECT * FROM auction_histories WHERE identity_key = :identity_key ORDER BY bid_amount DESC LIMIT 1", nativeQuery = true)
    AuctionHistory findHighestBidByIdentityKey(@Param("identity_key") String identityKey);
    List<AuctionHistory> findAuctionHistoriesByClientIdAndStatus(String clientId, String status);
    List<AuctionHistory> findAuctionHistoriesByClientId(String clientId);

    @Query("SELECT a FROM AuctionHistory a WHERE a.identity_key = :identityKey")
    List<AuctionHistory> findAuctionHistoriesByIdentityKey(@Param("identityKey") String identityKey);

    @Query("SELECT a FROM AuctionHistory a JOIN a.client c WHERE a.identity_key = :identityKey AND c.email = :email")
    List<AuctionHistory> findAuctionHistoriesByIdentityKeyAndEmail(@Param("identityKey") String identityKey, @Param("email") String email);

    @Query(value = "SELECT COUNT(*) FROM auction_histories " +
            "WHERE identity_key = :identityKey " +
            "AND bid_amount >= :bidAmount",
            nativeQuery = true)
    int countHigherOrEqualBids(@Param("identityKey") String identityKey, @Param("bidAmount") double bidAmount);
}
