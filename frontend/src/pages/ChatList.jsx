import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import { Container, Row, Col } from "react-bootstrap";
import ChatListCard from "../components/chatlist/ChatListCard";

export default function ChatList() {
  const { user } = useAuth();
  const { data: chatList, isLoading, error } = useFetch("/api/chats/");

  console.log("chatlist", chatList);

  //TODO: implement error page
  if (error) return <h1>{error}</h1>;

  //TODO implement loading page
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <Container className="mt-3 bg-white">
      <h2 className="mb-3">Chats</h2>
      <Row lg={3} md={2} sm={1} xs={1}>
        {chatList.map((chatroom) => {
          if (chatroom.last_message === null) return null;

          return (
            <Col className="mb-3">
              <ChatListCard
                requester={chatroom.requester}
                requestee={chatroom.requestee}
                itemPost={chatroom.post}
                lastMessage={chatroom.last_message.content}
              />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
