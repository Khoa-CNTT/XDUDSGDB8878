package org.example.advancedrealestate_be.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.modelmapper.ModelMapper;
@Configuration
@ComponentScan(basePackages = "org.example.advancedrealestate_be.config")
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
