package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Page<Category> findAll(Pageable pageable);
}
