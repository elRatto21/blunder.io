import jwt_decode from "jwt-decode";

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return false;
  }
  if(jwt_decode(token).exp < Date.now()/1000) {
    return false;
  }
  playerUsername = jwt_decode(token).sub;
  return true;
};

export let playerUsername;
