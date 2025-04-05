package org.example.advancedrealestate_be.controller.api.auction;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.MapDto;
import org.example.advancedrealestate_be.dto.request.AuctionRequest;
import org.example.advancedrealestate_be.service.AuctionService;
import org.example.advancedrealestate_be.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/")
@Tag(name = "5. Auction API", description = "API for auction")
@Slf4j
public class AuctionApiController {

    private final MapService mapService;
    private final AuctionService auctionService;

    @Autowired
    public AuctionApiController(MapService mapService, AuctionService auctionService) {
        this.mapService = mapService;
        this.auctionService = auctionService;
    }

    @PostMapping("/auctions")
    private ResponseEntity<JSONObject> create(@RequestBody AuctionRequest auctionRequest) {
        return new ResponseEntity<>(auctionService.create(auctionRequest), HttpStatus.OK);
    }

    @GetMapping("/auctions")
    private ResponseEntity<JSONObject> index() {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", auctionService.findAll());
        responseObject.put("total", auctionService.findAll().size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/auctions/{id}")
    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
        return new ResponseEntity<>(auctionService.findById(id), HttpStatus.OK);
    }

    @PatchMapping("/auctions/{id}")
    private ResponseEntity<JSONObject> update(@PathVariable String id, @RequestBody AuctionRequest auctionRequest) {
        return new ResponseEntity<>(auctionService.updateById(id, auctionRequest), HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-auction")
    @DeleteMapping("/auctions/{id}")
    private ResponseEntity<JSONObject> remove(@PathVariable String id) {
        return new ResponseEntity<>(auctionService.deleteById(id), HttpStatus.OK);
    }
}
