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


function SampleCodes({ sampleCodes }: { sampleCodes: string[] }) {
  if (!sampleCodes) {
    return <Skeleton className="w-full max-w-xs" />;
  } else {
    return (
      <Carousel className="max-w-2xl flex items-center">
        <CarouselPrevious className="mr-4" />
        <CarouselContent className="flex-grow">
          {sampleCodes.map((code, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <Card className="w-10/12">
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