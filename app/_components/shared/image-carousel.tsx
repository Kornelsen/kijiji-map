import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { notFoundDataUrl } from "@/app/constants";

export const ImageCarousel = ({
  images,
  height,
  width,
}: {
  images: string[];
  height: number;
  width: number;
}) => (
  <Carousel className="w-full max-w-xl my-auto">
    <CarouselContent>
      {images?.map((image, index) => {
        const key = `${image}-${index}`;
        return (
          <CarouselItem key={key} className="items-center">
            <div className="relative mx-auto" style={{ width, height }}>
              <Image
                src={image}
                alt="listing image"
                fill
                sizes={`${width}px`}
                placeholder={notFoundDataUrl}
                className="object-contain"
              />
            </div>
          </CarouselItem>
        );
      })}
    </CarouselContent>
    <CarouselPrevious className="bg-[#373373] text-white hover:bg-[#373373] hover:brightness-200 hover:text-white" />
    <CarouselNext className="bg-[#373373] text-white hover:bg-[#373373] hover:brightness-200 hover:text-white" />
  </Carousel>
);
