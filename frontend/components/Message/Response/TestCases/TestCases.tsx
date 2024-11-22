import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@/components/ui/table";
import CodeBlock from "../CodeBlock/CodeBlock";

function TestCases({ testCases }: { testCases: string[] }) {
  if (!testCases) {
    return <Skeleton className="w-full max-w-xs" />;
  } else {
    return (
      <Card className="max-w-xl">
        <CardContent>
            <Table>
                <TableBody>
                    {testCases.map((testCase, index) => (
                        <TableRow key={index}>
                            <TableCell>
                              <CodeBlock code={testCase} showLines={false}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    )
  }
}

export default TestCases;