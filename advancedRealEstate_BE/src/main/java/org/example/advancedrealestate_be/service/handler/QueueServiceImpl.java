package org.example.advancedrealestate_be.service.handler;

import jakarta.transaction.Transactional;
import org.example.advancedrealestate_be.entity.CustomerQueue;
import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.repository.CustomerQueueRepository;
import org.example.advancedrealestate_be.repository.CustomersRepository;
import org.example.advancedrealestate_be.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class QueueServiceImpl implements QueueService {

    private final CustomerQueueRepository customerQueueRepository;

    @Autowired
    public QueueServiceImpl(CustomerQueueRepository customerQueueRepository) {
        this.customerQueueRepository = customerQueueRepository;
    }

    // Thêm token vào hàng đợi
    @Transactional
    public void addToQueue(String customerId) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15); // Token hết hạn sau 15 phút

        CustomerQueue queue = CustomerQueue.builder()
                .customerId(customerId)
                .token(token)
                .expirationTime(expirationTime)
                .build();

        customerQueueRepository.save(queue);
    }

    // Xóa các token hết hạn
    @Transactional
    public void removeExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        // Xóa các token có expirationTime trước thời gian hiện tại
        customerQueueRepository.deleteByExpirationTimeBefore(now);
    }
}
