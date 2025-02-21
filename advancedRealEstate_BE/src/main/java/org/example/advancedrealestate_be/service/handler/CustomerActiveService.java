package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.repository.CustomersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerActiveService {
    private final CustomersRepository customersRepository;

    @Autowired
    public CustomerActiveService(CustomersRepository customersRepository) {
        this.customersRepository = customersRepository;
    }

    public Optional<Customers> getCustomerById(String customerId) {
        return customersRepository.findById(customerId);
    }

    public void activateCustomer(Customers customer) {
        customer.setStatus(1);  // Account verified
        customer.setIsActivity(1);  // Account activated
        customersRepository.save(customer);
    }

}
