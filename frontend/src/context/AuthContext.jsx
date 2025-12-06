import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        // Include ID in initial user state
        return token && role ? { role, id: userId } : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        if (token) {
            // Decode token or fetch user profile if endpoint exists
            // For now, we trust the token presence or stored user info
            // Optional: api.get('/auth/me').then(...)
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, name, userId } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                // We also save 'access_token' just in case you use libraries looking for it, 
                // but our app uses 'token' primarily.
                localStorage.setItem('access_token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('userId', userId); // Store User ID
                setToken(token);
                setRole(role);
                setUser({ name, email, role, id: userId });
                return true;
            } else {
                console.error("Login successful but no token received");
                return false;
            }
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
