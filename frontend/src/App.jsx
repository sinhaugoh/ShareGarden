import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chatroom from "./pages/Chatroom";
import RequireAuth from "./components/shared/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" exact element={<Home />} />
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
    </div>
  );
}

export default App;
