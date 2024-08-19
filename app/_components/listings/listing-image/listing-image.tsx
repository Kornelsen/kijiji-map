import Image from "next/image";

type Props = {
	height: number;
	width: number;
	images?: string[];
};

export const ListingImage = ({ height, width, images }: Props) => {
	return (
		<div style={{ height, width: "100%" }}>
			<Image
				src={
					images?.[0] ||
					"https://www.kijiji.ca/next-assets/images/not-found.jpg"
				}
				alt="Listing Image"
				className="object-cover object-center rounded-t"
				width={width}
				height={height}
				style={{ height }}
			/>
		</div>
	);
};
