package org.example.advancedrealestate_be.controller.api.chat;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.service.MessageService;
import org.example.advancedrealestate_be.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/")
@Tag(name = "12. Message API", description = "API for message")
@Slf4j
public class MessageApiController {

    private final MessageService messageService;
    private final UserService userService;

    @Autowired
    public MessageApiController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping("/user-messages/{userId}/{partner_email}")
    private ResponseEntity<JSONObject> userMessages(@PathVariable String userId, @PathVariable String partner_email) {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", messageService.findMessagesBetweenUsers(userId, partner_email));
        responseObject.put("total", messageService.findMessagesBetweenUsers(userId, partner_email).size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/user-clients")
    ResponseEntity<JSONObject> userClients() {
        JSONObject response = new JSONObject();
        response.put("data", userService.getUserByClientRole());
        response.put("total", userService.getUserByClientRole().size());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
