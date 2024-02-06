package io.blunder.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.blunder.backend.model.Chat;
import io.blunder.backend.repository.ChatRepository;

@Service
public class ChatService {
	
	@Autowired
	private ChatRepository chatRepository;
	
	public Chat findByBothUsers(String user1, String user2) {
		return this.chatRepository.findByUser1AndUser2(user1, user2);
	}
	
	public Chat save(Chat chat) {
		return this.chatRepository.save(chat);
	}

}
