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

function TestCases({ testCases, loading }: { testCases: string[], loading: boolean }) {
  if (loading) {
    return <Skeleton className="w-10/12"/>;
  } else {
    return (
      <Card className="w-full max-h-[75vh] overflow-auto">
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