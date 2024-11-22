'use client'

import { useEffect, useState } from "react";
import EventSource from "eventsource";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsList,
    TabsContent,
    TabsTrigger
} from "@/components/ui/tabs";

import SampleCodes from "./SampleCodes/SampleCodes";
import TestCases from "./TestCases/TestCases";
import BaseOutput from "./BaseOutput/BaseOutput";
import SampleOutputs from "./SampleOutputs/SampleOutputs";
import ComparisonResults from "./ComparisonResults/ComparisonResults";
import { useMessageContext } from "@/contexts/messageContext";
import CodeBlock from "./CodeBlock/CodeBlock";

export function Response() {
    const [baseCode, setBaseCode] = useState<string>('');
    const [sampleCodes, setSampleCodes] = useState<string[]>([]);
    const [testCases, setTestCases] = useState<string[]>([]);
    const [baseOutput, setBaseOutput] = useState<unknown[]>([]);
    const [sampleOutputs, setSampleOutputs] = useState<{ [key: string]: string[] }>({});
    const [comparisonResults, setComparisonResults] = useState<{ [key: string]: { state: string; diff: string | null; score: number; }[] }>({});
    const [score, setScore] = useState<number>(0);
    const { sseReady } = useMessageContext();

    const handleSseData = (sseData: any) => {
        console.log('sseData :>> ', sseData);
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
                setBaseOutput(sseData.data as string[]);
                break;
            case 'sample_outputs':
                setSampleOutputs(sseData.data as { [key: string]: string[] });
                break;
            case 'comparison_results':
                setComparisonResults(sseData.data as { [key: string]: { state: string; diff: string | null; score: number; }[] });
                break;
            case 'score':
                setScore(sseData.data as number);
                break;
        }
    }

    const getColorForScore = (score: number) => {
        if (score >= 0.75) return 'bg-green-700';
        if (score >= 0.5) return 'bg-yellow-700';
        if (score >= 0.25) return 'bg-orange-700';
        return 'bg-red-700';
    };

    useEffect(() => {
        if (sseReady) {
            const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`;
            const chatId = '6728f0bbeffd785b366339d4';
    
            const eventSource = new EventSource(`${apiBaseUrl}/stream-message/${chatId}`);
        
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleSseData(data);
            };
    
            eventSource.onerror = () => {
                eventSource.close();
            };
    
            return () => {
                eventSource.close();
            }
        }
    }, [sseReady]);

    if (!baseCode) {
        return null;
    }

    return (
        <Dialog>
            <Card className="w-1/2 mr-auto">
                <CardContent className="flex flex-col items-center justify-center">
                    <CodeBlock code={baseCode}/>

                    <div className="flex gap-4 items-center !m-2 !ml-auto">
                        <DialogTrigger asChild>
                            <Button>
                                Show Details
                            </Button>
                        </DialogTrigger>
                        
                        {score
                            ? <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white ${getColorForScore(score)}`}>{score}</div>
                            : <Skeleton className="h-12 w-12 rounded-full"/>
                        }
                    </div>
                </CardContent>
            </Card>

            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle> Behind The Scenes </DialogTitle>

                    <DialogDescription>
                        Here are the details of the code confidence calculation process.
                    </DialogDescription>
                </DialogHeader>

                <Tabs className="w-full" defaultValue="sampleCodes">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="sampleCodes">Sample Codes</TabsTrigger>
                        <TabsTrigger value="testCases">Test Cases</TabsTrigger>
                        <TabsTrigger value="baseOutput">Base Output</TabsTrigger>
                        <TabsTrigger value="sampleOutputs">Sample Outputs</TabsTrigger>
                        <TabsTrigger value="comparisonResults">Comparison Results</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sampleCodes" className="grid grid-flow-row items-center justify-center">
                        <SampleCodes sampleCodes={sampleCodes} />
                    </TabsContent>

                    <TabsContent value="testCases" className="grid grid-flow-row items-center justify-center">
                        <TestCases testCases={testCases} />
                    </TabsContent>

                    <TabsContent value="baseOutput" className="grid grid-flow-row items-center justify-center">
                        <BaseOutput baseOutput={baseOutput} />
                    </TabsContent>

                    <TabsContent value="sampleOutputs" className="grid grid-flow-row items-center justify-center">
                        <SampleOutputs sampleOutputs={sampleOutputs} />
                    </TabsContent>

                    <TabsContent value="comparisonResults" className="grid grid-flow-row items-center justify-center">
                        <ComparisonResults comparisonResults={comparisonResults} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
