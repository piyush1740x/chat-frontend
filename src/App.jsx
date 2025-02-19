import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";



const App = () => {
  const socket = useMemo(() => io("https://chat-backend-n3ur.onrender.com"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomInput, setRoomInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "" && room.trim() !== "") {
      socket.emit("message", { room, message });
      setMessage("");
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomInput.trim() !== "") {
      socket.emit("join-room", roomInput);
      setRoom(roomInput);
      setRoomInput("");
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">BABY⪥WHATSAPP</h1>
      <form onSubmit={handleJoinRoom} className="flex gap-3 w-full max-w-md">
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Enter Room Name"
          className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-600"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500">Join</button>
      </form>

      <div className="w-full max-w-md mt-4 p-3 bg-gray-800 rounded-md min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? <p>No messages yet</p> : null}
        <div className="flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-[75%] ${msg.sender === socket.id ? "self-end bg-blue-600" : "self-start bg-gray-700"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3 w-full max-w-md mt-4 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-600"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-500">Send</button>
        <button
          type="button"
          className="px-3 py-2 bg-yellow-500 rounded-md hover:bg-yellow-400"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😀
        </button>
      </form>

      {showEmojiPicker && (
        <div className="absolute bottom-20 right-5 bg-gray-800 p-3 rounded-md shadow-lg">
          <button
            onClick={() => setShowEmojiPicker(false)}
            className="mb-2 px-2 py-1 bg-red-600 rounded-md text-white"
          >
            Close
          </button>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default App;
