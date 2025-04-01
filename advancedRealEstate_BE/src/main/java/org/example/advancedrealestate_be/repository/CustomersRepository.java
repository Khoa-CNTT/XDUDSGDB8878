package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Customers;
import org.example.advancedrealestate_be.entity.TypeBuilding;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomersRepository extends JpaRepository<Customers, String> {
//    @Query("SELECT c FROM Customers c WHERE c.user_name = :user_name OR c.email = :email")
//    //Optional<Customers> findByUser_nameOrEmail(@Param("user_name") String user_name, @Param("email") String email);
//    Customers findByVerifyToken(String token);
//    Page<Customers> findAll(Pageable pageable);
Optional<Customers> findByEmail(String email);
    Optional<Customers> findById(String id);


//    @Query("SELECT c FROM Customers c WHERE c.userName = :userName AND c.email = :email")
//    Optional<Customers> findByUserNameOrEmail(@Param("userName") String userName, @Param("email") String email);
//
//    @Query("SELECT c FROM Customers c WHERE c.verifyToken = :token")
//    Optional<Customers> findByVerifyToken(@Param("token") String token);

    boolean existsByEmail(String email);
}
