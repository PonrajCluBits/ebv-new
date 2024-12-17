// src/context/AuthContext.js
import axios from 'axios';
import React, { useMemo, useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.screendata && userData?.screendata.length > 0) {
        setUser(userData);
    }
  }, []);

  const login = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_ELIGIBILITY_PATIENT_URL}/account/login`, data);
      localStorage.setItem('userData', JSON.stringify(response?.data?.data));
      setUser(response?.data);
      return response;
    } catch (error) {
      // Handle and return the error response
      if (error.response) {
        // Server responded with a status code other than 2xx
        return Promise.reject(error.response.data);
      } if (error.request) {
        // Request was made but no response was received
        return Promise.reject({ message: "No response from the server." });
      } 
        // Something else caused the error
        return Promise.reject({ message: error.message });
      
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
