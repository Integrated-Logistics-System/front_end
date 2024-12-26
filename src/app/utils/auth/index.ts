"use client";

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface UserPayload {
    id: string;
    email: string;
}

interface LoginResponse {
    token: string;
}

export function getToken(): string | null {
    return Cookies.get('token') || null;
}

// axios 인스턴스 생성 및 인터셉터 설정
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// 요청 인터셉터에서 토큰 추가
axiosInstance.interceptors.request.use((config) => {

    if (!config.headers) {
        config.headers = {};
    }

    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function login(email: string, password: string): Promise<boolean> {
    try {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
        if (response.status === 200 && response.data.token) {
            Cookies.set('token', response.data.token);
        }
        return response.status === 200;
    } catch {
        return false;
    }
}

export async function logout(): Promise<boolean> {
    try {
        const response = await axiosInstance.post('/auth/logout');
        if (response.status === 200) {
            Cookies.remove('token');
        }
        return response.status === 200;
    } catch {
        return false;
    }
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        const response = await axiosInstance.post<UserPayload>('/auth/verify', { token });
        return response.data;
    } catch {
        return null;
    }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
    try {
        const response = await axiosInstance.get<UserPayload>('/auth/user');
        return response.data;
    } catch {
        return null;
    }
}
