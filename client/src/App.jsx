import React from "react";
import { useEffect } from "react";

import "./App.css";

const socket = new WebSocket("ws://localhost:1337");

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
