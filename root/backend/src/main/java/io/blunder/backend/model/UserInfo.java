package io.blunder.backend.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class UserInfo {

	@Id
	@NotNull
	@NotBlank
	private String username;

	private Long userId;

	private String bio;

	private int bulletElo;

	private int blitzElo;

	private int rapidElo;

	private int puzzleElo;

	private List<Long> matches;

	private List<String> friends;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public int getBulletElo() {
		return bulletElo;
	}

	public void setBulletElo(int bulletElo) {
		this.bulletElo = bulletElo;
	}

	public int getBlitzElo() {
		return blitzElo;
	}

	public void setBlitzElo(int blitzElo) {
		this.blitzElo = blitzElo;
	}

	public int getRapidElo() {
		return rapidElo;
	}

	public void setRapidElo(int rapidElo) {
		this.rapidElo = rapidElo;
	}

	public int getPuzzleElo() {
		return puzzleElo;
	}

	public void setPuzzleElo(int puzzleElo) {
		this.puzzleElo = puzzleElo;
	}

	public List<Long> getMatches() {
		return matches;
	}

	public void setMatches(List<Long> matches) {
		this.matches = matches;
	}

	public List<String> getFriends() {
		return friends;
	}

	public void setFriends(List<String> friends) {
		this.friends = friends;
	}

}
