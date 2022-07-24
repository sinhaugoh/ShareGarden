import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // fetch auth user on first load or page refresh
  useEffect(() => {
    if (isFirstLoad) {
      (async function () {
        try {
          setIsLoading(true);
          const response = await fetch("/api/authuser/");
          const authUser = await response.json();
          setUser(authUser.user);
        } catch (e) {
          console.log("AuthContext:", e);
          setUser(null);
        } finally {
          setIsLoading(false);
          setIsFirstLoad(false);
        }
      })();
    }
  }, [isFirstLoad]);

  return (
    <AuthContext.Provider value={{ user }}>
      {/*TODO: implement loading page*/}
      {isLoading ? <h1>is loading...</h1> : children}
    </AuthContext.Provider>
  );
}
