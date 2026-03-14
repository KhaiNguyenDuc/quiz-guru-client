import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import Quiz from "../../components/Quiz/Quiz";
import keycloak from "../../keycloak";
import "./index.css";

const QuizPage = () => {
  const [stompClient, setStompClient] = useState(null);
  const hasConnectedRef = useRef(false);
  const strategyIndexRef = useRef(0);
  const exhaustedStrategiesRef = useRef(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const wsEndpoint = process.env.REACT_APP_QUIZ_WS_ENDPOINT || "ws://localhost:8083/quizzes/ws-endpoint";
      const stompProtocols = ["v12.stomp", "v11.stomp", "v10.stomp"];
      const useQueryTokenAuth = process.env.REACT_APP_WS_QUERY_TOKEN_AUTH === "true";
      const buildConnectionStrategies = (token) => {
        const currentToken = token || "";
        const connectionStrategies = [
          {
            label: "subprotocol-token",
            url: wsEndpoint,
            protocols: [...stompProtocols, currentToken],
          },
          {
            label: "sockjs-websocket-query-access_token",
            url: `${wsEndpoint}/websocket?access_token=${encodeURIComponent(currentToken)}`,
            protocols: stompProtocols,
          },
          {
            label: "plain",
            url: wsEndpoint,
            protocols: stompProtocols,
          },
        ];

        if (useQueryTokenAuth) {
          connectionStrategies.unshift(
            {
              label: "query-token",
              url: `${wsEndpoint}?token=${encodeURIComponent(currentToken)}`,
              protocols: stompProtocols,
            },
            {
              label: "query-access_token",
              url: `${wsEndpoint}?access_token=${encodeURIComponent(currentToken)}`,
              protocols: stompProtocols,
            }
          );
        }

        return connectionStrategies;
      };

      const sanitizeDebugMessage = (message) =>
        message
          .replace(/(Authorization:Bearer\s+)[^\n]+/gi, "$1<redacted>")
          .replace(/(authorization:Bearer\s+)[^\n]+/gi, "$1<redacted>")
          .replace(/(accessToken:)[^\n]+/gi, "$1<redacted>");

      const stompClient = new Client({
        beforeConnect: async () => {
          try {
            if (keycloak.authenticated) {
              await keycloak.updateToken(30);
              localStorage.setItem("accessToken", keycloak.token);
            }
          } catch (error) {
            console.warn("Keycloak token refresh before STOMP connect failed:", error);
          }

          const latestToken = keycloak.token || localStorage.getItem("accessToken") || "";
          stompClient.connectHeaders = {
            "Authorization": `Bearer ${latestToken}`,
            "authorization": `Bearer ${latestToken}`,
            "accessToken": latestToken,
          };
        },
        webSocketFactory: () => {
          const latestToken = keycloak.token || localStorage.getItem("accessToken") || "";
          const connectionStrategies = buildConnectionStrategies(latestToken);
          const strategy = connectionStrategies[strategyIndexRef.current];
          const safeUrl = strategy.url.replace(/([?&](?:token|access_token)=)[^&]+/i, "$1<redacted>");
          console.log(`Opening WebSocket [${strategy.label}] to`, safeUrl);
          return new WebSocket(strategy.url, strategy.protocols);
        },
        connectHeaders: {},
        debug: (str) => {
          console.log(sanitizeDebugMessage(str));
        },
        onConnect: () => {
          hasConnectedRef.current = true;
          console.log("STOMP connected.");
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", event);
        },
        onWebSocketClose: (event) => {
          const latestToken = keycloak.token || localStorage.getItem("accessToken") || "";
          const connectionStrategies = buildConnectionStrategies(latestToken);
          console.error(
            `WebSocket closed. code=${event.code}, reason=${event.reason || "(empty)"}, clean=${event.wasClean}`
          );

          if (!hasConnectedRef.current && strategyIndexRef.current < connectionStrategies.length - 1) {
            strategyIndexRef.current += 1;
            console.warn(
              "Switching websocket strategy to fallback:",
              connectionStrategies[strategyIndexRef.current].label
            );
            return;
          }

          if (!hasConnectedRef.current && !exhaustedStrategiesRef.current) {
            exhaustedStrategiesRef.current = true;
            console.error(
              "All websocket handshake strategies failed before STOMP CONNECT. Backend must allow websocket upgrade and auth extraction at handshake layer."
            );
            stompClient.deactivate();
            setStompClient(null);
          }
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame.headers["message"], frame.body);
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
