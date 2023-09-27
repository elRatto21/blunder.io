package io.blunder.backend.model;

public class MatchStats {
	
	private String id;
	
	private int players;
	
	private String time;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getPlayers() {
		return players;
	}

	public void setPlayers(int players) {
		this.players = players;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public MatchStats(String id, int players, String time) {
		super();
		this.id = id;
		this.players = players;
		this.time = time;
	}
	
	

}
