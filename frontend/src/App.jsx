import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chatroom from "./pages/Chatroom";
import Register from "./pages/Register";
import RequireAuth from "./components/shared/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CreateItemPostProvider } from "./contexts/CreateItemPostContext";
import NavbarBs from "./components/shared/NavbarBs";
import ItemPostDetail from "./components/item-post-detail/ItemPostDetail";

function App() {
  return (
    <div className="App">
      <CreateItemPostProvider>
        <AuthProvider>
          <NavbarBs />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/register/" element={<Register />} />
            <Route path="/itempost/:id/" element={<ItemPostDetail />} />
            <Route
              path="/chatroom/"
              element={
                <RequireAuth redirectedPath="/chatroom/">
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
