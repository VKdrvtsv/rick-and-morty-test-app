"use client";

import { FC } from "react";
import { Character } from "./types";
import Image from "next/image";

interface Props {
  character: Character;
}

export const CharacterCard: FC<Props> = ({ character }) => {
  return (
    <div className="border-b last:border-none p-1 flex flex-row gap-2 w-full justify-between">
      <div className="flex flex-row gap-5">
        <Image
          src={character.image}
          alt={character.name}
          width={80}
          height={80}
        />
        <div className="flex flex-col h-20 justify-center gap-2">
          <p className="md:text-lg text-base font-medium">
            {character.id}. {character.name}
          </p>
          <div className="flex flex-row gap-3">
            <p><b>Species:</b> {character.species}</p>
            <p><b>Gender:</b> {character.gender}</p>
            <p><b>Status:</b> {character.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
