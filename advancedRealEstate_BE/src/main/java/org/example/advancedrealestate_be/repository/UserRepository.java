package org.example.advancedrealestate_be.repository;


import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Page<User> findAll(Pageable pageable);
    Optional<User> findByEmail(String email);
    boolean existsByRoleId(String roleId);
}
