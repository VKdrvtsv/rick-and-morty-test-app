import { FC } from "react";
import { LocationData } from "../utils/types";
import Image from "next/image";

interface Props {
  location: LocationData,
  onClick: (state: boolean, id: number) => void,
}

export const LocationCard: FC<Props> = ({location, onClick}) => {
  const handleMoreClick = () => {
    onClick(true, location.id);
  }

  return (
    <div className="border-b last:border-none p-1 flex flex-row gap-2 w-full justify-between">
      <div className="flex flex-row gap-5">
        <Image src="/episode-image.jpg" alt="Rick and Morty" width={60} height={80}/>
        <div className="flex flex-col h-20 justify-center gap-2">
          <p className="md:text-lg text-base font-medium">{location.id}. {location.name}</p>
          <p><b>Type:</b> {location.type}</p>
        </div>
      </div>

      <button 
        type="button" 
        onClick={handleMoreClick}
        className="hover:text-green-400 md:w-max w-min"
      >
        More information
      </button>
    </div>
  )
}