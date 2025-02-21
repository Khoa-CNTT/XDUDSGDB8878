
package org.example.advancedrealestate_be.repository;
import jakarta.transaction.Transactional;
import org.example.advancedrealestate_be.entity.Permission;
import org.example.advancedrealestate_be.entity.Role;
import org.example.advancedrealestate_be.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface   RolePermissionRepository extends JpaRepository<RolePermission,Long> {
    boolean existsByRoleAndPermission(Role role, Permission permission);
    List<RolePermission> findByRoleIdAndPermissionIdIn(String roleId, List<Long> permissionIds);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM role_permissions WHERE role_id = :roleId", nativeQuery = true)
    void deleteByRoleId(@Param("roleId") String roleId);
}