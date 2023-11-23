package io.blunder.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.corundumstudio.socketio.SocketIOServer;

import io.blunder.backend.security.jwt.SocketAuthorizationListener;
import java.io.InputStream;

@Configuration
public class SocketConfig {
	
	@Value("${socketio.host}")
	private String host;
	
	@Value("${socketio.port}")
	private int port;

	@Value("${keystore.password}")
	private String keyStorePassword;

	@Value("${keystore.name}")
	private String keyStoreName;

	@Bean
	public SocketIOServer socketIOServer() {
		com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
		config.setHostname(host);
		config.setPort(port);
		config.setOrigin("*");
		config.setAuthorizationListener(new SocketAuthorizationListener());

		config.setKeyStorePassword(keyStorePassword);
		InputStream stream = getClass().getClassLoader().getResourceAsStream(keyStoreName);
		config.setKeyStore(stream);
		config.setSSLProtocol("TLS");

		return new SocketIOServer(config);
	}

}
