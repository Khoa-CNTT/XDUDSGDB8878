package org.example.advancedrealestate_be.dto;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoomChatDto {

    private String id;
    private String name;
    private String description;
    private byte[] image;
    String file_type;
}
