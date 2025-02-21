//package org.example.advancedrealestate_be.controller.api.building;
//
//
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.client.RestClientException;
//import org.springframework.web.client.RestTemplate;
//
//
//@RestController
//@SecurityRequirement(name = "bearerAuth")
//@RequestMapping("/api/buildings")@Tag(name = "Admin customer", description = "API for admin")
//public class BuildingController {
////    @Autowired
////    private AIService aiModelService;
////
////    @PostMapping("/search")
////    public String searchBuilding(@RequestBody SearchRequest request) {
////        return aiModelService.searchBuilding(request.getQuery());
////    }
//
//    @Autowired
//    private RestTemplate restTemplate;
//
//    @PostMapping("/search")
//    public String getPrediction(@RequestBody String inputText) {
//        String url = "http://localhost:5000/predict";
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<String> entity = new HttpEntity<>(inputText, headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//            return response.getBody();
//        } catch (RestClientException e) {
//            e.printStackTrace();
//            return "Error: " + e.getMessage();
//        }
//    }
//}
