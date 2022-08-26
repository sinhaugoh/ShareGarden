import { useAuth } from "../../contexts/AuthContext.jsx";

export default function RequireAuth({ children, redirectedPath = "/" }) {
  const { user } = useAuth();

  if (!user) {
    // have to use native navigation so that django view can be rendered
    window.location.replace(`/login/?next=${redirectedPath}`);
    return null;
  }

  return children;
}
