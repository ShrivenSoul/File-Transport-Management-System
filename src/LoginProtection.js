import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Checks user credentials for authentication 
 */
function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session?.tokens?.accessToken;
        console.log("Session:", session);        
        console.log("Token:", token);          
        console.log("isAuth:", !!token);         
        setIsAuth(!!token);
      } catch {
        setIsAuth(false);
        console.log("Auth error:");
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute; 