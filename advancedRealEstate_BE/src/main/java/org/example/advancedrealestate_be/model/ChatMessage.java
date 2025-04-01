package org.example.advancedrealestate_be.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class ChatMessage {

    private ChatMessage.MessageType type;
    private String content;
    private String sender;
    private String recipient;
    private String roomName;
    private String bot_ai;

    public enum MessageType {
        SENT,
        SEEN,
        REP,
    }
}
