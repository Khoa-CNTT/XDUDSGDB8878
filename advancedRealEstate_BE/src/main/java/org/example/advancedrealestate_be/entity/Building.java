package org.example.advancedrealestate_be.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "buildings")
@Getter
@Setter
public class Building {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    @Column(columnDefinition = "text")
    private String description;
    @Column(columnDefinition = "text")
    private String image;
    private String name;
    private String structure;
    private int status;
    private int number_of_basement;
    private String acreage;

    @CreationTimestamp
    private LocalDateTime createdOn;
    @UpdateTimestamp
    private LocalDateTime updatedOn;

    @ManyToOne
    @JoinColumn(name = "map_id", nullable = true)
    //annotion này giúp gỡ lỗi lặp vô hạn khi mapper
    @JsonBackReference("building-maps")
    private Map map;

    @ManyToOne
    @JoinColumn(name = "type_building_id", nullable = true)
    @JsonBackReference("building-type")
    private TypeBuilding typeBuilding;

    @OneToMany(mappedBy = "building", cascade = CascadeType.REMOVE)
    @JsonManagedReference("building-auctions")
    private List<Auction> auctions = new ArrayList<>();
    
    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL)
    @JsonManagedReference("device-buidings")
    private List<Devices> devices;

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL)
    private List<Contracts> contracts;
}
