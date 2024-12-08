'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
    Card,
    CardContent
} from '@/components/ui/card'
import {
    PaperPlaneIcon,
    GearIcon,
} from "@radix-ui/react-icons";

import { InputSchema, inputSchema } from "../../lib/schemas";
import { useMessageContext } from "@/contexts/messageContext";
import { generateMessage } from "@/lib/actions/MessagesActions";
import { MessageRequestData } from "@/lib/types";

const formDefaultValues: InputSchema = {
    prompt: "",
    entryPoint: "test_case_runner",
    temperature: 1,
    timeout: 10,
    floatThreshold: 1e-5,
    ignoreListOrder: false,
    ignoreStringCase: false,
};

export function InputPanel() {
    const [isOpen, setIsOpen] = useState(true);
    const { setRequestData, setSseReady } = useMessageContext();
    const form = useForm<InputSchema>({
        resolver: zodResolver(inputSchema),
        defaultValues: formDefaultValues
    });

    const submit = async (data: InputSchema) => {
        const requestData: MessageRequestData = {
            prompt: data.prompt,
            entry_point: data.entryPoint!,
            temperature: data.temperature!,
            timeout: data.timeout!,
            floatThreshold: data.floatThreshold!,
            ignoreListOrder: data.ignoreListOrder!,
            ignoreStringCase: data.ignoreStringCase!,
        };
        setRequestData(requestData);

        const response = await generateMessage(requestData);

        if (!response) {
            return;
        } else {
            setSseReady(true);
        }

        form.reset();
    }

    return (
        <Card className="w-full mb-6">
            <CardContent className="p-2">
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col space-y-2">
                            <div className="flex space-x-2 w-full">
                                <FormField 
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem className="w-auto flex-grow">
                                            <FormControl>
                                                <Input {...field} placeholder="Enter your prompt" className="border-none shadow-none"/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <CollapsibleTrigger asChild>
                                    <Button variant='outline'>
                                        <GearIcon/>
                                        Toggle Parameters
                                    </Button>
                                </CollapsibleTrigger>
                                
                                <Button type="submit" className="!mr-2">
                                    <PaperPlaneIcon/>
                                </Button>
                            </div>
                            

                            <CollapsibleContent className={`flex flex-wrap gap-4 w-full p-2 ${!isOpen ? 'hidden' : ''}`}>
                                <FormField 
                                    control={form.control}
                                    name="entryPoint"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Entry Point</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter the entry point"/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="temperature"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Temperature</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter the temperature"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="timeout"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Timeout</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter the timeout"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="floatThreshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Float Threshold</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter the float threshold"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="ignoreListOrder"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row space-x-2 items-center">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>

                                            <div className="leading-none p-2 !m-0">
                                                <FormLabel>
                                                    Ignore List Order
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ignoreStringCase"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row space-x-2 items-center">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>

                                            <div className="leading-none p-2 !m-0">
                                                <FormLabel>
                                                    Ignore String Case
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </form>
                    </Form>
                </Collapsible>
            </CardContent>
        </Card>
    )
}