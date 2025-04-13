package org.example.advancedrealestate_be.config;

import org.example.advancedrealestate_be.security.SecurityPermissionInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig implements WebMvcConfigurer{

    private final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/users", "/api/auth/**",
            "/api/buildings/search",
            "/api/customers/**",
            "/ws/**",
    };

    private final String[] PUBLIC_GET_ENDPOINTS = {
            "/", "/ws/**",
            "/login/**", "/oauth2/**",
            "/api-docs", "/api/auth/**",
            "/api/customers/**",
            "/api/user/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-ui.html/api/**"
    };

    private final String[] PUBLIC_PATCH_ENDPOINTS = {
            "/api/**",
    };

    private final String[] PUBLIC_DELETE_ENDPOINTS = {
            "/api/**",
    };

    private final CustomJwtDecoder customJwtDecoder;
    private final SecurityPermissionInterceptor permissionInterceptor;

    @Autowired
    public SecurityConfig(CustomJwtDecoder customJwtDecoder, SecurityPermissionInterceptor permissionInterceptor) {
        this.customJwtDecoder = customJwtDecoder;
        this.permissionInterceptor = permissionInterceptor;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // Cấu hình các endpoint công khai và yêu cầu xác thực đối với các endpoint còn lại
        httpSecurity.authorizeHttpRequests(request -> request
                .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.PATCH, PUBLIC_PATCH_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.DELETE, PUBLIC_DELETE_ENDPOINTS).permitAll()
                .anyRequest().authenticated() // Tất cả các request còn lại yêu cầu xác thực
        );

        // Cấu hình OAuth2 resource server sử dụng JWT cho xác thực
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                .decoder(customJwtDecoder)
                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );

        // Tắt CSRF và cấu hình CORS
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        httpSecurity.cors(cors -> corsConfigurationSource());

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép tất cả các origin
//        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://example.com", "https://advanced-real-estate-fe.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("X-Auth-Token"));

        // Không cho phép gửi thông tin xác thực (credentials)
        configuration.setAllowCredentials(true);

        // Thời gian tối đa (in seconds) mà kết quả CORS sẽ được cache lại
        configuration.setMaxAge(3600L);

        // Đăng ký cấu hình CORS cho tất cả các endpoint
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(permissionInterceptor);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public WebMvcConfigurer corsConfig() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }


}
