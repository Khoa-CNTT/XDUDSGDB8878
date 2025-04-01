package org.example.advancedrealestate_be.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class Chat {
//    String nickname;
//    String content;
//    private Date timeStamp;

    private MessageType type;
    private String content;
    private String sender;
    private String email;
    private String recipient;
    private String isAuth;
    private String isManagement;
    private String token;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
    }
}
