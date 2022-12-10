import React from "react";
import { useEffect } from "react";

import "./App.css";

console.log(window.location.host);

const socket = new WebSocket({
  protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
  host: window.location.host,
  path: '/ws'
});

socket.onopen = function () {
  socket.send("hello from the client");
};

export default function App() {
  const [content, setContent] = React.useState({
    message: "Loading...",
    photo: [],
  });
  
  useEffect(() => {
    socket.onmessage = function (message) { 
      const data = JSON.parse(message.data);
      setContent(data);
      console.log(data);
    };
  }, [content]);

  socket.onerror = function (error) {
    console.log("WebSocket error: " + error);
  };

  return (
    <main
      className="home"
      style={{
        backgroundImage: `url(${content.photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <section className="home__box">
        <h1 className="home__title">
          {content.message}
        </h1>
      </section>
    </main>
    );
}
