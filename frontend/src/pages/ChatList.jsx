import useFetch from "../hooks/useFetch";
import { Container, Row, Col } from "react-bootstrap";
import ChatListCard from "../components/chatlist/ChatListCard";
import LoadingIndicator from "../components/shared/LoadingIndicator";

export default function ChatList() {
  const { data: chatList, isLoading, error } = useFetch("/api/chats/");

  if (error) return <h1>{error}</h1>;

  if (isLoading) return <LoadingIndicator />;

  return (
    <Container className="mt-3 bg-white">
      <h2 className="mb-3">Chats</h2>
      <Row lg={3} md={2} sm={1} xs={1}>
        {chatList.map((chatroom, index) => {
          if (chatroom.last_message === null) return null;

          return (
            <Col className="mb-3" key={index}>
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
