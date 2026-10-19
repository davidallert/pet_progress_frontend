"use client";

import AuthContext from "./context";
import useSWR from 'swr';
import { isAxiosError } from "axios";
import axios from '@/libraries/axios';
import User from "@/types/user";

const fetcher = async (url: string): Promise<User | null> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) return null;
        throw e;
    }
};

export default function AuthProvider({ children }: {children: React.ReactNode}) {
    const {data, isLoading} = useSWR('/user', fetcher, {
        revalidateOnFocus: true,
        shouldRetryOnError: false
    });

    return (
        <AuthContext.Provider value={{user: data ?? null, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}
