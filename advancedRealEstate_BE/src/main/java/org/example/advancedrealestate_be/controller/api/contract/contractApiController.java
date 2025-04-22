package org.example.advancedrealestate_be.controller.api.contract;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.BuildingUpdateImageRequest;
import org.example.advancedrealestate_be.dto.request.ContractCreateRequest;
import org.example.advancedrealestate_be.dto.request.ContractIdRequest;
import org.example.advancedrealestate_be.dto.request.ContractUpdateFileRequest;
import org.example.advancedrealestate_be.dto.response.CategoryResponse;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.service.ContractsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        data.put("status", 200);
        data.put("message", response);
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
    public ResponseEntity<JSONObject> changeStatus(@RequestBody ContractIdRequest request) {
        JSONObject data = new JSONObject();
        String response = contractsService.changeContractStatus(request.getId());
        data.put("status", 200);
        data.put("message", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<JSONObject> getAllCategory(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        JSONObject data = new JSONObject();
        Map<String, Object> response = new HashMap<>();

        if (page == null || size == null) {
//            List<ContractResponse> contract = contractsService.getContract();

//            response.put("data", contract);
        } else {
            Page<ContractResponse> pageResult = contractsService.getContract(page, size);

            Map<String, Object> pagination = new HashMap<>();
            pagination.put("total", pageResult.getTotalElements());
            pagination.put("per_page", pageResult.getSize());
            pagination.put("current_page", pageResult.getNumber() + 1);
            pagination.put("last_page", pageResult.getTotalPages());
            pagination.put("from", (pageResult.getNumber() * pageResult.getSize()) + 1);
            pagination.put("to", Math.min((pageResult.getNumber() + 1) * pageResult.getSize(), pageResult.getTotalElements()));
            response.put("pagination", pagination);
            response.put("data", pageResult.getContent());
        }
        data.put("status", 200);
        data.put("data", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping(value = "/{userId}")
    public ResponseEntity<JSONObject> getContractsByUserId(@PathVariable String userId,
                                                           @RequestParam(defaultValue = "1") Integer page,
                                                           @RequestParam(defaultValue = "10") Integer size) {
        JSONObject data = new JSONObject();
        Map<String, Object> response = new HashMap<>();

        if (page == null || size == null) {
//            List<ContractResponse> contract = contractsService.getContract();

//            response.put("data", contract);
        } else {
            Page<ContractResponse> pageResult = contractsService.getContractsByUserId(userId, page, size);

            Map<String, Object> pagination = new HashMap<>();
            pagination.put("total", pageResult.getTotalElements());
            pagination.put("per_page", pageResult.getSize());
            pagination.put("current_page", pageResult.getNumber() + 1);
            pagination.put("last_page", pageResult.getTotalPages());
            pagination.put("from", (pageResult.getNumber() * pageResult.getSize()) + 1);
            pagination.put("to", Math.min((pageResult.getNumber() + 1) * pageResult.getSize(), pageResult.getTotalElements()));
            response.put("pagination", pagination);
            response.put("data", pageResult.getContent());
        }
        data.put("status", 200);
        data.put("data", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
