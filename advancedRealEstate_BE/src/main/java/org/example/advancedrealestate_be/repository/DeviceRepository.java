package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Devices;

import org.example.advancedrealestate_be.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Devices,String> {
    Page<Devices> findAll(Pageable pageable);
    boolean existsByBuildingId(String buildingId);
}
