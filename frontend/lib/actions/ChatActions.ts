'use server'

import axios from 'axios';

const apiBaseUrl = `${process.env.API_BASE_URL}/chats`;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjczZGUxNWI2OGZkODFlYzU0Y2RlNWMzIiwidXNlcm5hbWUiOiJzdXBlcl9hZG1pbiIsImFwaV9rZXkiOiJnQUFBQUFCblBlRmJ1c3hmQ0NDYXZMSEI1UC1CSXhRcGNmdk9tU2RDemR2N2xtMWlvZl9IeVZvR0NkaEY1TTExOEdiWVZFdC1Ka2JiTDNlVHdsOEcya0xvN0NiWGFhT1VTZ1BOQzZFLVltR0FWV2ozRDdDRVFCemdKMThHTjI1X3kyMXZFaVp3SDJUQ2RoSHdOWXRRQmZjcnlUa3lmLUV0M1lCeEpEZVkzQXdaTnRuWC1sSWI4RFBkZERkUWZCcnVJa09VVXRaTkJHQkFPNklxcGc1MEx5empjTE80Y3dKTHpNdGNpekpRNmp1RFpNUnhnMGZ2d0YwUUNMcWlETDhqRzd5WXNlTUloSFZvZUliRWowcGh6aUNNTWd2T2dEOFRlUG1iTWlrblUyV3N0MnU5cEViUTM5ST0iLCJleHAiOjE3MzI3MTM4MzV9.tnQQQSU2GDVQynIH09DRKiIYbPIkL-twv3V5ABKH2cA"

export const getAllChats = async () => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/get-user-chats`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};