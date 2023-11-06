package io.blunder.backend.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.blunder.backend.helper.MatchHelper;
import io.blunder.backend.model.Match;
import io.blunder.backend.model.MatchStats;
import io.blunder.backend.service.MatchService;
import io.blunder.backend.service.SocketService;

/**
 * Endpoints for online game functionality
 * 
 * @author trappn
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api/game")
public class MatchController {
	
	private final static Logger LOG = LoggerFactory.getLogger(MatchController.class);

	@Autowired
	private SocketService gameService;
	
	@Autowired
	private MatchService matchService;

	@PostMapping("/join/{time}")
	public ResponseEntity<String> postJoinRoom(@PathVariable String time) {
		System.out.println(time);
		String roomId = MatchHelper.generateHexID(time);
		if (gameService.getMatchById(roomId) == null) {
			Match match = new Match();
			match.setMatchId(roomId);
			match.setTime(time);
			match.setMoves(new ArrayList<String>());
			match.setPlayers(new ArrayList<String>());
			match.setMatchId(roomId);
			gameService.updateMatch(match);
		}
		LOG.debug("Room with id {} and time {} created", roomId, time);
		return new ResponseEntity<>(roomId, HttpStatus.OK);
	}
	
	@GetMapping("/{roomId}/stats")
	public ResponseEntity<?> getRoomStatsById(@PathVariable String roomId) {
		if(gameService.getMatchById(roomId).getPlayers().size() == 2) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		} else {
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}

	@GetMapping("/stats")
	public ResponseEntity<?> getRoomStats() {
		try {
			Map<String, Match> matches = gameService.getMatches();
			List<MatchStats> allMatchStats = new ArrayList<>();
			for (Map.Entry<String, Match> entry : matches.entrySet()) {
				allMatchStats.add(new MatchStats(entry.getKey(), entry.getValue().getPlayers().size(),
						entry.getValue().getTime()));
			}
			return new ResponseEntity<>(allMatchStats, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/players")
	public ResponseEntity<?> getPlayerCount() {
		return new ResponseEntity<>(gameService.getPlayerCount(), HttpStatus.OK);
	}
	
	@GetMapping("/matches/{username}")
	public ResponseEntity<?> getPlayerMatches(@PathVariable String username) {
		List<Match> matches = matchService.getMatchesByPlayer(username);
		Collections.sort(matches, new Comparator<Match>() {
			public int compare(Match m1, Match m2) {
				return LocalDateTime.parse(m2.getDate()).compareTo(LocalDateTime.parse(m1.getDate()));
			}
		});
		return new ResponseEntity<>(matches, HttpStatus.OK);
	}

}
