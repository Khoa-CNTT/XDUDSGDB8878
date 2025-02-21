package org.example.advancedrealestate_be.controller.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class HomeController {

    @GetMapping("/")
    private String index(){

        return "redirect:/swagger-ui/index.html";
    }

    @GetMapping("/api-docs")
    private String redirect_api(){

        return "redirect:/swagger-ui/index.html";
    }
}
