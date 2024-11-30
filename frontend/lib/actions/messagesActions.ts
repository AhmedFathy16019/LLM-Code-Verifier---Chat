'use server'

import axios from 'axios';
import { MessageRequestData } from '../types';
import { getUserData } from './UserActions';

const apiBaseUrl = `${process.env.API_BASE_URL}/messages`;

export const generateMessage = async (data: MessageRequestData) => {
    const chatId = '6728f0bbeffd785b366339d4';
    const userData = await getUserData();
    try {
        const response = await axios.post(
            `${apiBaseUrl}/generate-message/${chatId}`,
            data,
            { headers: { Authorization: `Bearer ${userData.token}` } }
        );

        return response.data;
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};