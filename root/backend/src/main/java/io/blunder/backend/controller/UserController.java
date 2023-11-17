package io.blunder.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.blunder.backend.model.User;
import io.blunder.backend.model.UserInfo;
import io.blunder.backend.repository.UserRepository;
import io.blunder.backend.service.MatchService;
import io.blunder.backend.service.UserInfoService;

/**
 * Endpoints to get/update user details
 * 
 * @author trappn
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	UserInfoService userDetailsService;
	
	@Autowired
	MatchService matchService;

	@GetMapping("/{username}")
	public ResponseEntity<?> getUserDetails(@PathVariable("username") String username) throws Exception {
		try {
			Optional<UserInfo> udOpt = userDetailsService.getUserByUsername(username);
			UserInfo userDetails = udOpt.orElseThrow(() -> new Exception());
			return new ResponseEntity<UserInfo>(userDetails, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(String.format("No user with id %s found", username), HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/clear/{username}")
	public ResponseEntity<?> clearMatches(@PathVariable String username) {
		UserInfo us = userDetailsService.getUserByUsername(username).orElseThrow();
		us.setMatches(0);
		us.setWins(0);
		us.setLosses(0);
		us.setDraws(0);
		us.setBulletElo(500);
		us.setBlitzElo(500);
		us.setRapidElo(500);
		userDetailsService.save(us);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
