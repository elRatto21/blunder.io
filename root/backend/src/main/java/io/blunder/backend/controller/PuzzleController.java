package io.blunder.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.blunder.backend.model.Puzzle;
import io.blunder.backend.service.PuzzleService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/puzzle")
public class PuzzleController {

	@Autowired
	private PuzzleService puzzleService;

	@CrossOrigin(origins = "*")
	@GetMapping
	public ResponseEntity<?> getRandomPuzzle() {
		Puzzle puzzle = puzzleService.getRandomPuzzle();
		return new ResponseEntity<>(puzzle, HttpStatus.OK);
	}

}