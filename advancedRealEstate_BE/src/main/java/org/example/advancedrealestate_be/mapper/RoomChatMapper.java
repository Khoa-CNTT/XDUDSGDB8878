package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.RoomChatDto;
import org.example.advancedrealestate_be.dto.ServiceDto;
import org.example.advancedrealestate_be.entity.RoomChat;
import org.example.advancedrealestate_be.entity.Service;

import java.util.Optional;

public class RoomChatMapper {


    public static RoomChatDto mapToRoomChatDto(RoomChat roomChat) {

        RoomChatDto roomChatDto = RoomChatDto.builder()
                .id(roomChat.getId())
                .name(roomChat.getName())
                .description(roomChat.getDescription())
                .image(roomChat.getImage())
                .file_type(roomChat.getFile_type())
                .build();

        if (roomChatDto != null) {

            return roomChatDto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }

}
