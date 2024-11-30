'use server'

import axios from 'axios';
import { cookies } from 'next/headers';
import { LoginRequestData, RegisterRequestData } from '../types';

interface UserData {
  username: string;
  password: string;
  token: string;
}
const apiBaseUrl = `${process.env.API_BASE_URL}/users`;

const storeUserData = async (userData: UserData) => {
  const cookieStore = await cookies();
  cookieStore.set('userData', JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const userData = cookieStore.get('userData');
  
  return userData ? JSON.parse(userData.value) : null;
}

export const clearUserData = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('userData');
}

export const registerUser = async (data: RegisterRequestData) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/signup`,
      {
        ...data,
        api_key: data.apiKey,
      },
    );

    await storeUserData(response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting data:', error);
  }
};

export const loginUser = async (data: LoginRequestData) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/login`,
      data,
    );

    await storeUserData(response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting data:', error);
  }
};