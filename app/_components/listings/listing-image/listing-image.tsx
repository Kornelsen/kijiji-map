import Image from "next/image";
import notFoundImg from "/public/not-found.jpg";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../ui/carousel";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../shared";
import { useState } from "react";

type Props = {
	height: number;
	width: number;
	images?: string[];
	onClick?: () => void;
};

export const ListingImage = ({ images, height, width, onClick }: Props) => {
	return (
		<div className="relative" style={{ height, width }}>
			<Image
				src={images?.[0] || notFoundImg}
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

export const ImageCarousel = ({
	title,
	height,
	width,
	images,
	listingUrl,
}: Props & { title: string; listingUrl: string }) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const handleOpen = () => setDialogOpen(true);
	const handleOpenChange = (open: boolean) => setDialogOpen(open);
	return (
		<Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<ListingImage
					images={images}
					height={height}
					width={width}
					onClick={handleOpen}
				/>
			</DialogTrigger>
			<DialogContent
				className="flex flex-col items-center align-middle"
				style={{ width: 700, height: 550 }}
			>
				<DialogHeader className="text-xl font-bold">{title}</DialogHeader>
				<Carousel className="w-full max-w-xl my-auto">
					<CarouselContent>
						{images?.map((image, index) => {
							const key = `${image}-${index}`;
							return (
								<CarouselItem key={key} className="items-center">
									<Image
										src={image}
										alt="listing image"
										width={613}
										height={391}
										style={{ width: 613, height: 391 }}
										className="mx-auto"
									/>
								</CarouselItem>
							);
						})}
					</CarouselContent>
					<CarouselPrevious className="bg-[#373373] text-white hover:bg-[#373373] hover:brightness-200 hover:text-white" />
					<CarouselNext className="bg-[#373373] text-white hover:bg-[#373373] hover:brightness-200 hover:text-white" />
				</Carousel>
				<a href={listingUrl} target="_blank" rel="noreferrer">
					<Button fullWidth={false} className="text-sm">
						View Listing
					</Button>
				</a>
			</DialogContent>
		</Dialog>
	);
};
