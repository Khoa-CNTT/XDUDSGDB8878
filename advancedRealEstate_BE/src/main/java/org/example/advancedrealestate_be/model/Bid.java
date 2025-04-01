package org.example.advancedrealestate_be.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class Bid {

    private Bid.BidMessageType type;
    private Long bidAmount;
    private String sender;
    private String email;
    private String auction_id;
    private String client_id;
    private String identity_key;
    private boolean clear;

    public enum BidMessageType {
        JOIN,
        LEAVE,
        AUCTION
    }
}
