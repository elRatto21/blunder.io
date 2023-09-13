package io.blunder.backend.helper;

import java.util.ArrayList;
import java.util.Random;
import java.util.stream.Collectors;

import io.blunder.backend.model.Match;
import io.blunder.backend.model.UserInfo;

public class MatchHelper {

	private static Random rdm = new Random();

	public static boolean isFull(Match match) {
		return match.getPlayers().size() == 2;
	}

	public static Match join(Match match, String player) {
		if (match.getPlayers() == null) {
			match.setPlayers(new ArrayList<String>());
		}
		ArrayList<String> players = match.getPlayers();
		players.add(player);
		match.setPlayers(players);
		return match;
	}

	public static Match setSides(Match match) {
		int chooser = rdm.nextInt(0, 2);
		if (chooser == 0) {
			match.setWhite(match.getPlayers().get(0));
			match.setBlack(match.getPlayers().get(1));
		} else {
			match.setWhite(match.getPlayers().get(1));
			match.setBlack(match.getPlayers().get(0));
		}
		return match;
	}

	public static Match setWinner(Match match, String winner) {
		match.setWinner(winner);
		return match;
	}

	public static String generateHexID(String time) {
		String prefix = switch (time) {
		case "Bullet" -> "1B";
		case "Blitz" -> "3B";
		case "Rapid" -> "1R";
		default -> "";
		};

		String chars = "012345ABCDEFGH";
		Random rand = new Random();
		String id = rand.ints(5, 0, chars.length()).mapToObj(i -> String.valueOf(chars.charAt(i)))
				.collect(Collectors.joining());
		return prefix + id;
	}

	public static int[] calculateElo(UserInfo winner, UserInfo looser, String time) {
		float elo1 = 0;
		float elo2 = 0;
		int K = 20;

		switch (time) {
		case "Bullet":
			elo1 = winner.getBulletElo();
			elo2 = looser.getBulletElo();
			break;
		case "Blitz":
			elo1 = winner.getBlitzElo();
			elo2 = looser.getBlitzElo();
			break;
		case "Rapid":
			elo1 = winner.getRapidElo();
			elo2 = looser.getRapidElo();
		}

		float propability2 = 1.0f * 1.0f / (1 + 1.0f * (float) (Math.pow(10, 1.0f * (elo1 - elo2) / 400)));

		float propability1 = 1.0f * 1.0f / (1 + 1.0f * (float) (Math.pow(10, 1.0f * (elo2 - elo1) / 400)));

		elo1 = elo1 + K * (1 - propability1);
		elo2 = elo2 + K * (0 - propability2);

		int[] elos = new int[2];
		elos[0] = Long.valueOf(Math.round(Math.round(elo1 * 1000000.0) / 1000000.0)).intValue();
		elos[1] = Long.valueOf(Math.round(Math.round(elo2 * 1000000.0) / 1000000.0)).intValue();
		System.out.println(elos[0] + " " + elos[1]);
		return elos;
	}
}
