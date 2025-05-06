package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Contracts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Repository
public interface ContractReposetory extends JpaRepository<Contracts,String> {
    @Query("SELECT c FROM Contracts c WHERE c.contract_code = :code")
    Optional<Contracts> findByContractCode(@Param("code") String contractCode);
    @Query("SELECT c FROM Contracts c WHERE c.user.id = :userId ANd c.status = 2")
    Page<Contracts> findByUserId(@Param("userId") String userId, Pageable pageable);
}
