package org.example.advancedrealestate_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "room_chats")
@Getter
@Setter
public class RoomChat {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    private String name;
    @Column(columnDefinition = "text")
    private String description;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;
    String file_type;
}
