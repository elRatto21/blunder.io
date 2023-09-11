package io.blunder.backend.security.jwt;

import java.security.Key;

import com.corundumstudio.socketio.AuthorizationListener;
import com.corundumstudio.socketio.HandshakeData;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class SocketAuthorizationListener implements AuthorizationListener {

	private Key key;

	@Override
	public boolean isAuthorized(HandshakeData data) {
		String token = data.getSingleUrlParam("accessToken");
		if (isValid(token) && isLocalhost(data)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isValid(String authToken) {
		try {
			if (this.key == null) {
				key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(System.getenv("SECRET_KEY")));
			}
			Jwts.parserBuilder().setSigningKey(key).build().parse(authToken);
			return true;
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

		return false;
	}

	public boolean isLocalhost(HandshakeData data) {
		String remoteAddress = data.getAddress().getHostString();
		return "localhost".equals(remoteAddress) || "127.0.0.1".equals(remoteAddress);
	}
}
