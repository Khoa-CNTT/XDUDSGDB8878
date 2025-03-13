package org.example.advancedrealestate_be.controller.api.building;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.advancedrealestate_be.service.PythonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/buildings")
@Tag(name = "4. Building API", description = "API for building")
public class PredictionController {

    private final PythonService pythonService;

    @Autowired
    public PredictionController(PythonService pythonService) {
        this.pythonService = pythonService;
    }

    @PostMapping("/search")
    public Map<String, Object> predict(@RequestBody Map<String, String> request) {
        String message = request.get("message");  // Extract the message
        if (message == null || message.isEmpty()) {
            throw new IllegalArgumentException("Message input is required");
        }
        // Call the Python service to get prediction
        return pythonService.getPrediction(message);
    }



//    private final String flaskApiUrl = "http://localhost:5000";
//
//    @PostMapping("/search")
//    public ResponseEntity<?> searchBuilding(@RequestBody Map<String, String> request) {
//        String message = request.get("message");
//
//        if (message == null || message.isEmpty()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
//        }
//
//        try {
//            // Prepare JSON payload
//            String jsonPayload = String.format("{\"text\": \"%s\"}", message);
//
//            // Create connection
//            URL url = new URL(flaskApiUrl + "/predict");
//            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//            connection.setRequestMethod("POST");
//            connection.setRequestProperty("Content-Type", "application/json");
//            connection.setDoOutput(true);
//
//            // Send JSON payload
//            try (OutputStream os = connection.getOutputStream()) {
//                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
//                os.write(input, 0, input.length);
//            }
//
//            // Get response
//            int status = connection.getResponseCode();
//            if (status == HttpURLConnection.HTTP_OK) {
//                try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
//                    StringBuilder response = new StringBuilder();
//                    String responseLine;
//                    while ((responseLine = br.readLine()) != null) {
//                        response.append(responseLine.trim());
//                    }
//
//                    // Return the response from the Flask API
//                    return ResponseEntity.ok(response.toString());
//                }
//            } else {
//                // Handle errors
//                try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getErrorStream(), StandardCharsets.UTF_8))) {
//                    StringBuilder errorResponse = new StringBuilder();
//                    String responseLine;
//                    while ((responseLine = br.readLine()) != null) {
//                        errorResponse.append(responseLine.trim());
//                    }
//                    return ResponseEntity.status(status).body(Map.of("error", errorResponse.toString()));
//                }
//            }
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body(Map.of("error", "Error calling Flask API: " + e.getMessage()));
//        }
//    }
}