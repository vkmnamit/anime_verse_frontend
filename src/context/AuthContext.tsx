"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setOnAuthError } from "@/src/lib/api";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
    banner_url?: string;
    bio?: string;
    genres?: string[];
    twitter?: string;
    instagram?: string;
    facebook?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Register global auth error handler
        setOnAuthError(() => {
            setToken(null);
            setUser(null);
            localStorage.removeItem("auth_token");
            router.push("/auth");
        });

        // Hydrate from localStorage
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
            api.auth.me(storedToken)
                .then((userData: any) => {
                    setUser(userData.data || userData); // Backend might return { data: user } or just user
                })
                .catch(() => {
                    localStorage.removeItem("auth_token");
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [router]);

    const login = async (data: any) => {
        const res = await api.auth.login(data);
        const { user, session } = res.data || res;
        const accessToken = session?.access_token;

        if (accessToken) {
            setToken(accessToken);
            setUser(user);
            localStorage.setItem("auth_token", accessToken);
            router.push("/");
        }
    };

    const signup = async (data: any) => {
        const res = await api.auth.signup(data);
        const { user, session } = res.data || res;
        const accessToken = session?.access_token;

        if (accessToken) {
            setToken(accessToken);
            setUser(user);
            localStorage.setItem("auth_token", accessToken);
            router.push("/");
        }
    };

    const logout = async () => {
        if (token) {
            try {
                await api.auth.logout(token);
            } catch (err) {
                console.error("Logout failed", err);
            }
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        router.push("/auth");
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const userData = await api.auth.me(token);
            setUser(userData.data || userData);
        } catch (err) {
            console.error("Failed to refresh user", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
