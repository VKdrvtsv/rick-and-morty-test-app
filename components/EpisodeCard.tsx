"use client"

import { FC } from "react";
import { Episode } from "./types";
import Image from "next/image";

interface Props {
  episode: Episode,
  onClick: (state: boolean, id: string) => void,
}

export const EpisodeCard: FC<Props> = ({episode, onClick}) => {
  const handleMoreClick = () => {
    onClick(true, episode.url);
  }

  return (
    <div className="border-b last:border-none p-1 flex flex-row gap-2 w-full justify-between">
      <div className="flex flex-row gap-5">
        <Image src="/episode-image.jpg" alt="Rick and Morty" width={60} height={80}/>
        <div className="flex flex-col h-20 justify-center gap-2">
          <p className="md:text-lg text-base font-medium">{episode.id}. {episode.name}</p>
          <p>{episode.air_date}</p>
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