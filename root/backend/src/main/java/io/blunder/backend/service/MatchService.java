package io.blunder.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.blunder.backend.repository.MatchRepository;
import io.blunder.backend.model.Match;

@Service
public class MatchService {
	
	@Autowired
	MatchRepository matchRepository;
	
	public List<Match> getMatchesByPlayer(String username) {
		return this.matchRepository.findMatchesByPlayer(username);
	}
	
	public void deleteMatchesByPlayer(String username) {
		this.matchRepository.deleteMatchesByPlayer(username);
	}

}
