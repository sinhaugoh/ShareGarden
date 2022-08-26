import { Route, Navigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function RequireAuth({ children, redirectedPath = "/" }) {
  //const { user, isLoading, isAuthenticated } = useAuth();
  //if (isLoading) {
  //  return <h1>Loading...</h1>;
  //}
  //if (!isAuthenticated) {
  //  // have to use native navigation so that django view can be rendered
  //  window.location.href = "/login/";
  //  return null;
  //}
  //return children;

  const { user } = useAuth();

  if (!user) {
    // have to use native navigation so that django view can be rendered
    window.location.replace(`/login/?next=${redirectedPath}`);
    return null;
  }

  return children;
}
