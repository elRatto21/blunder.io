package io.blunder.backend.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.blunder.backend.model.ERole;
import io.blunder.backend.model.Role;
import io.blunder.backend.model.User;
import io.blunder.backend.model.UserInfo;
import io.blunder.backend.payload.request.LoginRequest;
import io.blunder.backend.payload.request.SignupRequest;
import io.blunder.backend.payload.response.JwtResponse;
import io.blunder.backend.repository.RoleRepository;
import io.blunder.backend.repository.UserRepository;
import io.blunder.backend.security.jwt.JwtUtils;
import io.blunder.backend.security.service.UserDetailsImpl;
import io.blunder.backend.service.UserInfoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;
	
	@Autowired
	UserInfoService userDetailsService;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtToken(authentication);

			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
					.collect(Collectors.toList());

			LOG.info(String.format("User %s with username %s logged in", userDetails.getId(),
					userDetails.getUsername()));

			JwtResponse response = new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
					userDetails.getEmail(), roles);
			return new ResponseEntity<JwtResponse>(response, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>("Wrong credentials", HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		LOG.info("Tried to register user with: username={} email={}", signUpRequest.getUsername(), signUpRequest.getEmail());
		try {
			if (userRepository.existsByUsername(signUpRequest.getUsername())) {
				return new ResponseEntity<String>("Username is already in use", HttpStatus.CONFLICT);
			}

			if (userRepository.existsByEmail(signUpRequest.getEmail())) {
				return new ResponseEntity<String>("Email is already in use", HttpStatus.CONFLICT);
			}

			User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
					encoder.encode(signUpRequest.getPassword()));

			Set<Role> roles = new HashSet<>();
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role 'ROLE_USER' not found."));
			roles.add(userRole);

			user.setRoles(roles);
			user = userRepository.save(user);
			
			UserInfo userInfo = new UserInfo();
			userInfo.setUsername(user.getUsername());
			userInfo.setUserId(user.getId());
			userInfo.setBulletElo(500);
			userInfo.setBlitzElo(500);
			userInfo.setRapidElo(500);
			userInfo.setPuzzleElo(1000);
			userInfo.setMatches(0);
			userInfo.setWins(0);
			userInfo.setLosses(0);
			userInfo.setDraws(0);
			userInfo.setFriends(new ArrayList<String>());
			userDetailsService.save(userInfo);
			
			LOG.info(String.format("User with id %s registered", user.getId()));

			return new ResponseEntity<String>("User registered successfully", HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>("Failed to sign up", HttpStatus.BAD_REQUEST);
		}
	}
}
