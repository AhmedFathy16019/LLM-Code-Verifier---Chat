'use client'

import { useMessageContext } from "@/contexts/messageContext";
import {
    Card,
    CardContent
} from '@/components/ui/card';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import {
    Table,
    TableBody,
    TableCell,
    TableRow, 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

export function Request() {
  const { requestData } = useMessageContext();

  if (!requestData.prompt) {
    return null;
  }
  
  return (
    <Card className="w-1/2 ml-auto">
        <CardContent className="flex flex-col items-center justify-center">
            <p className="text-lg p-4">
                {requestData.prompt}
            </p>

            <Popover>
                <PopoverTrigger asChild>
                    <Button className="!m-2 !ml-auto">
                        Show Parameters
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full">
                    <Table>
                        <TableBody>         
                            <TableRow>
                                <TableCell>entry_point</TableCell>
                                <TableCell>{requestData.entry_point || "Not Provided"}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>temperature</TableCell>
                                <TableCell>{requestData.temperature}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>timeout</TableCell>
                                <TableCell>{requestData.timeout}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>floatThreshold</TableCell>
                                <TableCell>{requestData.floatThreshold}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>ignoreListOrder</TableCell>
                                <TableCell>{requestData.ignoreListOrder ? 'true' : 'false'}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>ignoreStringCase</TableCell>
                                <TableCell>{requestData.ignoreStringCase ? 'true' : 'false'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </PopoverContent>
            </Popover>
        </CardContent>
    </Card>
  )
}