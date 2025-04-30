import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingCard = () => {
  return (
    <div className=" flex flex-col gap-4 justify-center items-center m-6 mr-12">
      <div className="flex flex-col gap-2 w-full mt-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
};

export default LoadingCard;
