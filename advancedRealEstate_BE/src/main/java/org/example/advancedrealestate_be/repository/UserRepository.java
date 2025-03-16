package org.example.advancedrealestate_be.repository;
import org.example.advancedrealestate_be.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.example.advancedrealestate_be.entity.Auction;
import org.example.advancedrealestate_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Page<User> findAll(Pageable pageable);
    Optional<User> findByEmail(String email);
    boolean existsByRoleId(String roleId);
    List<User> findUsersByRoleId(String roleId);

    @Query("SELECT u FROM User u JOIN u.role r WHERE r.role_type = :type")
    List<User> findUsersByRoleType(@Param("type") String type);
}
