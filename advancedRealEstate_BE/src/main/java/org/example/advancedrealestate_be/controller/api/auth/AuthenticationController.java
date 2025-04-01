package org.example.advancedrealestate_be.controller.api.auth;
import java.text.ParseException;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.response.ApiResponse;
import org.example.advancedrealestate_be.model.Email;
import org.example.advancedrealestate_be.service.AuthenticationService;
import org.example.advancedrealestate_be.service.UserService;
import org.example.advancedrealestate_be.service.handler.SendEmailHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.advancedrealestate_be.dto.request.*;
import org.example.advancedrealestate_be.dto.response.AuthenticationResponse;
import org.example.advancedrealestate_be.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;


@RestController
@RequestMapping("api/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "1. Auth API")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final SendEmailHandler sendEmailHandler;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService, UserService userService, SendEmailHandler sendEmailHandler) {
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.sendEmailHandler = sendEmailHandler;
    }

    @PostMapping("/test-send-email")
    public ResponseEntity<Void> sendEmail(@Valid @RequestBody Email email) {
        sendEmailHandler.sendEmail(email);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/sign-up")
    public String signup(@RequestBody UserRequest userRequest) {
        return userService.createUserbyEmail(userRequest);
    }


    @PostMapping("/token")
    ApiResponse<Object> authenticate(@RequestBody AuthenticationRequest request) {
        var userInfo = userService.getMyInfo(request.getEmail());
        var result = authenticationService.authenticate(request, userInfo);
        return ApiResponse.builder().result(result).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }
}
