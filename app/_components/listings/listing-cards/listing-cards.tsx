import type { TListing } from "@/app/_types";
import { Card } from "../../shared/card";
import { ListingDetails } from "../listing-details";
import { ListingImage } from "../listing-image";

type Props = {
	listings?: TListing[];
};

export const ListingCards = ({ listings }: Props) => {
	return (
		<div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 items-stretch">
			{listings?.map((listing) => (
				<Card
					key={listing.listingId}
					className="p-0 pb-5 w-[300px] h-full flex flex-col gap-3"
				>
					<ListingImage height={288} width={300} images={listing.images} />
					<div className="px-5">
						<ListingDetails
							listing={listing}
							headingTextStyle="text-xl font-bold pt-2"
							bodyTextStyle="text-md"
							captionTextStyle="text-sm"
						/>
					</div>
				</Card>
			))}
		</div>
	);
};
