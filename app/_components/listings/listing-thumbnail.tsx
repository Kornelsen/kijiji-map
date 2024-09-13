import Image from "next/image";
import notFoundImg from "/public/not-found.jpg";
import { notFoundDataUrl } from "@/app/constants";

type Props = {
  alt: string;
  height: number;
  width: number;
  image?: string;
  onClick?: () => void;
};

export const ListingThumbnail = ({
  alt,
  image,
  height,
  width,
  onClick,
}: Props) => {
  return (
    <div className="relative" style={{ height, width }}>
      <Image
        src={image || notFoundImg}
        alt={alt}
        className="rounded-tl hover:cursor-pointer object-center"
        sizes={`${width}px`}
        placeholder={notFoundDataUrl}
        onClick={onClick}
        fill
      />
    </div>
  );
};
