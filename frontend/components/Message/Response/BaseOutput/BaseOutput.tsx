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

function BaseOutput({ baseOutput }: { baseOutput: unknown[] }) {
  if (!baseOutput) {
    return <Skeleton className="w-full max-w-xs" />;
  } else {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center">
            <Table>
                <TableBody>
                    {baseOutput.map((output: string | any, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {
                              typeof output === 'object'
                                ? output.exception_message
                                : output
                            }
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

export default BaseOutput;