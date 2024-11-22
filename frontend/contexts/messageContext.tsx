'use client'

import { MessageRequestData, MessageSseData } from '@/lib/types';
import { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
    requestData: MessageRequestData;
    setRequestData: (data: MessageRequestData) => void;
    sseData: MessageSseData;
    setSseData: (data: MessageSseData) => void;
    sseReady: boolean;
    setSseReady: (ready: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider ({ children }: { children: ReactNode }) {
    const [requestData, setRequestData] = useState<MessageRequestData>({} as MessageRequestData);
    const [sseData, setSseData] = useState<MessageSseData>({} as MessageSseData);
    const [sseReady, setSseReady] = useState<boolean>(false);

    return (
        <MessageContext.Provider value={{ requestData, setRequestData, sseData, setSseData, sseReady, setSseReady }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useRequestContext must be used within a RequestProvider');
    }
    return context;
};