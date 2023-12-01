package io.blunder.backend.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Embeddable
public class Friend {
	
	private String username;
	
	private boolean online;
	
	private boolean accepted;
	
	private boolean sender;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isOnline() {
		return online;
	}

	public void setOnline(boolean online) {
		this.online = online;
	}

	public boolean isAccepted() {
		return accepted;
	}

	public void setAccepted(boolean accepted) {
		this.accepted = accepted;
	}
	
	public boolean isSender() {
		return sender;
	}
	
	public void setSender(boolean sender) {
		this.sender = sender;
	}
	
	public Friend(String username, boolean accepted, boolean sender) {
		this.username = username;
		this.accepted = accepted;
		this.sender = sender;
	}
	
	public Friend() {
		
	}

}
