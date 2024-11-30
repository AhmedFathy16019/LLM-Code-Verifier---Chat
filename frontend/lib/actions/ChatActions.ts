'use server'

import axios from 'axios';
import { getUserData } from './UserActions';

const apiBaseUrl = `${process.env.API_BASE_URL}/chats`;

export const getAllChats = async () => {
  const userData = await getUserData();

  try {
    const response = await axios.get(
      `${apiBaseUrl}/get-user-chats`,
      { headers: { Authorization: `Bearer ${userData.token}` } }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};