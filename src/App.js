import React, { useState, useEffect } from "react";
import ActionCable from "actioncable";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    const chatChannel = cable.subscriptions.create("ChatChannel", {
      received: (data) => {
        setMessages(data.messages);
      },
    });

    return () => {
      cable.subscriptions.remove(chatChannel);
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: input }), // Send 'content' directly
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // If your server responds with JSON
      })
      .then((data) => {
        console.log("Message sent successfully:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    setInput("");
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
