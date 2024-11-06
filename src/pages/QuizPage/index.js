import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import Quiz from "../../components/Quiz/Quiz";
import "./index.css";

const QuizPage = () => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    let protocols = ['v10.stomp', 'v11.stomp'];
    protocols.push(accessToken);
    if (accessToken) {
      const socket = new WebSocket("ws://localhost:8083/quizzes/ws-endpoint", protocols);
      socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          "Authorization": `Bearer ${accessToken}`,
        },
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.activate();
      setStompClient(stompClient);

      return () => {
        if (stompClient) {
          stompClient.deactivate();
        }
      };
    }
  }, []);

  return (
    <>
      <div>
        <Quiz socket={stompClient} />
      </div>
    </>
  );
};

export default QuizPage;
