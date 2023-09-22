package io.blunder.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.corundumstudio.socketio.SocketIOServer;

import io.blunder.backend.security.jwt.SocketAuthorizationListener;

@Configuration
public class SocketConfig {
	
	@Value("${socketio.host}")
	private String host;
	
	@Value("${socketio.port}")
	private int port;
	
	@Bean
	public SocketIOServer socketIOServer() {
		com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
		config.setHostname(host);
		config.setPort(port);
		config.setOrigin("*");
		config.setAuthorizationListener(new SocketAuthorizationListener());
		
		return new SocketIOServer(config);
	}

}
