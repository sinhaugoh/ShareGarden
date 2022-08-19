import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatList from "./pages/ChatList";
import Chatroom from "./pages/Chatroom";
import Register from "./pages/Register";
import RequireAuth from "./components/shared/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CreateItemPostProvider } from "./contexts/CreateItemPostContext";
import NavbarBs from "./components/shared/NavbarBs";
import ItemPostDetail from "./pages/ItemPostDetail";
import Profile from "./pages/Profile";
import ItemPostUpdate from "./pages/ItemPostUpdate";
import ProfileUpdate from "./pages/ProfileUpdate";

function App() {
  return (
    <div className="App">
      <CreateItemPostProvider>
        <AuthProvider>
          <NavbarBs />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/register/" element={<Register />} />
            <Route
              path="/account/update/"
              element={
                <RequireAuth redirectedPath="/account/update/">
                  <ProfileUpdate />
                </RequireAuth>
              }
            />
            <Route path="/profile/:username/" element={<Profile />} />
            <Route
              path="/itempost/:id/update/"
              element={
                <RequireAuth>
                  <ItemPostUpdate />
                </RequireAuth>
              }
            />
            <Route path="/itempost/:id/" element={<ItemPostDetail />} />
            <Route
              path="/chatlist/"
              element={
                <RequireAuth redirectedPath="/chatlist/">
                  <ChatList />
                </RequireAuth>
              }
            />
            <Route
              path="/chatroom/:room_name/"
              element={
                <RequireAuth redirectedPath="/chatroom/:room_name/">
                  <Chatroom />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </CreateItemPostProvider>
    </div>
  );
}

export default App;
