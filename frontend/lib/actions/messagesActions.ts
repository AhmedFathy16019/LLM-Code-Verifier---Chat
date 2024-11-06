'use server'

import axios from 'axios';
import { MessageRequestData } from '../types';

const apiBaseUrl = `${process.env.API_BASE_URL}/messages`;

export const generateMessage = async (data: MessageRequestData) => {
    const chatId = '6728f0bbeffd785b366339d4';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjcwZDJmODk2ZmEwMzg2MzJhMTJjOWZjIiwidXNlcm5hbWUiOiJHcm91cDUiLCJhcGlfa2V5IjoiZ0FBQUFBQm5EUy1KYzRPS09EU2RkcTBueUFFTE1PWUxCTWxsdnlxeE5POHNPb2ZsMFRSVWNnNmR3NjlUWGd3V3RGdHJ1NC02VDd1TThRMF9wY0V3eUI4OWFpLVplbmdkemFXelVwTnBQSFBKZTNVSzB4WGFoaHVnc18wY1lTSXY1a0RjR1hKUkFrVVYiLCJleHAiOjE3MzExODQwMTV9.GdrFF3zdsdY0QN1VatDQCmpSwIGB_WA90levBgVCgkk'

    try {
        const response = await axios.post(
            `${apiBaseUrl}/generate-message/${chatId}`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};