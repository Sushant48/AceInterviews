import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '@/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users/current-user`, { withCredentials: true });
                setUser(response.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (formData) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/login`, formData, { withCredentials: true },
                {headers: { "Content-Type": "application/json" }},
            );
            console.log(response);
            
            setUser(response.data.data.user);
            toast.success(response.data.message || "Login successful!");
        } catch (error) {
            const message = error.response?.data?.message || "An unexpected error occurred";
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user,setUser, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
