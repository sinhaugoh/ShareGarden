import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useWebSocket from "react-use-websocket";
import useFetch from "../hooks/useFetch";
import {
  Container,
  Row,
  Col,
  Image,
  InputGroup,
  Form,
  Button,
} from "react-bootstrap";
import MessageBubbleLeft from "../components/chatroom/MessageBubbleLeft";
import MessageBubbleRight from "../components/chatroom/MessageBubbleRight";
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
  const [messageInput, setMessageInput] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isDeal, setIsDeal] = useState(null);
  const [dealAmount, setDealAmount] = useState(1);
  const [note, setNote] = useState(null);
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
        console.log("error", e);
        setHasError(true);
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case "chat_message_echo":
            setMessages((prev) => [data.message, ...prev]);
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
  console.log("message input: ", messageInput);
  console.log("isdeal", isDeal);
  console.log("note", note);

  function handleInputOnChange(event) {
    setMessageInput(event.target.value);
  }

  function handleNoteInputOnChange(event) {
    setNote(event.target.value);
  }

  function handleMessageOnSend() {
    if (messageInput === "") return;

    sendJsonMessage({
      type: "chat_message",
      message: messageInput,
      username: user.username,
    });

    // clear previous input
    setMessageInput("");
  }

  function handleMinusAmount() {
    setDealAmount((prev) => {
      if (prev - 1 < 1) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  }

  function handlePlusAmount() {
    setDealAmount((prev) => {
      if (prev + 1 > chatroomDetail.post.quantity) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  }

  console.log("ready state", readyState);

  //TODO: implement 404 page
  if (hasError)
    return (
      <div>
        <h1>Invalid URL</h1>
      </div>
    );

  //TODO: implement loading page
  if (isLoading || readyState !== 1) return <div>Loading...</div>;

  return (
    <Container className="bg-white mt-5 border border-grey">
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
            if (message.sender.username === user.username) {
              return (
                <MessageBubbleRight
                  profile_image={message.sender.profile_image}
                  content={message.content}
                  key={index}
                />
              );
            } else {
              return (
                <MessageBubbleLeft
                  profile_image={message.sender.profile_image}
                  content={message.content}
                  key={index}
                />
              );
            }
          })}
        </Col>
      </Row>
      <Row className=" border-top py-3">
        <Col>
          {isDeal === null &&
            chatroomDetail.requestee.username === user.username && (
              <div className="border rounded mb-1 d-flex justify-content-between align-items-center p-2">
                <div>Is this a deal?</div>
                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    className="px-4"
                    onClick={() => setIsDeal(false)}
                  >
                    No
                  </Button>
                  <Button className="px-4" onClick={() => setIsDeal(true)}>
                    Yes
                  </Button>
                </div>
              </div>
            )}
          {isDeal !== null && isDeal === true && (
            <div className="border rounded mb-1 d-flex flex-wrap p-2 align-items-center justify-content-between">
              <div className="d-flex flex-wrap align-items-center">
                <div className="d-flex align-items-center">
                  <div className="me-1">Amount </div>
                  <div className="d-flex align-items-center">
                    <Button onClick={handleMinusAmount}>-</Button>
                    <div className="mx-2">{dealAmount}</div>
                    <Button onClick={handlePlusAmount}>+</Button>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="ms-2">Note(optional)</div>
                  <Form.Control
                    placeholder="type in some note..."
                    aria-label="type in some note..."
                    aria-describedby="basic-addon2"
                    onChange={handleNoteInputOnChange}
                    value={note}
                    className="mx-2"
                  />
                </div>
              </div>
              <Button className="px-4" onClick={() => setIsDeal(true)}>
                Confirm
              </Button>
            </div>
          )}
          <InputGroup>
            <Form.Control
              placeholder="Type something..."
              aria-label="Type something..."
              aria-describedby="basic-addon2"
              onChange={handleInputOnChange}
              value={messageInput}
            />
            <Button variant="outline-secondary" onClick={handleMessageOnSend}>
              Send
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
}
