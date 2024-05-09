import Image from "next/image";

type Props = {
  height: number;
  width: number;
  images?: string[];
};

export const ListingImage = ({ height, width, images }: Props) => {
  return (
    <div className={`h-[${height}px] w-[${width}px]`}>
      <Image
        src={
          images?.[0] ||
          // TODO: add to assets folder
          "https://www.kijiji.ca/next-assets/images/not-found.jpg"
        }
        alt={`Listing Image`}
        className={`object-cover object-center rounded-t h-[${height}px] w-[${width}px]`}
        width={width}
        height={height}
        style={{ height, width }}
      />
    </div>
  );
};
