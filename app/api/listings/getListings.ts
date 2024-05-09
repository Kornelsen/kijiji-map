import { LngLatBounds } from "mapbox-gl";

export const getListings = async (bounds: LngLatBounds) => {
  const uri = `http://localhost:3000/api/listings?bounds=${bounds._sw.lng},${bounds._sw.lat},${bounds._ne.lng},${bounds._ne.lat}`;
  const resp = await fetch(uri);
  const result = await resp.json();
  return result;
};
