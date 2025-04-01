package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.response.*;
import org.example.advancedrealestate_be.entity.*;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class MessageMapper {

    public MessageResponse mapToMessage(Message message) {

        User sender = message.getSender();

        MessageResponse dto = MessageResponse.builder()
                .id(message.getId())
                .index(message.getMessageIndex())
                .sender(UserResponse.builder()
                .id(sender.getId())
                .email(sender.getEmail())
                .roles(sender.getRole().getRole_name())
                .build())
                .content(message.getContent())
                .type(message.getType())
                .roomName(message.getRoomName())
                .bot_ai(message.getBot_ai())
                .createdOn(message.getCreatedOn())
                .updatedOn(message.getUpdatedOn())
                .build();
        if (dto != null) {

            return dto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
