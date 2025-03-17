package org.example.advancedrealestate_be.controller.api.chat;

import com.nimbusds.jose.shaded.gson.JsonObject;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.model.Chat;
import org.example.advancedrealestate_be.model.ChatMessage;
import org.example.advancedrealestate_be.service.MessageService;
import org.example.advancedrealestate_be.service.PythonService;
import org.example.advancedrealestate_be.service.Task.ScheduledTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ChatApiController {

//    @MessageMapping("/chat")
//    @SendTo("/topic/messages")
//    public Chat sendMessage(@Payload Chat chat){
//        chat.setTimeStamp(new Date());
//        return chat;
//    }

    private final SimpMessagingTemplate messagingTemplate;
    private final PythonService pythonService;
    private final MessageService messageService;
    private final ScheduledTask scheduledTask;
    private final Map<String, Set<String>> roomUsers = new HashMap<>();
    private String bot = "Bot: ";

    @Autowired
    public ChatApiController(SimpMessagingTemplate messagingTemplate, PythonService pythonService, MessageService messageService, ScheduledTask scheduledTask) {
        this.messagingTemplate = messagingTemplate;
        this.pythonService = pythonService;
        this.messageService = messageService;
        this.scheduledTask = scheduledTask;
    }

    public static String generateRandomMessageId(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return "Mid"+sb;
    }

    private void awaitSend(JSONObject messageObject, String room, String message){
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(500);
                messageObject.put("content", null);
                messageObject.put("bot", message);
                messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }

    @MessageMapping("/sendMessageToRoom/{room}")
    public void sendMessageToRoom(@DestinationVariable("room") String room, Chat message) {
        System.out.println("Message: " + message);
        System.out.println("Room: " + room);
        String messageId = generateRandomMessageId(9);
        JSONObject messageObject = new JSONObject();
        ZonedDateTime currentTimeInVN = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currentDateTime = currentTimeInVN.format(formatter);
        messageObject.put("id", messageId);
        messageObject.put("sender", message.getEmail());
        messageObject.put("content", message.getContent());
        messageObject.put("currentDateTime", currentDateTime);
        System.out.println("Ngày và giờ hiện tại (có giây): " + currentDateTime);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("auth: " + message.getIsAuth());
        if(Objects.equals(message.getIsAuth(), "true")){
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(message.getSender());
            chatMessage.setRecipient(message.getRecipient());
            chatMessage.setContent(message.getContent());
            chatMessage.setType(ChatMessage.MessageType.SENT);
            chatMessage.setRoomName(room);
            messageService.saveMessage(chatMessage);
        }else{
            Map<String, Object> aiMessage = pythonService.getPrediction("Unauthorized");
            Map<String, Object> prediction = (Map<String, Object>) aiMessage.get("prediction");
            String result = (String) prediction.get("result");
            messageObject.put("bot_ai", result);
        }
        if(Objects.equals(message.getContent(), "a")){
            awaitSend(messageObject, room, "hahahaha");
        }
        if(Objects.equals(message.getContent(), "hello")){
            awaitSend(messageObject, room, "Hello " + message.getSender());
        }
        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }


    @MessageMapping("/addUser/{room}")
    public void addUser(@DestinationVariable("room") String room, Chat message, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("User joined room: " + room);
        System.out.println("Message: " + message);
        JSONObject messageObject = new JSONObject();
        roomUsers.putIfAbsent(room, ConcurrentHashMap.newKeySet());
        Set<String> usersInRoom = roomUsers.get(room);
        usersInRoom.add(message.getEmail());

        System.out.println("users in room: "+usersInRoom);

        messageObject.put("count", usersInRoom.size());
        messageObject.put("email", message.getEmail());
        messageObject.put("sender", message.getEmail());
        messageObject.put("listUserOnline", usersInRoom);
        messageObject.put("bot", "Chào mừng " + message.getEmail() + " đã vào phòng " + room);
        messageObject.put("content", message.getContent());

        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", message.getSender() == null ? "guest" : message.getSender());

        if(Objects.equals(room, "phòng đấu giá bất động sản cao cấp")){
            awaitSend(messageObject, room, "Chào " + message.getEmail() + " bạn cần tôi giúp gì không?");
        }

        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }

    @MessageMapping("/leaveRoom/{room}")
    public void userLeaveRoom(@DestinationVariable("room") String room, Chat message, SimpMessageHeaderAccessor headerAccessor) {

        System.out.println("Message: " + message);
        JSONObject messageObject = new JSONObject();
        Set<String> usersInRoom = roomUsers.getOrDefault(room, new HashSet<>());
        usersInRoom.remove(message.getEmail());
        messageObject.put("bot", message.getEmail() + " đã rời phòng " + room + "!");
        messageObject.put("count", usersInRoom.size());

        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }
}
