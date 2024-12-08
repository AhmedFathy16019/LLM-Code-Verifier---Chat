'use client'

import { useEffect, useState } from "react";
import EventSource from "eventsource";
import Image from 'next/image';
import './Response.scss';

import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { set } from "zod";

export function Response() {
    const [baseCode, setBaseCode] = useState<string>('');
    const [sampleCodes, setSampleCodes] = useState<string[]>([]);
    const [testCases, setTestCases] = useState<string[]>([]);
    const [baseOutput, setBaseOutput] = useState<unknown[]>([]);
    const [sampleOutputs, setSampleOutputs] = useState<{ [key: string]: string[] }>({});
    const [comparisonResults, setComparisonResults] = useState<{ [key: string]: { state: string; diff: string | null; score: number; }[] }>({});
    const [score, setScore] = useState<number>(0);

    const [loadingBaseCode, setLoadingBaseCode] = useState<boolean>(true);
    const [loadingSampleCodes, setLoadingSampleCodes] = useState<boolean>(true);
    const [loadingTestCases, setLoadingTestCases] = useState<boolean>(true);
    const [loadingBaseOutput, setLoadingBaseOutput] = useState<boolean>(true);
    const [loadingSampleOutputs, setLoadingSampleOutputs] = useState<boolean>(true);
    const [loadingComparisonResults, setLoadingComparisonResults] = useState<boolean>(true);

    const { sseReady, setSseReady } = useMessageContext();

    const handleSseData = (sseData: any) => {
        switch(sseData.message_type) {
            case 'base_code':
                setBaseCode(sseData.data as string);
                setLoadingBaseCode(false);
                break;
            case 'sample_codes':
                setSampleCodes(sseData.data as string[]);
                setLoadingSampleCodes(false);
                break;
            case 'test_cases':
                setTestCases(sseData.data as string[]);
                setLoadingTestCases(false);
                break;
            case 'base_output':
                setBaseOutput(sseData.data as string[]);
                setLoadingBaseOutput(false);
                break;
            case 'sample_outputs':
                setSampleOutputs(sseData.data as { [key: string]: string[] });
                setLoadingSampleOutputs(false);
                break;
            case 'comparison_results':
                setComparisonResults(sseData.data as { [key: string]: { state: string; diff: string | null; score: number; }[] });
                setLoadingComparisonResults(false);
                break;
            case 'score':
                setScore(parseFloat(Math.max(0, sseData.data).toFixed(2)));
                break;
        }
    }

    const getColorForScore = (score: number) => {
        if (score >= 0.9) return 'bg-green-700';
        if (score >= 0.8) return 'bg-green-300';
        if (score >= 0.5) return 'bg-yellow-300';
        return 'bg-red-300';
    };

    const getScoreComment = (score: number) => {
        if (score >= 0.9) return 'Very High Confidence';
        if (score >= 0.8) return 'High Confidence';
        if (score >= 0.5) return 'Moderate Confidence';
        return 'Low Confidence';
    }

    const getScoreIconSrc = (score: number) => {
        if (score >= 0.9) return '/icons/picture1.png';
        if (score >= 0.8) return '/icons/picture2.png';
        if (score >= 0.5) return '/icons/picture3.svg';
        return '/icons/picture4.svg';
    }

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
                setSseReady(false);
                eventSource.close();
            }
        }
    }, [sseReady, setSseReady]);

    if (loadingBaseCode && sseReady) {
        return (
            <Card className="w-5/12 mr-auto mt-8">
                <CardContent className="flex flex-col gap-2 !p-4">
                    <Skeleton className="w-1/2 h-12" />
                    <Skeleton className="w-8/12 h-12" />
                    <Skeleton className="w-10/12 h-12" />
                </CardContent>
            </Card>
        )
    }

    if (!sseReady) {
        return null;
    }

    return (
        <Dialog>
            <Card className="w-10/12 mr-auto mt-8 bg-zinc-100">
                <CardContent className="flex flex-col items-center justify-center !p-2">
                    <CodeBlock code={baseCode}/>

                    <div className="flex gap-2 items-center !m-2 !mr-auto">
                        <DialogTrigger asChild>
                            <Button>
                                Show Details
                            </Button>
                        </DialogTrigger>
                        
                        {score
                            ? <div className={`p-[0.4rem] rounded-md flex items-center justify-center text-white ${getColorForScore(score)}`}>
                                <Image src={getScoreIconSrc(score)} alt="Score Icon" width={24} height={24} className="mr-1" />
                                {score * 100 + '% ' + getScoreComment(score)}
                            </div>
                            : <div className="flex items-center">
                                <div className="loader mr-2"></div>
                                <span>Generating score<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></span>
                            </div>
                        }
                    </div>
                </CardContent>
            </Card>

            <DialogContent className="max-w-4xl max-h-lvh">
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

                    <TabsContent value="sampleCodes" className="grid grid-flow-row items-center justify-center max-h-[75vh] overflow-y-auto">
                        <SampleCodes sampleCodes={sampleCodes} loading={loadingSampleCodes} />
                    </TabsContent>

                    <TabsContent value="testCases" className="grid grid-flow-row items-center justify-center max-h-[75vh] overflow-y-auto">
                        <TestCases testCases={testCases} loading={loadingTestCases} />
                    </TabsContent>

                    <TabsContent value="baseOutput" className="grid grid-flow-row items-center justify-center max-h-[75vh] overflow-y-auto">
                        <BaseOutput baseOutput={baseOutput} loading={loadingBaseOutput}/>
                    </TabsContent>

                    <TabsContent value="sampleOutputs" className="grid grid-flow-row items-center justify-center max-h-[75vh] overflow-y-auto">
                        <SampleOutputs sampleOutputs={sampleOutputs} loading={loadingSampleOutputs} />
                    </TabsContent>

                    <TabsContent value="comparisonResults" className="grid grid-flow-row items-center justify-center max-h-[75vh] overflow-y-auto">
                        <ComparisonResults comparisonResults={comparisonResults} loading={loadingComparisonResults} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
