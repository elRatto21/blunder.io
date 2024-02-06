package io.blunder.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.blunder.backend.model.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, String> {

	Chat findByUser1AndUser2(String string1, String string2);

}
