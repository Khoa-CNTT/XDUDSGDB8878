package org.example.advancedrealestate_be.service.handler;

import org.example.advancedrealestate_be.dto.RoomChatDto;
import org.example.advancedrealestate_be.entity.RoomChat;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.mapper.RoomChatMapper;
import org.example.advancedrealestate_be.repository.RoomChatRepository;
import org.example.advancedrealestate_be.service.RoomChatService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomChatHandler implements RoomChatService {
    RoomChatRepository roomChatRepository;
    private final ModelMapper modelMapper;


    @Autowired
    public RoomChatHandler(RoomChatRepository roomChatRepository, ModelMapper modelMapper) {
        this.roomChatRepository = roomChatRepository;
        this.modelMapper = modelMapper;
    }


//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Override
    public RoomChatDto create(RoomChatDto roomChatDtoRequest) {
        RoomChat roomChat = new RoomChat();
        roomChat.setName(roomChatDtoRequest.getName());
        roomChat.setDescription(roomChatDtoRequest.getDescription());
        RoomChat roomChatNew = roomChatRepository.save(roomChat);
        return new RoomChatDto(
            roomChatNew.getId(),
            roomChatNew.getName(),
            roomChatNew.getDescription(),
            null,
                null
        );
    }

    @Override
    public List<RoomChatDto> findAll() {
        List<RoomChat> roomChatList = roomChatRepository.findAll();
        return roomChatList.stream()
            .map(RoomChatMapper::mapToRoomChatDto)
            .collect(Collectors.toList());
    }


    @Override
    public RoomChatDto findById(String id) {
        RoomChat roomChat = roomChatRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return new RoomChatDto(
            roomChat.getId(),
            roomChat.getName(),
            roomChat.getDescription(),
            roomChat.getImage(),
            roomChat.getFile_type()
        );
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Override
    public RoomChatDto updateById(String id, RoomChatDto roomChatDtoRequest) {
        RoomChat roomChat = roomChatRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomChat.setName(roomChatDtoRequest.getName());
        roomChat.setDescription(roomChatDtoRequest.getDescription());
        RoomChat roomChatUpdate = roomChatRepository.save(roomChat);
        return new RoomChatDto(
            roomChatUpdate.getId(),
            roomChatUpdate.getName(),
            roomChatUpdate.getDescription(),
        null,
        null
        );
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Override
    public RoomChatDto deleteById(String id) {
        RoomChat roomChat = roomChatRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomChatRepository.delete(roomChat);
        return new RoomChatDto(
            roomChat.getId(),
            roomChat.getName(),
            roomChat.getDescription(),
                null,
                null
        );
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Override
    public RoomChatDto uploadImage(String id, MultipartFile imageFile) throws IOException {
        RoomChat roomChat = roomChatRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomChat.setImage(imageFile.getBytes());
        roomChat.setFile_type(imageFile.getContentType());
        RoomChat roomChatUpLoad = roomChatRepository.save(roomChat);
        return new RoomChatDto(
                roomChatUpLoad.getId(),
                roomChatUpLoad.getName(),
                roomChatUpLoad.getDescription(),
                null,
                roomChatUpLoad.getFile_type()
        );
    }
}
