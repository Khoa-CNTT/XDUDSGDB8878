package org.example.advancedrealestate_be.repository;

import com.fasterxml.jackson.core.TreeNode;
import org.example.advancedrealestate_be.entity.CustomerQueue;
import org.example.advancedrealestate_be.entity.Customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerQueueRepository extends JpaRepository<CustomerQueue, String> {

    Optional<CustomerQueue> findByToken(String token);

    void deleteByToken(String token);

    // Xóa các token đã hết hạn
    void deleteByExpirationTimeBefore(LocalDateTime expirationTime);


}
