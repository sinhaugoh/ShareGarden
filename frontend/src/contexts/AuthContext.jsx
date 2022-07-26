import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/shared/LoadingIndicator";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  async function fetchAuthUser() {
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
  }

  async function register(formInput) {
    //send request to register user
    const response = await fetch("/api/register/", {
      method: "POST",
      body: JSON.stringify({
        username: formInput.username,
        password: formInput.password,
        password2: formInput.password2,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    // set user context if registration is successful
    if (response.ok) {
      setUser(data.user);
    }

    return { status: response.status, data: data };
  }

  async function logout() {
    await fetch("/api/logout/");
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{ user, register, logout, fetchAuthUser }}>
      {isLoading ? <LoadingIndicator /> : children}
    </AuthContext.Provider>
  );
}
