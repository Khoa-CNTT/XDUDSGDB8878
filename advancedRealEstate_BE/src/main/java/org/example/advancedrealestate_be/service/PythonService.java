package org.example.advancedrealestate_be.service;

import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.*;


import java.util.Map;

@Service
public class PythonService {

//    private final String pythonApiUrl = "http://localhost:5000/predict";  // Python service URL
    @Value("${python.api.base-url}")
    private String pythonApiUrl;

    public Map<String, Object> getPrediction(String message) {
        RestTemplate restTemplate = new RestTemplate();

        // Create a Map with the message to send as JSON
        Map<String, String> request = Map.of("text", message);
        // Make the POST request to the Python API
        try {
            return restTemplate.postForObject(pythonApiUrl + "/predict", request, Map.class);
        } catch (ResourceAccessException e) {
            System.err.println("Lỗi: Không thể kết nối đến API - " + e.getMessage());
            throw new AppException(ErrorCode.AI_SERVICE_CONNECTION_REFUSED);
        } catch (HttpClientErrorException e) {
            // Lỗi từ phía client (400-499)
            System.err.println("Lỗi client: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new AppException(ErrorCode.AI_SERVICE_CLIENT_REQUEST_ERROR);
        } catch (HttpServerErrorException e) {
            // Lỗi từ phía server (500-599)
            System.err.println("Lỗi server: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new AppException(ErrorCode.AI_SERVICE_SERVER_ERROR);
        } catch (RestClientException e) {
            System.err.println("Lỗi REST API: " + e.getMessage());
            throw new AppException(ErrorCode.AI_SERVICE_REST_API_ERROR);

        } catch (Exception e) {
            System.err.println("Lỗi không xác định: " + e.getMessage());
            throw new AppException(ErrorCode.UNKNOWN_ERROR);
        }
    }
}

