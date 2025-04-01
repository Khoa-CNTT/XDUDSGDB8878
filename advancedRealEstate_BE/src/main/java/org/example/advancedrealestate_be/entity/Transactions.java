package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.DateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
@Getter
@Setter
public class Transactions {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    private String type_transaction;
    private DateTime transaction_date;
    private double amount;
    private String description;
    @ManyToOne
    @JoinColumn(name="contract_id")
    private Contracts contracts;

}
