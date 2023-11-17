package io.blunder.backend.model;

import java.util.ArrayList;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity(name = "game_match")
@Table(name = "game_match")
public class Match {
	
	@Id
	private String matchId;
	
	private ArrayList<String> players;
	
	private String white;
	
	private String black;
	
	private int whiteElo;
	
	private int blackElo;
	
	private String winner;
	
	private String time;
	
	@Lob
	private ArrayList<String> moves;
	
	private String date;

	public String getMatchId() {
		return matchId;
	}

	public void setMatchId(String matchId) {
		this.matchId = matchId;
	}

	public ArrayList<String> getPlayers() {
		return players;
	}

	public void setPlayers(ArrayList<String> players) {
		this.players = players;
	}

	public String getWhite() {
		return white;
	}

	public void setWhite(String white) {
		this.white = white;
	}

	public String getBlack() {
		return black;
	}

	public void setBlack(String black) {
		this.black = black;
	}

	public String getWinner() {
		return winner;
	}

	public void setWinner(String winner) {
		this.winner = winner;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public ArrayList<String> getMoves() {
		return moves;
	}

	public void setMoves(ArrayList<String> moves) {
		this.moves = moves;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public int getWhiteElo() {
		return whiteElo;
	}

	public void setWhiteElo(int whiteElo) {
		this.whiteElo = whiteElo;
	}

	public int getBlackElo() {
		return blackElo;
	}

	public void setBlackElo(int blackElo) {
		this.blackElo = blackElo;
	}

}
