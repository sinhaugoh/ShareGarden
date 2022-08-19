import { useEffect } from "react";

export default function Chatroom() {
  useEffect(() => {
    console.log("haha");
    const chatSocket = new WebSocket(
      "ws://127.0.0.1:8000" + "/ws/" + "HARDCODE/"
    );
    console.log("chat", chatSocket);
  }, []);

  return <h1>Chatroom</h1>;
}
