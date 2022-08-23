import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useWebSocket from "react-use-websocket";
import useFetch from "../hooks/useFetch";
import { Container, Row, Col, Image } from "react-bootstrap";
import MessageBubble from "../components/chatroom/MessageBubble";
import { DEFAULT_PROFILE_PIC_PATH } from "../constants";

export default function Chatroom() {
  const { user } = useAuth();
  const { room_name } = useParams();
  const {
    data: chatroomDetail,
    isLoading,
    error,
  } = useFetch(`/api/chatroom/${room_name}/`);
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
  console.log("chatroom", chatroomDetail);

  useEffect(() => {}, []);

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

  //TODO: implement loading page
  if (isLoading) return <div>Loading...</div>;

  return (
    <Container className="bg-white mt-5 border border-grey d-flex flex-column">
      <Row>
        <div className="d-flex align-items-center border-bottom py-2">
          <Image
            thumbnail
            roundedCircle
            src={
              user.username === chatroomDetail.requester.username
                ? chatroomDetail.requestee.profile_image ??
                  DEFAULT_PROFILE_PIC_PATH
                : chatroomDetail.requester.profile_image ??
                  DEFAULT_PROFILE_PIC_PATH
            }
            className="me-4"
            style={{ objectFit: "cover", height: "55px", width: "55px" }}
          />
          <div className="fs-4 fw-semibold">
            {user.username === chatroomDetail.requester.username
              ? chatroomDetail.requestee.username
              : chatroomDetail.requester.username}
          </div>
        </div>
      </Row>
      <Row>
        <div className="d-flex align-items-center border-bottom py-2">
          <Image
            thumbnail
            src={chatroomDetail.post.cover_image}
            className="me-4"
            style={{ objectFit: "cover", height: "55px", width: "55px" }}
          />
          <div className="fs-4">{chatroomDetail.post.title}</div>
        </div>
      </Row>
      <Row style={{ height: "500px" }}>
        <Col className="chat-container">
          {messages.map((message, index) => {
            return (
              <MessageBubble
                profile_image={message.sender.profile_image}
                content={message.content}
                key={index}
              />
            );
          })}
        </Col>
      </Row>
      <Row className=" border-top" style={{ height: "100px" }}></Row>
    </Container>
  );
}
// <button
//   onClick={() =>
//     sendJsonMessage({
//       type: "chat_message",
//       message: "hi there fhdashf ashfhdashfhd ashsdfh fdasf hafsdhf ah",
//       username: user.username,
//     })
//   }
// >
//   Send
// </button>
