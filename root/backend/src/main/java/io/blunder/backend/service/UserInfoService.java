package io.blunder.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.blunder.backend.model.UserInfo;
import io.blunder.backend.repository.UserInfoRepository;
import jakarta.transaction.Transactional;

@Service
public class UserInfoService {

	@Autowired
	private UserInfoRepository userRepo;
	
	public Optional<UserInfo> getUserByUsername(String username) {
		return userRepo.findByUsername(username);
	}
	
	@Transactional
	public UserInfo save(UserInfo userDetails) {
		return userRepo.save(userDetails);
	}
	
}
