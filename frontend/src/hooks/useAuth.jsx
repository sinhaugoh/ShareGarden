// import { useEffect, useState } from "react";

// export default function useAuth() {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     (async function () {
//       try {
//         setIsLoading(true);
//         const response = await fetch("api/authuser/");
//         const authUser = await response.json();
//         setIsLoading(false);
//         setIsAuthenticated(authUser.is_authenticated);
//         setUser(authUser.user);
//         console.log(authUser);
//       } catch (e) {
//         // TODO: implement catch
//       }
//     })();
//   }, []);

//   return { user, isAuthenticated, isLoading };
// }
