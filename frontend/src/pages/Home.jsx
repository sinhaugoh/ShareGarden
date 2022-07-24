import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <h1>Home page</h1>
      <Link to="chatroom/">Chatroom</Link>
      {user && <img src={user?.profile_image} alt="profile" />}
    </>
  );
}
