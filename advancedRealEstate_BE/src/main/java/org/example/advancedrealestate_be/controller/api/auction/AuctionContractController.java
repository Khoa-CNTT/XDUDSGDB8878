package org.example.advancedrealestate_be.controller.api.auction;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.dto.request.AuctionContractRequest;
import org.example.advancedrealestate_be.dto.request.AuctionDetailRequest;
import org.example.advancedrealestate_be.dto.request.AuctionPaymentRequest;
import org.example.advancedrealestate_be.dto.request.BuildingCreateRequest;
import org.example.advancedrealestate_be.service.AuctionContractService;
import org.example.advancedrealestate_be.service.AuctionDetailService;
import org.example.advancedrealestate_be.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/admin/")
@Tag(name = "6. Auction contract API", description = "API for auction contract")
@Slf4j
public class AuctionContractController {

    private final AuctionService auctionService;
    private final AuctionDetailService auctionDetailService;
    private final AuctionContractService auctionContractService;

    @Autowired
    public AuctionContractController(AuctionService auctionService, AuctionDetailService auctionDetailService, AuctionContractService auctionContractService) {
        this.auctionService = auctionService;
        this.auctionDetailService = auctionDetailService;
        this.auctionContractService = auctionContractService;
    }

    @PostMapping("/auction-contracts")
    private ResponseEntity<JSONObject> create(@ModelAttribute @Valid AuctionContractRequest dto) {
        return new ResponseEntity<>(auctionContractService.create(dto), HttpStatus.OK);
    }

    @GetMapping("/auction-contracts")
    private ResponseEntity<JSONObject> index() {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", auctionContractService.findAll());
        responseObject.put("total", auctionContractService.findAll().size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/auction-contracts/user-auction-contracts/{clientId}")
    private ResponseEntity<JSONObject> userAuctionDetails(@PathVariable String clientId) {
        JSONObject responseObject = new JSONObject();
        responseObject.put("data", auctionContractService.userAuctionContracts(clientId));
        responseObject.put("total", auctionContractService.userAuctionContracts(clientId).size());
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/auction-contracts/{id}")
    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
        return new ResponseEntity<>(auctionContractService.findById(id), HttpStatus.OK);
    }

    @PatchMapping("/auction-contracts/{id}")
    private ResponseEntity<JSONObject> update(@PathVariable String id, @RequestBody AuctionContractRequest dto) {
        return new ResponseEntity<>(auctionContractService.updateById(id, dto), HttpStatus.OK);
    }

    @PatchMapping("/auction-contracts/confirm_payment/{id}")
    private ResponseEntity<JSONObject> confirm_payment(@PathVariable String id, @RequestBody AuctionPaymentRequest dto) {
        return new ResponseEntity<>(auctionContractService.confirm_payment(id, dto), HttpStatus.OK);
    }

    @PatchMapping("/auction-contracts/{id}/confirm")
    private ResponseEntity<JSONObject> confirmContract(@PathVariable String id, @RequestParam("contractImageFile") MultipartFile contractImageFile) {
        return new ResponseEntity<>(auctionContractService.confirmContract(id, contractImageFile), HttpStatus.OK);
    }
    @CheckPermissionUtil("/admin/delete-auction")
    @DeleteMapping("/auction-contracts/{id}")
    private ResponseEntity<JSONObject> remove(@PathVariable String id) {
        return new ResponseEntity<>(auctionContractService.deleteById(id), HttpStatus.OK);
    }
}