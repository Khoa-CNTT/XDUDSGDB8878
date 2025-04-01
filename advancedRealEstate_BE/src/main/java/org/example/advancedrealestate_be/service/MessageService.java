package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.dto.response.MessageResponse;
import org.example.advancedrealestate_be.entity.Message;
import org.example.advancedrealestate_be.model.ChatMessage;

import java.util.List;

public interface MessageService {

    List<MessageResponse> findMessagesBySenderIdAndRoomName(String senderId, String roomName);
    List<MessageResponse> findMessagesBySenderIdAndRecipientId(String senderId, String recipient_email);

    List<MessageResponse> findMessagesBetweenUsers(String senderId, String recipient_email);

    List<MessageResponse> findMessagesByRoomName(String roomName);

    List<MessageResponse> findMessagesBySenderId(String senderId);

    void saveMessage(ChatMessage chatMessage);
}