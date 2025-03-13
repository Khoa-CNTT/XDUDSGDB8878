package org.example.advancedrealestate_be.mapper;

import org.example.advancedrealestate_be.dto.ServiceDto;
import org.example.advancedrealestate_be.entity.Service;

import java.util.Optional;

public class ServiceMapper {
    public static ServiceDto mapToService(Service service) {

        ServiceDto serviceDto = ServiceDto.builder().id(service.getId()).name(service.getName()).price(service.getPrice()).build();

        if (serviceDto != null) {

            return serviceDto;

        } else {

            System.out.println(Optional.empty());

            return null;
        }
    }
}
