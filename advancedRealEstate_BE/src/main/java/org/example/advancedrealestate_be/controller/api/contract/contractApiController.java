package org.example.advancedrealestate_be.controller.api.contract;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.BuildingUpdateImageRequest;
import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateFileRequest;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.service.ContractsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/contract")
@CrossOrigin(origins = "*")  // Cho phép truy cập từ frontend
@Tag(name = "13. Contract API", description = "API for admin")
public class contractApiController {

    @Autowired
    private ContractsService contractsService;

    @PostMapping
    public ResponseEntity<JSONObject> createContract(@RequestBody ContractCreateRequest request){
        JSONObject data=new JSONObject();
        String response = contractsService.createContract(request);
        data.put("data",response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping(value = "/upload-file/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JSONObject> uploadFile(
            @PathVariable String id,
            @RequestPart("file") MultipartFile file,  // Thay đổi từ "image" thành "file"
            @ModelAttribute @Valid ContractUpdateFileRequest request) {

        // Validate file type
        if (!isWordFile(file)) {
            JSONObject error = new JSONObject();
            error.put("status", 400);
            error.put("message", "Only Word documents (.doc, .docx) are allowed");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        JSONObject data = new JSONObject();
        String response = contractsService.updateFileContract(id, request, file); // Thêm file vào service
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    private boolean isWordFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (contentType.equals("application/msword") || contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
    }

    @PostMapping("/change-status")
    public ResponseEntity<JSONObject> changeStatus(@PathVariable String id) {
        JSONObject response = new JSONObject();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
