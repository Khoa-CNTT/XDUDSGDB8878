package org.example.advancedrealestate_be.controller.api.customer;

import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.CustomerLoginRequest;
import org.example.advancedrealestate_be.dto.request.CustomerRequest;
import org.example.advancedrealestate_be.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/customers")
@Tag(name = "14. Customer API", description = "API for customer")
public class CustomerApiController {
    private final CustomerService customerService;

    @Autowired
    public CustomerApiController(CustomerService customerService) {
        this.customerService = customerService;
    }
    @PostMapping("/register")
    public ResponseEntity<JSONObject> registerCustomer(@Valid @RequestBody CustomerRequest request) {
        JSONObject data=new JSONObject();
        String response = customerService.registerCustomer(request);
        data.put("data", response);
        data.put("message","Account was created successfully");
        return new ResponseEntity<>(data,HttpStatus.OK);
    }


    @GetMapping("/verify")
    public ResponseEntity<String> verifyCustomer(@RequestParam String token) {
        boolean verified = customerService.verifyCustomer(token);
        if (verified) {
            return ResponseEntity.ok("Account verified successfully!");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestBody String email) {
        customerService.requestPasswordReset(email);

        return ResponseEntity.ok("Password reset email sent");
    }



    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token,
                                                @RequestParam String newPassword) {
        customerService.resetPassword(token, newPassword);

        return ResponseEntity.ok("Password has been reset successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<JSONObject> authLogin(@RequestBody CustomerLoginRequest request) {
        JSONObject data = new JSONObject();
        String response = customerService.login(request.getEmail(), request.getPassword());
        data.put("token", response);
        data.put("message", "Đã đăng nhập thành công!!");
        data.put("status", 200);
        return new ResponseEntity<>(data,HttpStatus.OK);
    }
}
