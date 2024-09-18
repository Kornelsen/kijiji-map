"use client";

import { useState } from "react";
import { useListingById } from "@/app/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button, Loader } from "../shared";
import { ListingThumbnail } from "./listing-thumbnail";
import { ImageCarousel } from "../shared";
import { useGlobalStore } from "@/app/store";

type Props = {
  id: string;
  image: string;
  title: string;
};

export const ImagesDialog = ({ id, image, title }: Props) => {
  const setFocusedListing = useGlobalStore((state) => state.setFocusedListing);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpen = () => setDialogOpen(true);
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    setFocusedListing("");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ListingThumbnail
          image={image}
          alt={title}
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

  if (isLoading)
    return (
      <div className="m-auto">
        <Loader />
      </div>
    );
  if (!listing || isLoading) return null;
  const { images, url } = listing.properties;

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
