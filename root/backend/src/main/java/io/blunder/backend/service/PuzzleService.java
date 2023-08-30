package io.blunder.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.blunder.backend.model.Puzzle;
import io.blunder.backend.repository.PuzzleRepository;

@Service
public class PuzzleService {

	@Autowired
	private PuzzleRepository puzzleRepo;
	
	public Puzzle getRandomPuzzle() {
		return this.puzzleRepo.getRandomPuzzle();
	}

}
