import Image from "next/image";
import notFoundImg from "@/public/not-found.jpg";
import { notFoundDataUrl } from "@/app/constants";
import { cn } from "@/lib/utils";

type Props = {
  alt: string;
  height?: number;
  width?: number;
  image?: string;
  onClick?: () => void;
  priority?: boolean;
  className?: string;
};

export const ListingThumbnail = ({
  alt,
  image,
  height,
  width,
  onClick,
  priority,
  className,
}: Props) => {
  const fixedSize = height !== undefined && width !== undefined;
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        !fixedSize && "w-full aspect-[2/1]",
        className
      )}
      style={fixedSize ? { height, width } : undefined}
    >
      <Image
        src={image || notFoundImg}
        alt={alt}
        className="hover:cursor-pointer object-cover object-center"
        sizes={fixedSize ? `${width}px` : "418px"}
        placeholder={notFoundDataUrl}
        onClick={onClick}
        priority={priority}
        fill
      />
    </div>
  );
};
