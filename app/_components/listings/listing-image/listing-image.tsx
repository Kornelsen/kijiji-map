import Image from "next/image";

type Props = {
	height: number;
	width: number;
	images?: string[];
};

export const ListingImage = ({ images, height, width }: Props) => {
	return (
		<div className="relative" style={{ height, width }}>
			<Image
				src={
					images?.[0] ||
					"https://www.kijiji.ca/next-assets/images/not-found.jpg"
				}
				alt="Listing Image"
				objectFit="cover"
				objectPosition="center"
				className="rounded-tl"
				fill
			/>
		</div>
	);
};
