package org.example.advancedrealestate_be.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.Map;

@Service
public class PythonService {

    private final String pythonApiUrl = "http://localhost:5000/predict";  // Python service URL

    public Map<String, Object> getPrediction(String message) {
        RestTemplate restTemplate = new RestTemplate();

        // Create a Map with the message to send as JSON
        Map<String, String> request = Map.of("text", message);

        // Make the POST request to the Python API
        Map<String, Object> response = restTemplate.postForObject(pythonApiUrl, request, Map.class);

        return response;
    }
}

