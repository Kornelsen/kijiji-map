import { useState } from "react";
import { useListingById } from "@/app/api/listings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../shared";
import { ListingThumbnail } from "../listing-thumbnail";
import { ImageCarousel } from "../../shared/image-carousel";

type Props = {
  id: string;
  image: string;
  title: string;
};

export const ImagesDialog = ({ id, image, title }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpen = () => setDialogOpen(true);
  const handleOpenChange = (open: boolean) => setDialogOpen(open);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ListingThumbnail
          image={image}
          height={127}
          width={179}
          onClick={handleOpen}
        />
      </DialogTrigger>
      <DialogContent
        className="flex flex-col items-center align-middle"
        style={{ width: 700, height: 550 }}
      >
        <DialogHeader className="text-xl font-bold">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Content id={id} />
      </DialogContent>
    </Dialog>
  );
};

const Content = ({ id }: { id: string }) => {
  const { data: listing, isLoading } = useListingById(id);

  // TODO: add loader
  if (!listing || isLoading) return null;
  const { images, url } = listing;

  return (
    <>
      <ImageCarousel images={images} height={391} width={613} />
      <a href={url} target="_blank" rel="noreferrer">
        <Button fullWidth={false} className="text-sm">
          View Listing
        </Button>
      </a>
    </>
  );
};
