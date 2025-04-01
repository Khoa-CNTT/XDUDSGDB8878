package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.dto.response.MessageResponse;
import org.example.advancedrealestate_be.entity.Message;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.MessageMapper;
import org.example.advancedrealestate_be.model.ChatMessage;
import org.example.advancedrealestate_be.repository.MessageRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.example.advancedrealestate_be.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageHandler implements MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final UserRepository userRepository;


    @Autowired
    public MessageHandler(MessageRepository messageRepository, MessageMapper messageMapper, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
        this.userRepository = userRepository;
    }

    @Override
    public List<MessageResponse> findMessagesBySenderIdAndRoomName(String senderId, String roomName) {
        List<Message> auctionContractList = messageRepository.findMessagesBySenderIdAndRoomName(senderId, roomName);
        return auctionContractList.stream()
        .map(messageMapper::mapToMessage)
        .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> findMessagesBySenderIdAndRecipientId(String senderId, String recipient_email) {
        User recipient = userRepository.findByEmail(recipient_email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<Message> auctionContractList = messageRepository.findMessagesBySenderIdAndRecipientId(senderId, recipient.getId());
        return auctionContractList.stream()
        .map(messageMapper::mapToMessage)
        .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','USER')")
    @Override
    public List<MessageResponse> findMessagesBetweenUsers(String senderId, String recipient_email) {
        User recipient = userRepository.findByEmail(recipient_email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<Message> auctionContractList = messageRepository.findMessagesBetweenUsers(senderId, recipient.getId());
        return auctionContractList.stream()
                .map(messageMapper::mapToMessage)
                .collect(Collectors.toList());
    }


    @Override
    public List<MessageResponse> findMessagesByRoomName(String roomName) {
        List<Message> auctionContractList = messageRepository.findMessagesByRoomName(roomName);
        return auctionContractList.stream()
        .map(messageMapper::mapToMessage)
        .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> findMessagesBySenderId(String senderId) {
        List<Message> auctionContractList = messageRepository.findMessagesBySenderId(senderId);
        return auctionContractList.stream()
        .map(messageMapper::mapToMessage)
        .collect(Collectors.toList());
    }

    @Override
    public void saveMessage(ChatMessage chatMessage) {
        Message message = new Message();
        User sender = userRepository.findByEmail(chatMessage.getSender())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User recipient = userRepository.findByEmail(chatMessage.getRecipient())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        message.setContent(chatMessage.getContent());
        message.setRoomName(chatMessage.getRoomName());
        message.setType(String.valueOf(chatMessage.getType()));
        message.setBot_ai(chatMessage.getBot_ai());
        message.setSender(sender);
        message.setRecipient(recipient);
        messageRepository.save(message);
    }
}
