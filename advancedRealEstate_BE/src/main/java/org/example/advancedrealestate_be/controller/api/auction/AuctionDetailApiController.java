package org.example.advancedrealestate_be.controller.api.auction;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.request.AuctionDetailRequest;
import org.example.advancedrealestate_be.dto.request.AuctionRequest;
import org.example.advancedrealestate_be.service.AuctionDetailService;
import org.example.advancedrealestate_be.service.AuctionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/")
@Tag(name = "6. Auction detail API", description = "API for auction detail")
@Slf4j
public class AuctionDetailApiController {

    private final AuctionService auctionService;
    private final AuctionDetailService auctionDetailService;


    public AuctionDetailApiController(AuctionService auctionService, AuctionDetailService auctionDetailService) {
        this.auctionService = auctionService;
        this.auctionDetailService = auctionDetailService;
    }

    @PostMapping("/auction-details")
    private ResponseEntity<JSONObject> create(@RequestBody AuctionDetailRequest dto) {
        return new ResponseEntity<>(auctionDetailService.create(dto), HttpStatus.OK);
    }

    @GetMapping("/auction-details")
    private ResponseEntity<JSONObject> index() {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", auctionDetailService.findAll());
        responseObject.put("total", auctionDetailService.findAll().size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/auction-details/user-auction-details/{clientId}")
    private ResponseEntity<JSONObject> userAuctionDetails(@PathVariable String clientId) {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", auctionDetailService.userAuctionDetails(clientId));
        responseObject.put("total", auctionDetailService.userAuctionDetails(clientId).size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/auction-details/{id}")
    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
        return new ResponseEntity<>(auctionDetailService.findById(id), HttpStatus.OK);
    }

    @PatchMapping("/auction-details/{id}")
    private ResponseEntity<JSONObject> update(@PathVariable String id, @RequestBody AuctionDetailRequest dto) {
        return new ResponseEntity<>(auctionDetailService.updateById(id, dto), HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-auction")
    @DeleteMapping("/auction-details/{id}")
    private ResponseEntity<JSONObject> remove(@PathVariable String id) {
        return new ResponseEntity<>(auctionDetailService.deleteById(id), HttpStatus.OK);
    }
}
