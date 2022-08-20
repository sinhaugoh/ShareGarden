import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

export default function Chatroom() {
  const { room_name } = useParams();
  const [welcome, setWelcome] = useState("");
  const [messages, setMessages] = useState([]);
  const { readyState, sendJsonMessage } = useWebSocket(
    `ws://127.0.0.1:8000/ws/${room_name}/`,
    {
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case "welcome_message":
            console.log(data.message);
            setWelcome(data.message);
            break;
          case "chat_message_echo":
            console.log("hoejoe");
            setMessages((prev) => [...prev, data.message]);
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

  return (
    <div>
      <h1>Chatroom</h1>
      <p>{welcome}</p>
      <button
        onClick={() =>
          sendJsonMessage({
            type: "chat_message",
            message: "hi there",
          })
        }
      >
        Send
      </button>
    </div>
  );
}
