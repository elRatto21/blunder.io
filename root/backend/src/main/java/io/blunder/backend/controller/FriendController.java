package io.blunder.backend.controller;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.blunder.backend.model.Chat;
import io.blunder.backend.model.Friend;
import io.blunder.backend.model.Message;
import io.blunder.backend.model.UserInfo;
import io.blunder.backend.security.jwt.JwtUtils;
import io.blunder.backend.service.ChatService;
import io.blunder.backend.service.SocketService;
import io.blunder.backend.service.UserInfoService;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/friends")
public class FriendController {

	@Autowired
	SocketService socketService;

	@Autowired
	UserInfoService userInfoService;
	
	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	ChatService chatService;

	@GetMapping()
	public ResponseEntity<?> getFriends(@RequestParam(name = "username", required = true) String username) {
		UserInfo user = this.userInfoService.getUserByUsername(username).orElseThrow();
		List<Friend> friendList = user.getFriends();

		List<Friend> filteredFriends = new ArrayList<Friend>();
		for (Friend f : friendList) {
			if (f.isAccepted() == true) {
				filteredFriends.add(f);
			}
		}
		return new ResponseEntity<>(filteredFriends, HttpStatus.OK);
	}

	@GetMapping("/requests")
	public ResponseEntity<?> getRequests(@RequestParam(name = "username", required = true) String username) {
		UserInfo user = this.userInfoService.getUserByUsername(username).orElseThrow();
		List<Friend> friendList = user.getFriends();
		
		List<Friend> friendRequests = new ArrayList<Friend>();
		for (Friend f : friendList) {
			if (f.isAccepted() == false && f.isSender() == false) {
				friendRequests.add(f);
			}
		}
		return new ResponseEntity<>(friendRequests, HttpStatus.OK);
	}
	
	@PostMapping("/request/accept")
	public ResponseEntity<?> acceptRequest(@RequestParam String username, @RequestParam String friendName, HttpServletRequest request) {
		
		String jwtToken = extractTokenFromRequest(request);
		String nameFromToken = jwtUtils.getUserNameFromJwtToken(jwtToken);
		
		if(!username.equals(nameFromToken)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		
		if(username.equals(friendName)) {
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
		
		UserInfo user = userInfoService.getUserByUsername(username).orElseThrow();
		UserInfo friend = userInfoService.getUserByUsername(friendName).orElseThrow();
		
		List<Friend> userFriends = user.getFriends();
		List<Friend> friendFriends = friend.getFriends();
		
		for(Friend f : userFriends) {
			if(f.getUsername().equals(friendName)) {
				Friend newF = f;
				newF.setAccepted(true);
				userFriends.remove(f);
				userFriends.add(newF);
				user.setFriends(userFriends);
				userInfoService.save(user);
			}
		}
		
		for(Friend f : friendFriends) {
			if(f.getUsername().equals(username)) {
				Friend newF = f;
				newF.setAccepted(true);
				friendFriends.remove(f);
				friendFriends.add(newF);
				friend.setFriends(friendFriends);
				userInfoService.save(friend);
			}
		}
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PostMapping("/remove/{friendName}")
	public ResponseEntity<?> removeFriend(@PathVariable String friendName, HttpServletRequest request) {
	    String jwtToken = extractTokenFromRequest(request);
	    String username = jwtUtils.getUserNameFromJwtToken(jwtToken);

	    UserInfo user = userInfoService.getUserByUsername(username).orElseThrow();
	    UserInfo friend = userInfoService.getUserByUsername(friendName).orElseThrow();

	    List<Friend> userFriends = new ArrayList<>(user.getFriends());
	    List<Friend> friendFriends = new ArrayList<>(friend.getFriends());

	    Iterator<Friend> userIterator = userFriends.iterator();
	    while (userIterator.hasNext()) {
	        Friend f = userIterator.next();
	        if (f.getUsername().equals(friendName)) {
	            userIterator.remove();
	            user.setFriends(userFriends);
	            userInfoService.save(user);
	        }
	    }

	    Iterator<Friend> friendIterator = friendFriends.iterator();
	    while (friendIterator.hasNext()) {
	        Friend f = friendIterator.next();
	        if (f.getUsername().equals(username)) {
	            friendIterator.remove();
	            friend.setFriends(friendFriends);
	            userInfoService.save(friend);
	        }
	    }

	    return new ResponseEntity<>(HttpStatus.OK);
	}

	
	
	@PostMapping("/request/decline") 
	public ResponseEntity<?> declineRequest(@RequestParam String username, @RequestParam String friendName, HttpServletRequest request) {
		String jwtToken = extractTokenFromRequest(request);
		String nameFromToken = jwtUtils.getUserNameFromJwtToken(jwtToken);
		
		if(!username.equals(nameFromToken)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		
		if(username.equals(friendName)) {
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
		
		UserInfo user = userInfoService.getUserByUsername(username).orElseThrow();
		UserInfo friend = userInfoService.getUserByUsername(friendName).orElseThrow();
		
		List<Friend> userFriends = new ArrayList<>(user.getFriends());
	    List<Friend> friendFriends = new ArrayList<>(friend.getFriends());

	    Iterator<Friend> userIterator = userFriends.iterator();
	    while (userIterator.hasNext()) {
	        Friend f = userIterator.next();
	        if (f.getUsername().equals(friendName)) {
	            userIterator.remove();
	            user.setFriends(userFriends);
	            userInfoService.save(user);
	        }
	    }

	    Iterator<Friend> friendIterator = friendFriends.iterator();
	    while (friendIterator.hasNext()) {
	        Friend f = friendIterator.next();
	        if (f.getUsername().equals(username)) {
	            friendIterator.remove();
	            friend.setFriends(friendFriends);
	            userInfoService.save(friend);
	        }
	    }
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping()
	public ResponseEntity<?> sendRequest(@RequestParam(name = "username", required = true) String username,
			@RequestParam(name = "friendName", required = true) String friendName, HttpServletRequest request) {

		String jwtToken = extractTokenFromRequest(request);
		String nameFromToken = jwtUtils.getUserNameFromJwtToken(jwtToken);
		
		if(!username.equals(nameFromToken)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		
		if(username.equals(friendName)) {
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
		
		UserInfo user = userInfoService.getUserByUsername(username).orElseThrow();
		UserInfo friend = userInfoService.getUserByUsername(friendName).orElseThrow();

		Friend fUser = new Friend(friendName, false, true);
		Friend fFriend = new Friend(username, false, false);

		List<Friend> userFriends = user.getFriends();
		
		for(Friend f : userFriends) {
			if(f.getUsername().equals(friendName)) {
				return new ResponseEntity<>(HttpStatus.CONFLICT);
			}
		}
		
		userFriends.add(fUser);
		user.setFriends(userFriends);

		List<Friend> friendFriends = friend.getFriends();
		friendFriends.add(fFriend);
		friend.setFriends(friendFriends);

		userInfoService.save(user);
		userInfoService.save(friend);

		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("/chat")
	public ResponseEntity<?> getChat(@RequestParam String username, @RequestParam String friendName) {
		Chat search1 = this.chatService.findByBothUsers(username, friendName);
		Chat search2 = this.chatService.findByBothUsers(friendName, username);
		
		Chat chat = null;
		
		if(search1 == null && search2 == null) {
			chat = new Chat();
			chat.setUser1(username);
			chat.setUser2(friendName);
			chat.setMessages(new ArrayList<Message>());
			this.chatService.save(chat);
		} else if (search1 != null && search2 == null) {
			chat = search1;
		} else if (search1 == null && search2 != null) {
			chat = search2;
		}
		
		return new ResponseEntity<>(chat, HttpStatus.OK);
	}
	
	private String extractTokenFromRequest(HttpServletRequest request) {
	    String bearerToken = request.getHeader("Authorization");

	    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
	        return bearerToken.substring(7);
	    }

	    return null;
	}
}
