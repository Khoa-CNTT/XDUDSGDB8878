package org.example.advancedrealestate_be.controller.api.user;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.BuildingDto;
import org.example.advancedrealestate_be.dto.MapDto;
import org.example.advancedrealestate_be.dto.RoomChatDto;
import org.example.advancedrealestate_be.dto.ServiceDto;
import org.example.advancedrealestate_be.dto.response.AuctionResponse;
import org.example.advancedrealestate_be.dto.response.BuildingResponse;
import org.example.advancedrealestate_be.dto.response.RoleResponse;
import org.example.advancedrealestate_be.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/user")
@Tag(name = "2. Public API", description = "API public")
public class UserBuildingApiController {
    private final BuildingService buildingService;
    private final AuctionService auctionService;
    private final MapService mapService;
    private final RoomChatService roomChatService;
    private final RoleService roleService;
    private final ServiceService serviceService;
    private final UserService userService;
    private final MessageService messageService;


    @Autowired
    public UserBuildingApiController(BuildingService buildingService, AuctionService auctionService, MapService mapService, RoomChatService roomChatService, RoleService roleService, ServiceService serviceService, UserService userService, MessageService messageService) {
        this.buildingService = buildingService;
        this.auctionService = auctionService;
        this.mapService = mapService;
        this.roomChatService = roomChatService;
        this.roleService = roleService;
        this.serviceService = serviceService;
        this.userService = userService;
        this.messageService = messageService;
    }

    @GetMapping("/user-staffs")
    ResponseEntity<JSONObject> userStaffs() {
        JSONObject response = new JSONObject();
        response.put("data", userService.getUserByStaffRole());
        response.put("total", userService.getUserByStaffRole().size());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(value = "/buildings")
    public ResponseEntity<JSONObject> getAllBuildings() {
        JSONObject data = new JSONObject();
        data.put("status", 200);
        data.put("total", buildingService.getAllBuildings().size());
        data.put("data", buildingService.getAllBuildings());
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping(value = "/buildings/{id}")
    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
        return new ResponseEntity<>(buildingService.findById(id), HttpStatus.OK);
    }

    @GetMapping(value = "/maps")
    private ResponseEntity<JSONObject> index_map() {
        JSONObject data = new JSONObject();
        data.put("total", mapService.findAll().size());
        data.put("data", mapService.findAll());
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping(value = "/maps/{id}")
    private ResponseEntity<JSONObject> detail_map(@PathVariable String id) {
        return new ResponseEntity<>(mapService.findById(id), HttpStatus.OK);
    }

    @GetMapping(value = "/room-chats")
    ResponseEntity<JSONObject> index_roomChat() {
        JSONObject data = new JSONObject();
        data.put("total", roomChatService.findAll().size());
        data.put("data", roomChatService.findAll());
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/auctions")
    private ResponseEntity<JSONObject> index_auction() {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", auctionService.findAll());
        responseObject.put("total", auctionService.findAll().size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/auctions/{id}")
    private ResponseEntity<JSONObject> detail_auction(@PathVariable String id) {
        return new ResponseEntity<>(auctionService.findById(id), HttpStatus.OK);
    }

    @GetMapping("/roles/{type}")
    private ResponseEntity<JSONObject> getRolesByType(@PathVariable String type) {
        List<RoleResponse> roleResponseList = roleService.findRolesByType(type);
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", roleResponseList);
        responseObject.put("total", roleResponseList.size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/services")
    private ResponseEntity<JSONObject> index_service() {
        JSONObject data = new JSONObject();
        data.put("total", serviceService.findAll().size());
        data.put("data", serviceService.findAll());
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/services/{id}")
    private ResponseEntity<JSONObject> detail_service(@PathVariable String id) {
        return new ResponseEntity<>(serviceService.findById(id), HttpStatus.OK);
    }
}
