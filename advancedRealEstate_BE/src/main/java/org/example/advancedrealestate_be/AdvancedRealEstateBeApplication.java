package org.example.advancedrealestate_be;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Advanced Real Estate API", version = "2.0.2", description = "Advanced Real Estate API"))
//@ComponentScan(basePackages = {
//        "org.example.advancedrealestate_be.mapper" // Exclude mapper
//})
@EnableScheduling
public class AdvancedRealEstateBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdvancedRealEstateBeApplication.class, args);

        System.out.println("running: http://localhost:9090/");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();  // Tạo Bean RestTemplate để sử dụng trong Service
    }

}
