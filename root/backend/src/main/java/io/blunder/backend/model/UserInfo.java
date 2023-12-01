package io.blunder.backend.model;

import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@OnDelete(action = OnDeleteAction.CASCADE)
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
	
	private int matches;
	
	private int wins;
	
	private int losses;
	
	private int draws;

	@Lob
	@ElementCollection
    @Embedded
	private List<Friend> friends;

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

	public List<Friend> getFriends() {
		return friends;
	}

	public void setFriends(List<Friend> friends) {
		this.friends = friends;
	}

	public int getMatches() {
		return matches;
	}

	public void setMatches(int matches) {
		this.matches = matches;
	}

	public int getWins() {
		return wins;
	}

	public void setWins(int wins) {
		this.wins = wins;
	}

	public int getLosses() {
		return losses;
	}

	public void setLosses(int losses) {
		this.losses = losses;
	}

	public int getDraws() {
		return draws;
	}

	public void setDraws(int draws) {
		this.draws = draws;
	}

}
