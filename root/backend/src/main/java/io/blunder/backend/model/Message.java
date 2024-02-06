package io.blunder.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Message {
	
	private String sender;
	
	private String content;

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Message(String sender, String content) {
		this.sender = sender;
		this.content = content;
	}

	
}
