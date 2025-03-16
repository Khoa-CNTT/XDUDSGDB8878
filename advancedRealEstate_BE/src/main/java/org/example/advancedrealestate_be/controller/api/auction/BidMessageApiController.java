package org.example.advancedrealestate_be.controller.api.auction;


import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.AuctionHistoryRequest;
import org.example.advancedrealestate_be.model.Bid;
import org.example.advancedrealestate_be.model.Chat;
import org.example.advancedrealestate_be.service.AuctionHistoryService;
import org.example.advancedrealestate_be.service.PythonService;
import org.example.advancedrealestate_be.service.Task.ScheduledTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Controller
//@CrossOrigin(origins = "https://localhost:3000")
public class BidMessageApiController {


    private final PythonService pythonService;
    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionHistoryService auctionHistoryService;
    private final ScheduledTask scheduledTask;
    private final Map<String, Set<String>> roomUsers = new HashMap<>();
    private final Map<String, Set<String>> msgUsers = new HashMap<>();

    @Autowired
    public BidMessageApiController(PythonService pythonService, SimpMessagingTemplate messagingTemplate, AuctionHistoryService auctionHistoryService, ScheduledTask scheduledTask) {
        this.pythonService = pythonService;
        this.messagingTemplate = messagingTemplate;
        this.auctionHistoryService = auctionHistoryService;
        this.scheduledTask = scheduledTask;
    }

    public static String generateRandomBidMessageId(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return "Mid"+sb;
    }

    @MessageMapping("/sendBidToRoom/{room}")
    public void sendBidToRoom(@DestinationVariable("room") String room, Bid bidMessage) {
        System.out.println("Message: " + bidMessage);
        System.out.println("Room: " + room);
        ZonedDateTime currentTimeInVN = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currentDateTime = currentTimeInVN.format(formatter);
        String messageId = generateRandomBidMessageId(9);
        JSONObject messageObject = new JSONObject();
        Set<String> messagesInRoom = msgUsers.getOrDefault(room, new HashSet<>());
        Map<String, Object> aiMessage = pythonService.getPrediction(String.valueOf(bidMessage.getBidAmount()));
        Map<String, Object> prediction = (Map<String, Object>) aiMessage.get("prediction");

        System.out.println("aiMessage: " + aiMessage);
        int acreage = (int) prediction.get("acreage");
        messageObject.put("id", messageId);
        if(acreage < 1){
            messageObject.put("bot_ai", prediction.get("description"));
        }
        messageObject.put("sender", bidMessage.getEmail());
        messageObject.put("bidAmount", bidMessage.getBidAmount());
        messageObject.put("client_id", bidMessage.getClient_id());
        messageObject.put("auction_id", bidMessage.getAuction_id());
        messageObject.put("currentDateTime", currentDateTime);
        messageObject.put("roomUser", room);
        messageObject.put("isSendBid", true);
        messageObject.put("identity_key", bidMessage.getIdentity_key());
        messagesInRoom.add(messageObject.toString());
        msgUsers.put(room, messagesInRoom);
        messageObject.put("bids", messagesInRoom);

        AuctionHistoryRequest dto = new AuctionHistoryRequest();
        dto.setMessageBidId(messageObject.get("id").toString());
        dto.setBidTime(messageObject.get("currentDateTime").toString());
        dto.setBidAmount(bidMessage.getBidAmount());
        dto.setAuction_id(bidMessage.getAuction_id());
        dto.setClient_id(bidMessage.getClient_id());
        auctionHistoryService.handleBidMessage(dto);

        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }

    @MessageMapping("/clearBidToRoom/{room}")
    public void clearBidToRoom(@DestinationVariable("room") String room, Bid bidMessage) {
        System.out.println("Message: " + bidMessage);
        System.out.println("Room: " + room);
        System.out.println("Clear bids: " + bidMessage.isClear());

        JSONObject messageObject = new JSONObject();
        Set<String> messagesInRoom = msgUsers.getOrDefault(room, new HashSet<>());

        messagesInRoom.clear();
        messagesInRoom.add(messageObject.toString());
        msgUsers.put(room, messagesInRoom);
        messageObject.put("bids", messagesInRoom);
        auctionHistoryService.handleDeleteAllAuctionHistoriesByAid(bidMessage.getAuction_id());

        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }

    @MessageMapping("/userJoinAuction/{room}")
    public void userJoinAuction(@DestinationVariable("room") String room, Bid bidMessage, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("Client joined room: " + room);

        System.out.println("Message: " + bidMessage);
        JSONObject messageObject = new JSONObject();
        Set<String> usersInRoom = roomUsers.getOrDefault(room, new HashSet<>());
        Set<String> messagesInRoom = msgUsers.getOrDefault(room, new HashSet<>());
        ObjectMapper objectMapper = new ObjectMapper();

        usersInRoom.add(bidMessage.getEmail());
        roomUsers.put(room, usersInRoom);
        if(!messagesInRoom.isEmpty()){
            messagesInRoom.add(messageObject.toString());
            msgUsers.put(room, messagesInRoom);
            messageObject.put("bids", messagesInRoom);
        }
        if (messagesInRoom.stream().noneMatch(msg -> {
            try {
                Map messageMap = objectMapper.readValue(msg, Map.class);
                return messageMap.get("identity_key").equals(bidMessage.getIdentity_key());
            } catch (Exception e) {
                return false;
            }
        })) {
            messagesInRoom.clear();
        }
        System.out.println("msg: " + messagesInRoom);
        if(messagesInRoom.isEmpty()){
            messageObject.put("isNewAuction", true);
        }
        messageObject.put("count", usersInRoom.size());
        messageObject.put("users", usersInRoom);
        messageObject.put("newUser", bidMessage.getEmail());

        headerAccessor.getSessionAttributes().put("username", bidMessage.getSender());

        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }

    @MessageMapping("/leaveAuctionRoom/{room}")
    public void userLeaveRoom(@DestinationVariable("room") String room, Bid bidMessage, SimpMessageHeaderAccessor headerAccessor) {

        System.out.println("Message: " + bidMessage);
        JSONObject messageObject = new JSONObject();
        Set<String> usersInRoom = roomUsers.getOrDefault(room, new HashSet<>());
        usersInRoom.remove(bidMessage.getEmail());
        messageObject.put("bot", bidMessage.getEmail() + " đã rời phòng " + room + "!");
        messageObject.put("count", usersInRoom.size());
        messageObject.put("users", usersInRoom);
        messageObject.put("userOut", bidMessage.getEmail());
        messageObject.put("isOut", true);

        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }
}
