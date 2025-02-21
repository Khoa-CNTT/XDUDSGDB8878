package org.example.advancedrealestate_be.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contracts")
@Getter
@Setter
public class Contracts {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String contract_name;
    private String contract_details;

    // Foreign key linking to Customers
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customers customer;

    // Foreign key linking to Building
    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "contracts", cascade = CascadeType.ALL)
    private List<Transactions> transactions = new ArrayList<>();
}

