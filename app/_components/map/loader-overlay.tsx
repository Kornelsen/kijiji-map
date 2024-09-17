import { Loader } from "../shared";

export const LoaderOverlay = () => {
  return (
    <div className="absolute left-1/2 top-1/3 bg-white rounded p-2">
      <Loader />
    </div>
  );
};
