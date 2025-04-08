package org.example.advancedrealestate_be.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

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

    @GetMapping("/login")
    private String login(){

        return "redirect:/oauth2/authorization/google";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, null);

        return "redirect:https://accounts.google.com/Logout";
    }

}
