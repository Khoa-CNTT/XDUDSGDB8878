package org.example.advancedrealestate_be.repository;

import org.example.advancedrealestate_be.entity.Map;
import org.example.advancedrealestate_be.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,String> {

    List<Message> findMessagesBySenderId(String senderId);

    List<Message> findMessagesBySenderIdAndRoomName(String senderId, String roomName);
    List<Message> findMessagesBySenderIdAndRecipientId(String senderId, String recipientId);
    List<Message> findMessagesByRoomName(String roomName);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :userId AND m.recipient.id = :partnerId) " +
            "OR (m.sender.id = :partnerId AND m.recipient.id = :userId) " +
            "ORDER BY m.createdOn ASC")
    List<Message> findMessagesBetweenUsers(@Param("userId") String userId, @Param("partnerId") String partnerId);
}
