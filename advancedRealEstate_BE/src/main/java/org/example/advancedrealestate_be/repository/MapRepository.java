package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MapRepository extends JpaRepository<Map,String> {
}
