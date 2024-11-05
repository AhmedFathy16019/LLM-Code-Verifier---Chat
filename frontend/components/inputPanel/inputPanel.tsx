'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import {
    Card,
    CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import {
    PaperPlaneIcon,
    GearIcon,
} from "@radix-ui/react-icons";

import inputSchema, { InputSchema } from "../../lib/inputSchema";
import { useEffect } from "react";

const formDefaultValues: InputSchema = {
    prompt: "",
    entryPoint: "",
    temperature: 1,
    timeout: 10,
    floatThreshold: 1e-5,
    ignoreListOrder: false,
    ignoreStringCase: false,
};

export function InputPanel() {
    const form = useForm<InputSchema>({
        resolver: zodResolver(inputSchema),
        defaultValues: formDefaultValues
    });

    const { errors } = form.formState;

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log("Validation errors:", errors);
        }
    }, [errors]);
    
    const submit = async (data: InputSchema) => {
        const parsedData = {
            ...data,
            temperature: parseFloat(data.temperature as unknown as string),
            timeout: parseFloat(data.timeout as unknown as string),
            floatThreshold: parseFloat(data.floatThreshold as unknown as string),
        };

        console.log("Submitted data:");
        console.log(parsedData);
    }

    return (
        <Card className="w-11/12 m-auto">
            <CardContent className="flex items-center p-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="flex flex-row space-x-2 w-full">
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

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant='outline'>
                                    <GearIcon/>
                                    Edit Parameters
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="flex flex-col space-y-2">
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
                            </PopoverContent>                       
                        </Popover>

                        <Button type="submit" className="!mr-2">
                            <PaperPlaneIcon/>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}