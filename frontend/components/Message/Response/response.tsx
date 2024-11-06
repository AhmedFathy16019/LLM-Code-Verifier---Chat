'use client'

import { useMessageContext } from "@/contexts/messageContext";
import { MessageSseData } from "@/lib/types";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent
} from '@/components/ui/card';

export function Response() {
    const { sseData } = useMessageContext();
    const [baseCode, setBaseCode] = useState<string>('');
    const [sampleCodes, setSampleCodes] = useState<string[]>([]);
    const [testCases, setTestCases] = useState<string[]>([]);
    const [baseOutput, setBaseOutput] = useState<unknown[]>([]);
    const [sampleOutputs, setSampleOutputs] = useState<unknown[]>([]);
    const [comparisonResults, setComparisonResults] = useState<unknown[]>([]);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        if (sseData) {
            switch(sseData.message_type) {
                case 'base_code':
                    setBaseCode(sseData.data as string);
                    break;
                case 'sample_codes':
                    setSampleCodes(sseData.data as string[]);
                    break;
                case 'test_cases':
                    setTestCases(sseData.data as string[]);
                    break;
                case 'base_output':
                    setBaseOutput(sseData.data as unknown[]);
                    break;
                case 'sample_outputs':
                    setSampleOutputs(sseData.data as unknown[]);
                    break;
                case 'comparison_results':
                    setComparisonResults(sseData.data as unknown[]);
                    break;
                case 'score':
                    setScore(sseData.data as number);
                    break;
            }
        }
    }, [sseData]);

    return (

    );
}
