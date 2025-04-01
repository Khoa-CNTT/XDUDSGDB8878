package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.entity.Customers;

public interface CustomerQueueService {
  void addToQueue(Customers customer);
     boolean verifyToken(String token);
    void processQueue();

    Customers getCustomerByToken(String token);

    void removeFromQueue(Customers customer);
}
