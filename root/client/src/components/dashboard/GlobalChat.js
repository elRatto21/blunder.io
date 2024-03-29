import { useEffect, useRef, useState } from "react";
import socket from "../../services/socket";
import { playerUsername } from "../../services/auth";
import Message from "../common/Message";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    socket.on("global-chat", (payload) => {
      setMessages([...messages, JSON.parse(payload)]);
    });
  });

  function containsOnlyWhitespace(str) {
    if (!str.replace(/\s/g, "").length) {
      return true;
    } else {
      return false;
    }
  }

  function sendMessage() {
    if (
      !containsOnlyWhitespace(currentMessage) &&
      currentMessage.length !== 0
    ) {
      let message = { content: currentMessage, username: playerUsername };
      setCurrentMessage("");
      socket.emit("global-chat", JSON.stringify(message));
    } else {
      setCurrentMessage("");
    }
  }

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] rounded-lg p-6">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white">
        Global Chat
      </h2>

      <div className="h-[12rem] md:h-[24rem] xl:h-[40rem] overflow-x-hidden overflow-y-scroll px-2 mb-5">
        {messages.map((message) => (
          <Message username={message.username} content={message.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] p-2 rounded-md flex"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type here..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          maxLength={300}
          className="flex-grow rounded-lg py-2 px-4 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={sendMessage}
          className="w-16 ml-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default GlobalChat;
