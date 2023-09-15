import React from "react";
import { playerUsername } from "../../services/auth";

const Message = ({ username, content }) => {

  const getUsernameColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash & 0xFF) % 220;
    const g = ((hash >> 8) & 0xFF) % 220;
    const b = ((hash >> 16) & 0xFF) % 220;
    const alpha = 0.25
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const isCurrentUser = username === playerUsername;
  const userColor = getUsernameColor(username);

  const messageStyle = {
    backgroundColor: userColor,
    overflowWrap: "break-word",
    hyphens: "auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: "75%",
  };

  const contentStyle = {
    textAlign: "left",
    wordBreak: "break-word",
  };

  return (
    <div
      className={`${
        isCurrentUser ? "text-right" : "text-left"
      } mb-4 mt-4 flex flex-col items-${isCurrentUser ? "end" : "start"}`}
    >
      <span className="font-bold">{username}</span>
      <div
        className="rounded-lg px-5 py-2"
        style={messageStyle}
      >
        <div style={contentStyle}>{content}</div>
      </div>
    </div>
  );
};

export default Message;
