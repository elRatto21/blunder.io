package io.blunder.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import io.blunder.backend.model.Puzzle;

@Repository
public interface PuzzleRepository extends JpaRepository<Puzzle, String>{

	@Query(value = "SELECT * FROM puzzle ORDER BY RAND() LIMIT 1", nativeQuery = true)
	Puzzle getRandomPuzzle();
	
}
