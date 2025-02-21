package org.example.advancedrealestate_be.service;

import net.minidev.json.JSONObject;
import org.example.advancedrealestate_be.dto.RoomChatDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RoomChatService {

    RoomChatDto create(RoomChatDto roomChatDto);
    List<RoomChatDto> findAll();

    RoomChatDto findById(String id);

    RoomChatDto updateById(String id, RoomChatDto roomChatDto);

    RoomChatDto deleteById(String id);

    RoomChatDto uploadImage(String id, MultipartFile imageFile) throws IOException;
}
