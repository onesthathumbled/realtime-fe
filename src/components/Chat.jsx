import React, { useState, useEffect } from "react";
import ActionCable from "actioncable";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    const chatChannel = cable.subscriptions.create("ChatChannel", {
      received: (data) => {
        setMessages([...messages, data.message]);
      },
    });

    return () => {
      cable.subscriptions.remove(chatChannel);
    };
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    // Send message to the backend
    // You may want to add user authentication and handle message sending logic here
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input type="text" value={input} onChange={handleInputChange} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
