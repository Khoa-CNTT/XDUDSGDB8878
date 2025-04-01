//package org.example.advancedrealestate_be.controller.api.admin;
//
//import io.swagger.v3.oas.annotations.tags.Tag;
//import net.minidev.json.JSONObject;
//import org.example.advancedrealestate_be.dto.BuildingDto;
//import org.example.advancedrealestate_be.service.BuildingService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin")
//@Tag(name = "Admin buildings", description = "API for admin")
//public class AdminBuildingApiController {
//
//    BuildingService buildingService;
//
//    @Autowired
//    public AdminBuildingApiController(BuildingService buildingService) {
//        this.buildingService = buildingService;
//    }
//
//    @PostMapping("/buildings")
//    private ResponseEntity<JSONObject> create(@RequestBody BuildingDto buildingDto) {
//        JSONObject data = new JSONObject();
//        try {
////            BuildingDto responseDto = buildingService.create(buildingDto);
////            data.put("data", responseDto);
//            return new ResponseEntity<>(data, HttpStatus.OK);
//        } catch (Exception error) {
//            data.put("message", error.getMessage());
//            return new ResponseEntity<>(data, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @GetMapping("/buildings")
//    private ResponseEntity<JSONObject> index() {
//        JSONObject data = new JSONObject();
//        try {
//            List<BuildingDto> buildingDtoList = buildingService.findAll();
//            data.put("total", buildingDtoList.size());
//            data.put("data", buildingDtoList);
//            return new ResponseEntity<>(data, HttpStatus.OK);
//        } catch (Exception error) {
//            data.put("message", error.getMessage());
//            return new ResponseEntity<>(data, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @GetMapping("/buildings/{id}")
//    private ResponseEntity<JSONObject> detail(@PathVariable String id) {
//        JSONObject object = new JSONObject();
//        try {
//            BuildingDto buildingDto = buildingService.findById(id);
//            object.put("data", buildingDto);
//            return new ResponseEntity<>(object, HttpStatus.OK);
//        } catch (Exception error) {
//            object.put("message", error.getMessage());
//            return new ResponseEntity<>(object, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//
//    @PatchMapping("/buildings/{id}")
//    private ResponseEntity<JSONObject> update(@PathVariable String id, @RequestBody BuildingDto buildingDto) {
//        JSONObject data = new JSONObject();
//        try {
//            BuildingDto responseDto = buildingService.updateById(buildingDto, id);
//            data.put("data", responseDto);
//            return new ResponseEntity<>(data, HttpStatus.OK);
//        } catch (Exception error) {
//            data.put("message", error.getMessage());
//            return new ResponseEntity<>(data, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @DeleteMapping("/buildings/{id}")
//    private ResponseEntity<JSONObject> remove(@PathVariable String id) {
//        JSONObject data = new JSONObject();
//        try {
//            BuildingDto responseDto = buildingService.deleteById(id);
//            data.put("data", responseDto);
//            return new ResponseEntity<>(data, HttpStatus.OK);
//        } catch (Exception error) {
//            data.put("message", error.getMessage());
//            return new ResponseEntity<>(data, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//}
