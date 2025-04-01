package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.TypeBuilding;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeBuildingRepository extends JpaRepository<TypeBuilding, String> {

    Page<TypeBuilding> findAll(Pageable pageable);

}
