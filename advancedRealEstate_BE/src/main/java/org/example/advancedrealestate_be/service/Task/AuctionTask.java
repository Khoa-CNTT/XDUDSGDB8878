package org.example.advancedrealestate_be.service.Task;


import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.AuctionHistory;
import org.example.advancedrealestate_be.mapper.AuctionMapper;
import org.example.advancedrealestate_be.repository.AuctionDetailRepository;
import org.example.advancedrealestate_be.repository.AuctionHistoryRepository;
import org.example.advancedrealestate_be.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import org.slf4j.LoggerFactory;

@EnableScheduling
@Component
public class AuctionTask {

    private final AuctionHistoryRepository auctionHistoryRepository;
    private final AuctionDetailRepository auctionDetailRepository;
    private final AuctionRepository auctionRepository;
    @Autowired
    public AuctionTask(AuctionDetailRepository auctionDetailRepository, AuctionHistoryRepository auctionHistoryRepository, AuctionRepository auctionRepository) {
        this.auctionHistoryRepository = auctionHistoryRepository;
        this.auctionDetailRepository = auctionDetailRepository;
        this.auctionRepository = auctionRepository;
    }

//    @Scheduled(fixedRate = 3000)
//    @Transactional
//    protected void handleClientWinAuction(){
//
//        ZonedDateTime currentTimeInVN = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//        String currentDateTime = currentTimeInVN.format(formatter);
////        List<Auction> auctionList = auctionRepository.findAll();
//
//        if (!auctionHistoryRepository.existsByBidAmountAndIdentityHistoryKey()) {
//            System.out.println(auctionHistoryRepository.existsByBidAmountAndIdentityHistoryKey());
//            return;
//        }
//        List<AuctionHistory> allHistories = auctionHistoryRepository.findAll();
//        Set<String> uniqueHistoryKeys = new HashSet<>();
//        List<AuctionHistory> duplicateHistories = new ArrayList<>();
//        for (AuctionHistory history : allHistories) {
//            String key = history.getBidAmount() + "-" + history.getIdentity_key();
//            if (!uniqueHistoryKeys.add(key)) {
//                duplicateHistories.add(history);
//            }
//        }
//        auctionHistoryRepository.deleteAll(duplicateHistories);
//    }

}
