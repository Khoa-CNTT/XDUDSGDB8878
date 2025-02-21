package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.request.CustomerRequest;
import org.example.advancedrealestate_be.entity.Customers;

public interface CustomerService {
     void resetPassword(String token, String newPassword);
     void requestPasswordReset(String email);
     String registerCustomer(CustomerRequest customer);
     boolean verifyCustomer(String token);
     String login(String email, String password);
}
