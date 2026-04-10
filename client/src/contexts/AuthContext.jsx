import { createContext, useContext, useState } from 'react';
import { DEMO_USERS } from '../store/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
