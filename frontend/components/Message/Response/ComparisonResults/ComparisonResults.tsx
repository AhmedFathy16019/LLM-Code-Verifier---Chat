import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface ComparisonResultsProps {
    comparisonResults: {
        [key: string]: {
            state: string;
            diff: string | null;
            score: number;
        }[];
    };
}

function ComparisonResults({ comparisonResults }: ComparisonResultsProps) {
    if (Object.keys(comparisonResults).length === 0) {
        return <Skeleton className="w-full max-w-xs" />;
    } else {
        return (
            <Carousel className="max-w-2xl flex items-center">
                <CarouselPrevious className="mr-4" />
                <CarouselContent className="flex-grow">
                    {Object.entries(comparisonResults).map(([, sampleData], index) => (
                        <CarouselItem key={index} className="flex justify-center">
                            <Card className="w-10/12">
                                <CardHeader className="flex">
                                    <CardTitle>Sample Code {index + 1}</CardTitle>
                                </CardHeader>
                                
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>State</TableHead>
                                                <TableHead>Diff</TableHead>
                                                <TableHead>Score</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {sampleData.map((item, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{item.state}</TableCell>
                                                    <TableCell>{item.diff ?? "No Difference"}</TableCell>
                                                    <TableCell>{item.score}</TableCell>
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

export default ComparisonResults;