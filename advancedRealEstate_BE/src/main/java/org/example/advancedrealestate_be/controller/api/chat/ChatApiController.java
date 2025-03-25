package org.example.advancedrealestate_be.controller.api.chat;

import com.nimbusds.jose.shaded.gson.JsonObject;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.model.Chat;
import org.example.advancedrealestate_be.model.ChatMessage;
import org.example.advancedrealestate_be.service.AuthenticationService;
import org.example.advancedrealestate_be.service.BuildingService;
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
import java.util.stream.Collectors;

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
    private final BuildingService buildingService;
    private final AuthenticationService authenticationService;

    @Autowired
    public ChatApiController(SimpMessagingTemplate messagingTemplate, PythonService pythonService, MessageService messageService, ScheduledTask scheduledTask, BuildingService buildingService, AuthenticationService authenticationService) {
        this.messagingTemplate = messagingTemplate;
        this.pythonService = pythonService;
        this.messageService = messageService;
        this.scheduledTask = scheduledTask;
        this.buildingService = buildingService;
        this.authenticationService = authenticationService;
    }

    public static String generateRandomMessageId(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return "Mid"+sb;
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
        roomUsers.putIfAbsent(room, ConcurrentHashMap.newKeySet());
        Set<String> usersInRoom = roomUsers.get(room);
        usersInRoom.add(message.getEmail());

        System.out.println("users in room: "+usersInRoom);

        messageObject.put("id", messageId);
        messageObject.put("sender", message.getEmail());
        messageObject.put("content", message.getContent());
        messageObject.put("currentDateTime", currentDateTime);
        messageObject.put("listUserOnline", usersInRoom);

        System.out.println("Ngày và giờ hiện tại (có giây): " + currentDateTime);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("auth: " + message.getIsAuth());
        boolean isValidToken = authenticationService.isValidToken(message.getToken());
        if(Objects.equals(message.getIsAuth(), "true") && isValidToken){
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(message.getSender());
            chatMessage.setRecipient(message.getRecipient());
            chatMessage.setContent(message.getContent());
            chatMessage.setType(ChatMessage.MessageType.SENT);
            chatMessage.setRoomName(room);
            if (!usersInRoom.contains(message.getRecipient()) && !Objects.equals(message.getIsManagement(), "true")) {
                System.out.println("run ai");
                String result = handleAImessage(message.getContent());
                chatMessage.setBot_ai(result);
                messageObject.put("bot_ai", result);
            }
            messageService.saveMessage(chatMessage);
        }else{
            String result = handleAImessageNotLogin(message.getContent());
            messageObject.put("bot_ai", result);
        }
        messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
    }

    private String handleAImessage(String userMsg){
        String context = "|counsel| ";
        List<BuildingResponse> buildingResponses = buildingService.getAllBuildings();

        String buildingData = buildingResponses.stream()
                .map(b -> String.format("Mã nhà: %s, %s, diện tích: %s, số tầng: %s, kiến trúc: %s, loại nhà: %s, giá nhà: %s, địa chỉ: %s, tại tỉnh/tp: %s",
                b.getId(),
                b.getName(),
                b.getArea()  + " m2",
                b.getNumber_of_basement(),
                b.getStructure(),
                b.getTypeBuilding().getType_name(),
                b.getTypeBuilding().getPrice() + " VNĐ",
                b.getMap().getAddress(),
                b.getMap().getProvince()))
        .collect(Collectors.joining(" | "));
        List<String> buildingList = Arrays.stream(buildingData.split("\\|"))
                .map(String::trim)
                .toList();

        Random random = new Random();
        int numItems = buildingList.size();
        List<String> randomBuildingList;
        if (buildingList.isEmpty()) {
            randomBuildingList = List.of("Không có dữ liệu bất động sản.");
        } else {
            List<String> shuffledList = new ArrayList<>(buildingList);
            Collections.shuffle(shuffledList, random);
            randomBuildingList = shuffledList.subList(0, Math.min(numItems, shuffledList.size()));
        }
        String randomBuildingInfo = String.join(" | ", randomBuildingList);

        System.out.println("building random: " + randomBuildingInfo);
        StringBuilder requireMsg = new StringBuilder("Đây là tin nhắn của khách hàng: ")
            .append(userMsg).append(". Còn đây là dữ liệu về bất động sản của công ty tôi: ")
            .append(randomBuildingInfo)
            .append(". Hãy tư vấn 1 cách chuyên nghiệp cho khách hàng về bất động sản của công ty chúng tôi! ")
            .append("Hãy thực hiện 1 số yêu cầu sau: ")
            .append(". Giới thiệu tên của bạn là gì? là AI gì?")
            .append(". thêm đường dẫn http://localhost:3000/buildings/mã nhà, để khách hàng bấm xem chi tiết")
            .append(". Kết thúc câu thêm đường link này để khách hàng bấm vào xem bất động sản: ")
            .append("http://localhost:3000/buildings")
            .append(". Khi khách hàng yêu cầu liệt kê bđs theo giá nếu giá khách hàng cầu cao hơn hoặc")
            .append(" thấp hơn với giá trong dữ liệu tôi cung cấp cho bạn thì hãy đưa ra các bđs có")
            .append(" giá tương đương với giá của khách hàng yêu cầu ")
            .append(". Khi khách hàng nhắn cảm ơn thì cảm ơn lại ngắn gọn khoản 20 chữ ko cung cấp thêm dữ liệu bđs của công ty")
            .append(". Nếu khách hàng nhắn những vấn đề khác không liên quan đến bất động sản thì phản hồi lại tin nhắn của khách hàng")
            .append(", và cảm ơn khách hàng đã quan tâm đến website");

        String msg = String.format(context + requireMsg);
        Map<String, Object> aiMessage = pythonService.getPrediction(msg);
        Map<String, Object> prediction = (Map<String, Object>) aiMessage.get("prediction");
        return (String) prediction.get("result");
    }

    private String handleAImessageNotLogin(String userMsg){
        String context = "|Unauthorized| ";
        String paraGraph[] = {
                "ngắn gọn 30 chữ",
                "hay 20 chữ",
                "đơn giản 30 chữ",
                "phổ thông 30 chữ",
                "nhấn mạnh 30 chữ",
                "nặng nề 30 chữ",
                "nhẹ nhàng 30 chữ",
                "súc tích 30 chữ",
                "dễ hiểu 30 chữ",
                "chính xác 30 chữ",
                "trang trọng 30 chữ",
                "thân thiện 30 chữ",
                "khách quan 30 chữ",
                "cảm xúc 30 chữ",
                "hài hước 30 chữ",
                "nghiêm túc 30 chữ",
                "tối giản 30 chữ"
        };
        String require = "Yêu cầu phản hồi cho tôi ko quá 30 chữ!. ";
        String requireMsg = require + "Đầu tiên hãy giới thiệu tên của bạn là gì? là AI gì?. " +
        "Viết 1 đoạn thông báo ... yêu cầu khách hàng đăng nhập vào hệ thống vì đăng nhập mới " +
        "chat được với nhân viên";
        Random random = new Random();
        String randomText = paraGraph[random.nextInt(paraGraph.length)];
        String contentMsg = requireMsg.replace("...", randomText);
        String msg = String.format(context + contentMsg);
        Map<String, Object> aiMessage = pythonService.getPrediction(msg);
        Map<String, Object> prediction = (Map<String, Object>) aiMessage.get("prediction");
        return (String) prediction.get("result");
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
