import { useEffect, useRef, useState } from "react";
import socket from "../../../services/socket";
import { playerUsername } from "../../../services/auth";
import Message from "../../common/Message";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function OnlineGameChat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    socket.on("game-chat", (payload) => {
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
      socket.emit("game-chat", JSON.stringify(message));
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
    <div className="bg-white dark:bg-gray-700 dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] shadow-[0_1px_5px_rgb(0,0,0,0.15)] rounded-lg md:p-6 p-4 md:mt-8">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white">
        Chat
      </h2>

      <div className="h-[10rem] md:h-[25rem] xl:h-[40rem] overflow-x-hidden overflow-y-scroll px-2 mb-5">
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
          className="w-16 md:ml-2 -ml-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="md:w-4 w-10 h-4" />
        </button>
      </form>
    </div>
  );
}

export default OnlineGameChat;
