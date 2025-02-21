package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Contracts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractReposetory extends JpaRepository<Contracts,String> {

}
