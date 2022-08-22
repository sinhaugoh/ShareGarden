import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useWebSocket from "react-use-websocket";

export default function Chatroom() {
  const { user } = useAuth();
  const { room_name } = useParams();
  const [messages, setMessages] = useState([]);
  const [hasError, setHasError] = useState(false);
  const { readyState, sendJsonMessage } = useWebSocket(
    `ws://127.0.0.1:8000/ws/${room_name}/`,
    {
      onOpen: () => {
        console.log("Connected!");
        setHasError(false);
      },
      onClose: (e) => {
        console.log(e);
        console.log("Disconnected!");
      },
      onError: (e) => {
        console.log("eeror", e);
        setHasError(true);
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case "chat_message_echo":
            setMessages((prev) => [...prev, data.message]);
            break;
          case "message_history":
            setMessages(data.messages);
            break;
          default:
            break;
        }
      },
    }
  );

  console.log("messages:", messages);

  // useEffect(() => {
  //   const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${room_name}/`);
  //   console.log("chat", chatSocket);

  //   // callback for when the websocket connection is open
  //   chatSocket.onopen = function () {
  //     console.log("connecteddddd");
  //   };

  //   // callback for when the websocket connection is disconnected
  //   chatSocket.onclose = function () {
  //     console.log("disconnectedddd");
  //   };

  //   chatSocket.onmessage = function (e) {
  //     console.log("message", e);
  //   };
  // }, [room_name]);

  //TODO: implement 404 page
  if (hasError)
    return (
      <div>
        <h1>Invalid URL</h1>
      </div>
    );

  return (
    <div>
      <h1>Chatroom</h1>
      <button
        onClick={() =>
          sendJsonMessage({
            type: "chat_message",
            message: "hi there",
            username: user.username,
          })
        }
      >
        Send
      </button>
    </div>
  );
}
