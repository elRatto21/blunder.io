package io.blunder.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOServer;

import io.blunder.backend.helper.MatchHelper;
import io.blunder.backend.model.Match;
import io.blunder.backend.model.Puzzle;
import io.blunder.backend.model.UserInfo;
import io.blunder.backend.repository.MatchRepository;
import io.blunder.backend.security.jwt.JwtUtils;

@Service
public class SocketService implements InitializingBean {

	private Logger LOG = LoggerFactory.getLogger(SocketService.class);

	private Map<String, Match> matches = new ConcurrentHashMap<>();

	private Map<UUID, String> playersBySessionId = new ConcurrentHashMap<>();

	private Map<String, UUID> playersByUsername = new ConcurrentHashMap<>();

	private Map<UUID, String> playersRooms = new ConcurrentHashMap<>();

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private SocketIOServer socketIoServer;

	@Autowired
	private MatchRepository matchRepo;
	
	@Autowired
	private UserInfoService userInfoService;
	
	@Autowired
	private PuzzleService puzzleService;

	@Override
	public void afterPropertiesSet() throws Exception {
		socketIoServer.addConnectListener(client -> {
			String jwt = client.getHandshakeData().getSingleUrlParam("accessToken");
			String username = jwtUtils.getUserNameFromJwtToken(jwt);
			LOG.info("Connected: {} with username {}", client.getSessionId(), username);
			playersBySessionId.put(client.getSessionId(), username);
			playersByUsername.put(username, client.getSessionId());
		});

		socketIoServer.addDisconnectListener(client -> {
			LOG.info("Disconnected: {}", client.getSessionId());

			client.leaveRooms(client.getAllRooms());

			String roomId = playersRooms.get(client.getSessionId());
			try {
				if (matches.get(roomId).getPlayers().size() == 1) {
					matches.remove(roomId);
				} else {
					Match m = matches.get(roomId);
					ArrayList<String> players = m.getPlayers();
					if (players.get(0).equals(playersBySessionId.get(client.getSessionId()))) {
						players.remove(0);
					} else {
						players.remove(1);
					}
					m.setPlayers(players);
					updateMatch(m);
				}
				if (matches.get(roomId).getBlack() != null) {
					socketIoServer.getRoomOperations(roomId).sendEvent("match-abort");
				}
			} catch (Exception e) {
				// Nothing 😎🤙
			}

			playersByUsername.remove(playersBySessionId.get(client.getSessionId()));
			playersBySessionId.remove(client.getSessionId());
			playersRooms.remove(client.getSessionId());
		});

		socketIoServer.addEventListener("join-room", String.class, (client, roomId, ackRequest) -> {
			try {
				Match match = getMatchById(roomId);

				LOG.info("{} joined room {}", client.getSessionId(), roomId);

				match = MatchHelper.join(match, playersBySessionId.get(client.getSessionId()));
				client.joinRoom(roomId);
				playersRooms.put(client.getSessionId(), roomId);
				socketIoServer.getClient(client.getSessionId()).sendEvent("room-stats", MatchHelper.isFull(match));
				if (MatchHelper.isFull(match)) {
					socketIoServer.getRoomOperations(roomId).sendEvent("room-stats", MatchHelper.isFull(match));
					match = MatchHelper.setSides(match);

					UUID white = playersByUsername.get(match.getWhite());
					UUID black = playersByUsername.get(match.getBlack());

					socketIoServer.getClient(white).sendEvent("side", "white");
					socketIoServer.getClient(black).sendEvent("side", "black");
				}
				updateMatch(match);
			} catch (Exception e) {
				LOG.warn("{} tried to join non existing match {}", client.getSessionId(), roomId);
				socketIoServer.getClient(client.getSessionId()).sendEvent("not-found");
			}
		});

		socketIoServer.addEventListener("match-move", String.class, (client, payload, ackRequest) -> {
			String moveBy = playersBySessionId.get(client.getSessionId());
			Match match = matches.get(payload.split(";")[0]);
			String move = payload.split(";")[1];
			ArrayList<String> moves = match.getMoves();
			moves.add(payload.split(";")[2]);
			match.setMoves(moves);
			updateMatch(match);
			if (match.getWhite().equals(moveBy)) {
				UUID receiver = playersByUsername.get(match.getBlack());
				socketIoServer.getClient(receiver).sendEvent("match-move", move);
			} else {
				UUID receiver = playersByUsername.get(match.getWhite());
				socketIoServer.getClient(receiver).sendEvent("match-move", move);
			}
			LOG.info("Move {} made by {} with SessionId {} in room {}", move, moveBy, client.getSessionId(),
					payload.split(";")[0]);
		});
		
		socketIoServer.addEventListener("match-time", String.class, (client, payload, ackRequest) -> {
			String winner = playersBySessionId.get(client.getSessionId());

			Match match = matches.get(payload.split(";")[0]);
			match.setWinner(winner);
			match.setDate(LocalDateTime.now().toString());
			
			updateMatch(match);
			
			UserInfo winnerInfo = userInfoService.getUserByUsername(winner).orElseThrow();
			
			UUID looser;
			String looserName;
			if(winner.equals(match.getWhite())) {
				looser = playersByUsername.get(match.getBlack());
				looserName = match.getBlack();
			} else {
				looser = playersByUsername.get(match.getWhite());
				looserName = match.getWhite();
			}
			
			UserInfo looserInfo = userInfoService.getUserByUsername(looserName).orElseThrow();
			
			socketIoServer.getClient(looser).sendEvent("match-time", payload.split(";")[1]);
			socketIoServer.getClient(looser).leaveRooms(socketIoServer.getClient(looser).getAllRooms());
			socketIoServer.getClient(client.getSessionId()).leaveRooms(socketIoServer.getClient(client.getSessionId()).getAllRooms());
			
			winnerInfo.setMatches(winnerInfo.getMatches() + 1);
			winnerInfo.setWins(winnerInfo.getWins() + 1);
			
			looserInfo.setMatches(looserInfo.getMatches() + 1);
			looserInfo.setLosses(looserInfo.getLosses() + 1);
			
			int[] elos = MatchHelper.calculateElo(winnerInfo, looserInfo, match.getTime());
			
			int whiteElo = 0;
			int blackElo = 0;
			
			switch(match.getTime()) {
			case "Bullet":
				if(winnerInfo.getUsername().equals(match.getWhite())) {
					whiteElo = elos[0] - winnerInfo.getBulletElo();
					blackElo = looserInfo.getBulletElo() - elos[1];
				} else {
					blackElo = elos[0] - winnerInfo.getBulletElo();
					whiteElo = looserInfo.getBulletElo() - elos[1];
				}
				
				winnerInfo.setBulletElo(elos[0]);
				looserInfo.setBulletElo(elos[1]);
				break;
			case "Blitz":
				if(winnerInfo.getUsername().equals(match.getWhite())) {
					whiteElo = elos[0] - winnerInfo.getBlitzElo();
					blackElo = looserInfo.getBlitzElo() - elos[1];
				} else {
					blackElo = elos[0] - winnerInfo.getBlitzElo();
					whiteElo = looserInfo.getBlitzElo() - elos[1];
				}
				
				winnerInfo.setBlitzElo(elos[0]);
				looserInfo.setBlitzElo(elos[1]);
				break;
			case "Rapid":
				if(winnerInfo.getUsername().equals(match.getWhite())) {
					whiteElo = elos[0] - winnerInfo.getRapidElo();
					blackElo = looserInfo.getRapidElo() - elos[1];
				} else {
					blackElo = elos[0] - winnerInfo.getRapidElo();
					whiteElo = looserInfo.getRapidElo() - elos[1];
				}
				
				winnerInfo.setRapidElo(elos[0]);
				looserInfo.setRapidElo(elos[1]);
				break;
			}
			
			userInfoService.save(winnerInfo);
			userInfoService.save(looserInfo);
			
			match.setWhiteElo(whiteElo);
			match.setBlackElo(blackElo);
			
			matchRepo.save(match);
			
			LOG.info("Match finished");
		});

		socketIoServer.addEventListener("match-mate", String.class, (client, payload, ackRequest) -> {
			String winner = playersBySessionId.get(client.getSessionId());

			Match match = matches.get(payload.split(";")[0]);
			match.setWinner(winner);
			match.setDate(LocalDateTime.now().toString());
			
			updateMatch(match);
			
			UserInfo winnerInfo = userInfoService.getUserByUsername(winner).orElseThrow();
			
			UUID looser;
			String looserName;
			if(winner.equals(match.getWhite())) {
				looser = playersByUsername.get(match.getBlack());
				looserName = match.getBlack();
			} else {
				looser = playersByUsername.get(match.getWhite());
				looserName = match.getWhite();
			}
			
			UserInfo looserInfo = userInfoService.getUserByUsername(looserName).orElseThrow();
			
			socketIoServer.getClient(looser).sendEvent("match-mate", payload.split(";")[1]);
			socketIoServer.getClient(looser).leaveRooms(socketIoServer.getClient(looser).getAllRooms());
			socketIoServer.getClient(client.getSessionId()).leaveRooms(socketIoServer.getClient(client.getSessionId()).getAllRooms());
			
			winnerInfo.setMatches(winnerInfo.getMatches() + 1);
			winnerInfo.setWins(winnerInfo.getWins() + 1);
			
			looserInfo.setMatches(looserInfo.getMatches() + 1);
			looserInfo.setLosses(looserInfo.getLosses() + 1);
			
			int[] elos = MatchHelper.calculateElo(winnerInfo, looserInfo, match.getTime());
			
			int whiteElo = 0;
			int blackElo = 0;
			
			switch(match.getTime()) {
			case "Bullet":
				if(winnerInfo.getUsername().equals(match.getWhite())) {
					whiteElo = elos[0] - winnerInfo.getBulletElo();
					blackElo = looserInfo.getBulletElo() - elos[1];
				} else {
					blackElo = elos[0] - winnerInfo.getBulletElo();
					whiteElo = looserInfo.getBulletElo() - elos[1];
				}
				
				winnerInfo.setBulletElo(elos[0]);
				looserInfo.setBulletElo(elos[1]);
				break;
			case "Blitz":
				if(winnerInfo.getUsername().equals(match.getWhite())) {
					whiteElo = elos[0] - winnerInfo.getBlitzElo();
					blackElo = looserInfo.getBlitzElo() - elos[1];
				} else {
					blackElo = elos[0] - winnerInfo.getBlitzElo();
					whiteElo = looserInfo.getBlitzElo() - elos[1];
				}
				
				winnerInfo.setBlitzElo(elos[0]);
				looserInfo.setBlitzElo(elos[1]);
				break;
			case "Rapid":
				if(winnerInfo.getUsername().equals(match.getWhite())) {
					whiteElo = elos[0] - winnerInfo.getRapidElo();
					blackElo = looserInfo.getRapidElo() - elos[1];
				} else {
					blackElo = elos[0] - winnerInfo.getRapidElo();
					whiteElo = looserInfo.getRapidElo() - elos[1];
				}
				
				winnerInfo.setRapidElo(elos[0]);
				looserInfo.setRapidElo(elos[1]);
				break;
			}
			
			userInfoService.save(winnerInfo);
			userInfoService.save(looserInfo);
			
			match.setWhiteElo(whiteElo);
			match.setBlackElo(blackElo);
			
			matchRepo.save(match);
			
			LOG.info("Match finished");
		});
		
		socketIoServer.addEventListener("match-draw", String.class, (client, payload, ackRequest) -> {
			String winner = playersBySessionId.get(client.getSessionId());

			Match match = matches.get(payload.split(";")[0]);
			match.setWinner(winner);
			match.setDate(LocalDateTime.now().toString());
			
			updateMatch(match);
			
			UserInfo winnerInfo = userInfoService.getUserByUsername(winner).orElseThrow();
			
			UUID looser;
			String looserName;
			if(winner.equals(match.getWhite())) {
				looser = playersByUsername.get(match.getBlack());
				looserName = match.getBlack();
			} else {
				looser = playersByUsername.get(match.getWhite());
				looserName = match.getWhite();
			}
			
			UserInfo looserInfo = userInfoService.getUserByUsername(looserName).orElseThrow();
			
			socketIoServer.getClient(looser).sendEvent("match-draw", payload.split(";")[1]);
			socketIoServer.getClient(looser).leaveRooms(socketIoServer.getClient(looser).getAllRooms());
			socketIoServer.getClient(client.getSessionId()).leaveRooms(socketIoServer.getClient(client.getSessionId()).getAllRooms());
			
			winnerInfo.setMatches(winnerInfo.getMatches() + 1);
			winnerInfo.setDraws(winnerInfo.getDraws() + 1);
			
			looserInfo.setMatches(looserInfo.getMatches() + 1);
			looserInfo.setDraws(looserInfo.getDraws() + 1);
			
			userInfoService.save(winnerInfo);
			userInfoService.save(looserInfo);
			
			match.setWhiteElo(0);
			match.setBlackElo(0);
			
			matchRepo.save(match);
			
			LOG.info("Match finished");
		});
		
		socketIoServer.addEventListener("puzzle-finish", String.class, (client, payload, ackRequest) -> {
			int elo = Integer.parseInt(payload);
			String username = playersBySessionId.get(client.getSessionId());
			UserInfo userInfo = this.userInfoService.getUserByUsername(username).orElseThrow();
			
			userInfo.setPuzzleElo(userInfo.getPuzzleElo() + elo);
			this.userInfoService.save(userInfo);
		});
		
		socketIoServer.addEventListener("global-chat", String.class, (client, payload, ackRequest) -> {
			socketIoServer.getBroadcastOperations().sendEvent("global-chat", payload);
		});
		
		socketIoServer.addEventListener("game-chat", String.class, (client, payload, ackRequest) -> {
			String roomId = playersRooms.get(client.getSessionId());
			socketIoServer.getRoomOperations(roomId).sendEvent("game-chat", payload);
		});

		socketIoServer.start();
	}

	public Match getMatchById(String roomId) {
		return this.matches.get(roomId);
	}

	public void updateMatch(Match match) {
		matches.put(match.getMatchId(), match);
	}

	public Map<String, Match> getMatches() {
		return this.matches;
	}
	
	public int getPlayerCount() {
		return socketIoServer.getAllClients().size();
	}
}
