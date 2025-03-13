package org.example.advancedrealestate_be.config;

import org.example.advancedrealestate_be.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class QueueProcessor {
    @Autowired
    private QueueService queueService;

    public QueueProcessor(QueueService queueService) {
        this.queueService = queueService;
    }


    @Scheduled(fixedRate = 60000)
    public void processQueue() {
        queueService.removeExpiredTokens();
        System.out.println("Checked and removed expired tokens from queue.");
    }
}
