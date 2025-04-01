package org.example.advancedrealestate_be.service.Task;

import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Objects;

@EnableScheduling
@Component
public class ScheduledTask {

    // Thực thi mỗi phút
    //5000 = 5s
    private final SimpMessagingTemplate messagingTemplate;
    private String room;
    private String status;
    private int countUser;
    private String messageContent;
    @Autowired
    public ScheduledTask(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void setRoomAndMessage(String room, String messageContent, String status, int countUser) {
        this.room = room;
        this.status = status;
        this.countUser = countUser;
        this.messageContent = messageContent;
    }

    @Scheduled(fixedRate = 500)
    public void autoSend() {

        if(Objects.equals(status, "offline")){
            return;
        }
        if(Objects.equals(status, "send")){
            return;
        }
        if(Objects.equals(status, "online")){
            System.out.println("run...");

            JSONObject messageObject = new JSONObject();
            messageObject.put("bot", messageContent);
            messagingTemplate.convertAndSend("/topic/room/" + room, messageObject.toString());
        }
    }
}