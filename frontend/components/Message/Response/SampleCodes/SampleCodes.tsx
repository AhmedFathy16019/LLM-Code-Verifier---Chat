import { Skeleton } from "@/components/ui/skeleton"
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
  
} from "@/components/ui/carousel";
import CodeBlock from "../CodeBlock/CodeBlock";


function SampleCodes({ sampleCodes, loading }: { sampleCodes: string[], loading: boolean }) {
  if (loading) {
    return <Skeleton className="w-10/12"/>;
  } else {
    return (
      <Carousel className="max-w-xl flex items-center">
        <CarouselPrevious className="mr-4" />
        <CarouselContent className="flex-grow">
          {sampleCodes.map((code, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <Card className="w-11/12">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <CodeBlock code={code} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="ml-4" />
      </Carousel>
    )
  }
};

export default SampleCodes;