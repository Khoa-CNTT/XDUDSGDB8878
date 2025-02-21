package org.example.advancedrealestate_be.controller.api.contract;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.request.ContractRequest;
import org.example.advancedrealestate_be.dto.response.ContractResponse;
import org.example.advancedrealestate_be.dto.response.CustomerResponse;
import org.example.advancedrealestate_be.mapper.ContractMapper;
import org.example.advancedrealestate_be.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/contract")
@Tag(name = "13. Contract API", description = "API for admin")
public class contractApiController {

    @Autowired
    private ContractService contractService;


    @PostMapping
    public ResponseEntity<JSONObject> createContract(@RequestBody ContractRequest request){
        JSONObject data=new JSONObject();
        String response=contractService.createContract(request);
        data.put("data",response);
        data.put("message","Contract was created successfully");
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JSONObject> getContractById(@PathVariable String id){
        JSONObject data=new JSONObject();
        ContractResponse response=contractService.getContractById(id);
        data.put("data",response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

//    @GetMapping
//    public ResponseEntity<JSONObject> getAllContracts(){
//        JSONObject data=new JSONObject();
//        try{
//            List<ContractResponse> contractResponses=contractService.getAllContracts();
//            data.put("total", contractResponses.size());
//            data.put("data",contractResponses);
//            return new ResponseEntity<>(data,HttpStatus.OK);
//
//        }catch (Exception error){
//            data.put("message",error.getMessage());
//            return new ResponseEntity<>(data,HttpStatus.INTERNAL_SERVER_ERROR);
//
//        }
//    }

    @GetMapping
    public ResponseEntity<JSONObject> getAllContracts(@RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "5") int size) {
        JSONObject data = new JSONObject();
        // Lấy dữ liệu người dùng với phân trang
        Page<ContractResponse> pageResult = contractService.getAllContracts(page, size);

        // Tạo đối tượng response chứa thông tin phân trang và danh sách người dùng
        Map<String, Object> response = new HashMap<>();

        // Metadata về phân trang
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("total", pageResult.getTotalElements());
        pagination.put("per_page", pageResult.getSize());
        pagination.put("current_page", pageResult.getNumber() + 1);
        pagination.put("last_page", pageResult.getTotalPages());
        pagination.put("from", (pageResult.getNumber() * pageResult.getSize()) + 1);
        pagination.put("to", Math.min((pageResult.getNumber() + 1) * pageResult.getSize(), pageResult.getTotalElements()));

        response.put("pagination", pagination);
        response.put("data", pageResult.getContent());
        data.put("status", 200);
        data.put("data", response);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONObject> updateContract(@PathVariable String id, @RequestBody ContractRequest request){
        JSONObject data=new JSONObject();
        String response=contractService.updateContract(id,request);
        data.put("data",response);
        data.put("message","Contract was updated successfully");
        return new ResponseEntity<>(data,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteContract(@PathVariable String id){
        JSONObject data=new JSONObject();
        contractService.deleteContract(id);
        data.put("message","Contract was deleted successfully");
        return new ResponseEntity<>(data,HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<JSONObject> deleteContracts(@RequestBody List<String> ids) {
        JSONObject data = new JSONObject();
        contractService.deleteContracts(ids);
        data.put("message", "Contracts were deleted successfully");
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


}
