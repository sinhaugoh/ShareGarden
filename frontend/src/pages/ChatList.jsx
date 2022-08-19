import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ChatList() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  }

  return (
    <>
      <h1>Chat list</h1>
      <button onClick={handleLogout}>
        {isLoading ? "logging out" : "logout"}
      </button>
    </>
  );
}
