import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
export default function Home() {
  const { user, logout } = useAuth();
  console.log("home");
  return (
    <>
      <h1>Home page</h1>
      <Link to="chatroom/">Chatroom</Link>
      {user && <button onClick={logout}>Logout</button>}
      {user && (
        <img
          src={
            user.profile_image === null
              ? "/static/default_profile_pic.png"
              : user.profile_image
          }
          alt="profile"
        />
      )}
    </>
  );
}
