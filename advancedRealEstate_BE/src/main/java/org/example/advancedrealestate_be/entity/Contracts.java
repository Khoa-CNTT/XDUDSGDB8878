package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.Date;
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
    private String contract_code;
    private String full_name;
    private Date birth_date;
    private String email;
    private String phone;
    private String address;
    private Date start_date;
    private Date end_date;
    private String cccdid;
    private String place_of_issue;
    private String image_signature;
    private Double price;
    private Double total_amount;
    private Integer status;
    private String file_contract;
    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

