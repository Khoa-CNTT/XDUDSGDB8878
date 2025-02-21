package org.example.advancedrealestate_be.service;

public interface QueueService {
  void addToQueue(String customerId);
  void removeExpiredTokens();
}
