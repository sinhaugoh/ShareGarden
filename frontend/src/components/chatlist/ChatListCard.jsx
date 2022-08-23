import { Card, Image, Button } from "react-bootstrap";
import { createRoomName } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ChatListCard({
  requester,
  requestee,
  itemPost,
  lastMessage,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const chatTarget =
    user.username === requester.username ? requestee : requester;

  function handleNavigateToChatroom() {
    // redirect to chatroom
    navigate(
      `/chatroom/${createRoomName(
        requester.username,
        requestee.username,
        itemPost.id
      )}/`
    );
  }

  return (
    <Card className="p-2">
      <div className="d-flex align-items-center mb-2">
        <Image
          roundedCircle
          thumbnail
          src={chatTarget.profile_image}
          height="70px"
          className="me-3"
          style={{ objectFit: "cover", height: "70px", width: "70px" }}
        />
        <div className="d-flex flex-column">
          <div className="text-truncate">{chatTarget.username}</div>
          <div className="fs-5 fw-semibold text-truncate">{itemPost.title}</div>
        </div>
      </div>
      <div className="mb-3 text-truncate">{lastMessage}</div>
      <div className="d-grid gap-2">
        <Button variant="primary" onClick={handleNavigateToChatroom}>
          Chat
        </Button>
      </div>
    </Card>
  );
}
