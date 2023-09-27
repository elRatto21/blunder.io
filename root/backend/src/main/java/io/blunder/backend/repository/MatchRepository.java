package io.blunder.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import io.blunder.backend.model.Match;
import jakarta.persistence.Table;

@Repository
@Table(name = "game_match")
public interface MatchRepository extends JpaRepository<Match, String> {

	@Query("SELECT m FROM game_match m WHERE m.white = :player OR m.black = :player")
	List<Match> findMatchesByPlayer(String player);
	
	@Query("DELETE FROM game_match m WHERE m.white = :player OR m.black = :player")
	void deleteMatchesByPlayer(String player);

}
