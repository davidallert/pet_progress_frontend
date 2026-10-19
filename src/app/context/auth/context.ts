"use client";

import { createContext } from 'react';
import AuthContextInterface from './interface';

const AuthContext = createContext(<AuthContextInterface>({user: null, isLoading: true}));

export default AuthContext;