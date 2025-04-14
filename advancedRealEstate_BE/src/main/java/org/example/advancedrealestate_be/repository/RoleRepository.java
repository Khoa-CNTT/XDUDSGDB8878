package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Building;
import org.example.advancedrealestate_be.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role,String> {
    Page<Role> findAll(Pageable pageable);
    List<Role> findAll();

    @Modifying
    @Query("SELECT r FROM Role r WHERE r.role_type = :role_type")
    List<Role> findRolesByRole_type(@Param("role_type") String role_type);
    @Query("SELECT r FROM Role r WHERE r.role_name = :roleName")
    Role findRoleByRoleName(@Param("roleName") String roleName);
    @Query(value = "SELECT COUNT(*) FROM roles WHERE role_type = :roleType AND role_type = 'MANAGEMENT'", nativeQuery = true)
    Long countManagementRole(@Param("roleType") String roleType);
}
