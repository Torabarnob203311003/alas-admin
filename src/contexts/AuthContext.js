import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an authentication check (replace with real logic)
    const fakeAuthCheck = setTimeout(() => {
      setIsAuthenticated(false); // Set to true if the user is authenticated
      setLoading(false);
    }, 1000);

    return () => clearTimeout(fakeAuthCheck);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
