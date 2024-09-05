import Image from "next/image";
import notFoundImg from "/public/not-found.jpg";

type Props = {
  height: number;
  width: number;
  image?: string;
  onClick?: () => void;
};

export const ListingThumbnail = ({ image, height, width, onClick }: Props) => {
  return (
    <div className="relative" style={{ height, width }}>
      <Image
        src={image || notFoundImg}
        alt="Listing Image"
        objectPosition="center"
        className="rounded-tl hover:cursor-pointer"
        sizes={`${width}px`}
        onClick={onClick}
        fill
      />
    </div>
  );
};
