package org.example.advancedrealestate_be.service;

import com.nimbusds.jose.JOSEException;
import org.example.advancedrealestate_be.dto.request.AuthenticationRequest;
import org.example.advancedrealestate_be.dto.request.IntrospectRequest;
import org.example.advancedrealestate_be.dto.request.LogoutRequest;
import org.example.advancedrealestate_be.dto.request.RefreshRequest;
import org.example.advancedrealestate_be.dto.response.AuthenticationResponse;
import org.example.advancedrealestate_be.dto.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationService {
     IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
     AuthenticationResponse authenticate(AuthenticationRequest request);
     void logout(LogoutRequest request) throws ParseException, JOSEException;
     AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
}
