package org.example.advancedrealestate_be.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    SEND_MAIL_FAILED(500, "Send mail failed", HttpStatus.INTERNAL_SERVER_ERROR),
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_FILE(400, "Invalid file", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(404, "Role not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(404, "Room not found", HttpStatus.NOT_FOUND),
    BUILDING_NOT_FOUND(404, "Building not found", HttpStatus.NOT_FOUND),
    TYPE_BUILDING_NOT_FOUND(404, "Type Building not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1009,"Token already expired",HttpStatus.NOT_FOUND),
    MAP_NOT_FOUND(404, "Map not found", HttpStatus.NOT_FOUND),
    SERVICE_NOT_FOUND(404, "Service not found", HttpStatus.NOT_FOUND),
    AUCTION_NOT_FOUND(404, "Auction not found", HttpStatus.NOT_FOUND),
    AUCTION_DETAIL_NOT_FOUND(404, "Auction detail not found", HttpStatus.NOT_FOUND),
    AUCTION_HISTORY_NOT_FOUND(404, "Auction history not found", HttpStatus.NOT_FOUND),
    AUCTION_HISTORY_BAD_REQUEST(400, "Auction history bad request", HttpStatus.BAD_REQUEST),
    AUCTION_HISTORY_LIST_IS_EMPTY(400, "Auction history list is empty", HttpStatus.NOT_FOUND),;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }
}
