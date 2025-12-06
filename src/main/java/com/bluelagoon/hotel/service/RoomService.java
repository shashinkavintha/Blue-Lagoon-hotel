package com.bluelagoon.hotel.service;

import com.bluelagoon.hotel.entity.Room;
import com.bluelagoon.hotel.entity.RoomPhoto;
import com.bluelagoon.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final FileStorageService fileStorageService;

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room updateRoom(Long id, Room roomDetails) {
        Room room = getRoomById(id);
        room.setRoomType(roomDetails.getRoomType());
        room.setPricePerNight(roomDetails.getPricePerNight());
        room.setMaxGuests(roomDetails.getMaxGuests());
        room.setDescription(roomDetails.getDescription());
        room.setFacilities(roomDetails.getFacilities());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public Room saveRoomPhoto(Long roomId, MultipartFile file) {
        Room room = getRoomById(roomId);
        String fileName = fileStorageService.saveFile(file);
        // Assuming the app allows accessing uploads via /uploads/{fileName}
        String fileUrl = fileName;

        RoomPhoto photo = RoomPhoto.builder()
                .url(fileUrl)
                .room(room)
                .build();
        room.addPhoto(photo);
        return roomRepository.save(room);
    }

    public List<Room> searchRooms(String roomType, BigDecimal minPrice, BigDecimal maxPrice, Integer maxGuests) {
        return roomRepository.findAvailableRooms(roomType, minPrice, maxPrice, maxGuests);
    }
}
