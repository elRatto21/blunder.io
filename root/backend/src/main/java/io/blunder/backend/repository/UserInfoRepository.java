package io.blunder.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.blunder.backend.model.UserInfo;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String>{
	
	Optional<UserInfo> findByUsername(String username);

}
