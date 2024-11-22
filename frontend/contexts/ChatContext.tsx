import { getAllChats } from '@/lib/actions/ChatActions';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Chat {
  _id: string;
  title: string;
}

interface ChatsContextType {
  chats: Chat[];
  loading: boolean;
  error: string | null;
}

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

export const ChatsProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getAllChats();
        console.log('response :>> ', response);
        setChats(response);
      } catch {
        setError('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <ChatsContext.Provider value={{ chats, loading, error}}>
      {children}
    </ChatsContext.Provider>
  );
};

export const useChatsContext = () => {
  const context = useContext(ChatsContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};