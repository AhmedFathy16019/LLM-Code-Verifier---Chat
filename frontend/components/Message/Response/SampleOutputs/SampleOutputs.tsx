import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

function SampleOutputs({ sampleOutputs, loading }: { sampleOutputs: { [key: string]: string[]; }, loading: boolean }) {
  if (loading) {
    return <Skeleton className="w-10/12"/>;
  } else {
    return (
      <Carousel className="max-w-2xl flex items-center">
        <CarouselPrevious className="mr-4" />
        <CarouselContent className="flex-grow">
            {Object.entries(sampleOutputs).map(([, outputData], index) => (
              <CarouselItem key={index} className="flex justify-center">
                <Card className="max-w-10/12">
                  <CardHeader className="flex">
                    <CardTitle>Sample Code {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {outputData.map((output: string | any, index) => (
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
              </CarouselItem>
            ))}
        </CarouselContent>
        
        <CarouselNext />
      </Carousel>
    );
  }
}

export default SampleOutputs;