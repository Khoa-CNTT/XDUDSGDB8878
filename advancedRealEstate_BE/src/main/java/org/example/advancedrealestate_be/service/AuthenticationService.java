package org.example.advancedrealestate_be.service;

import com.nimbusds.jose.JOSEException;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.AuthenticationRequest;
import org.example.advancedrealestate_be.dto.request.IntrospectRequest;
import org.example.advancedrealestate_be.dto.request.LogoutRequest;
import org.example.advancedrealestate_be.dto.request.RefreshRequest;
import org.example.advancedrealestate_be.dto.response.AuthenticationResponse;
import org.example.advancedrealestate_be.dto.response.IntrospectResponse;
import org.example.advancedrealestate_be.dto.response.UserResponse;

import java.text.ParseException;

public interface AuthenticationService {
     IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
     JSONObject authenticate(AuthenticationRequest request, UserResponse userResponse);
     void logout(LogoutRequest request) throws ParseException, JOSEException;
     AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
     boolean isValidToken(String token);
}
