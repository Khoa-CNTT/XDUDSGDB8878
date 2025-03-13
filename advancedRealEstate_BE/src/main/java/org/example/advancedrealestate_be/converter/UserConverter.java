package org.example.advancedrealestate_be.converter;

import org.example.advancedrealestate_be.dto.UserDto;
import org.example.advancedrealestate_be.entity.User; // Make sure to use your entity
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserConverter {
    @Autowired
    private ModelMapper modelMapper;

    public UserDto convertToDto(User entity) {
        return modelMapper.map(entity, UserDto.class);
    }

    public User convertToEntity(UserDto dto) {
        return modelMapper.map(dto, User.class);
    }

    public List<UserDto> toDtoList(List<User> users) {
        return users.stream()
                .map(this::convertToDto) // Use the existing method to convert each User to UserDto
                .collect(Collectors.toList());
    }
}
