"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

import { EpisodeCard } from "@/components/EpisodeCard";
import { Character, Episode, EpisodeResponse } from "@/components/types";
import Loading from "./loading";
import { Pagination } from "@/components/Pagination";

export default function Home() {
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeResponse>();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>();
  const [currentEpisodeCharacters, setCurrentEpisodeCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullCharactersList, setIsFullCharactersList] = useState(false);
  const [error, setError] = useState(false);
  const pages = [];
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/episode").then((response) =>
      response.json().then(setEpisodesInfo)
    );
  }, []);

  const handleOpenPopup = async (state: boolean, url: string) => {
    setIsOpenPopup(state);
    setIsLoading(true);
    fetch(url)
      .then((response) => response.json().then(setCurrentEpisode))
      .catch(() => {
        setError(true);
        setIsLoading(false);
      }) 
  };

  useEffect(() => {
    if (currentEpisode) {
      const fetchCharacters = async () => {
        try {
          const responses = await Promise.all(currentEpisode.characters.map(url => fetch(url)));
          const data = await Promise.all(responses.map(response => response.json()));
          setCurrentEpisodeCharacters(data);
        } catch (error) {
          console.error('Error fetching additional data:', error);
        }

        setIsLoading(false);
      };

      fetchCharacters();
    }
  }, [currentEpisode]);

    
  if (!episodesInfo) {
    return <Loading />;
  }

  for (let i = 1; i <= episodesInfo?.info.pages; i++) {
    pages.push(i);
  }

  const handleMore = () => {
    setIsFullCharactersList(true);
  };

  const handleClosePopup = () => {
    setIsOpenPopup(false);
    setIsFullCharactersList(false);
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handleSetPage = (page: number) => {
    setCurrentPage(page);
    if (page > 1) {
      fetch(`https://rickandmortyapi.com/api/episode?page=${page}`).then((response) =>
        response.json().then(setEpisodesInfo)
      );
    } else {
      fetch("https://rickandmortyapi.com/api/episode").then((response) =>
        response.json().then(setEpisodesInfo)
      );
    }
  }

  const handleTogglePage = (url: string, direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }

    fetch(url).then((response) =>
      response.json().then(setEpisodesInfo)
    );
  }

  return (
    <main className="flex w-full h-full justify-center">
      <div className="max-w-6xl w-full h-full flex justify-between flex-col bg-white text-black p-7 gap-6">
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl">&quot;Rick and Morty&quot; episode list:</h2>
          <div>
            <Pagination 
              pages={pages} 
              currentPage={currentPage} 
              setPage={handleSetPage} 
              togglePage={handleTogglePage} 
              next={episodesInfo.info.next} 
              prev={episodesInfo.info.prev}/>
          </div>
        </div>
        <div className="flex flex-col border rounded p-3">
          {episodesInfo.results.map((episode) => {
            return (
              <EpisodeCard
                episode={episode}
                onClick={handleOpenPopup}
                key={episode.id}
              />
            );
          })}
        </div>
      </div>

      {isOpenPopup && (
        <div className="fixed inset-0 bg-[#000000AA] h-screen w-screen overflow-hidden flex items-center justify-center p-10" onClick={handleOverlayClick}>
          <div className="bg-white text-black p-6 flex flex-col rounded max-w-[600px] min-h-64 min-w-64">
            <div className="flex flex-row justify-between">
              <div />
              <button type="button" onClick={handleClosePopup}>
                <Cross2Icon />
              </button>
            </div>

            <div className="flex items-center justify-center h-full z-10">
              {isLoading && <Loading />}
              {error && <p className="text-xl">Oops, something went wrong.</p>}
              {!isLoading && !error && currentEpisode && (
                <div>
                  <div className="flex flex-row gap-5">
                    <div className="shrink-0">
                      <Image
                        src="/episode-image.jpg"
                        alt="Rick and Morty"
                        width={150}
                        height={200}
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <p className="text-2xl font-medium">
                        {currentEpisode.name}
                      </p>
                      <p>{currentEpisode.air_date}</p>
                      <div>
                        <p className="font-medium text-xl">Characters:</p>
                        {currentEpisode.characters.length <= 3 ? (
                          <p>{currentEpisodeCharacters.map(char => char.name).join(', ')}</p>
                        ) : !isFullCharactersList ? (
                          <div className="flex flex-row gap-1">
                            <p>{currentEpisodeCharacters.map(char => char.name).slice(0, 3).join(', ')} <button type="button" onClick={handleMore} className="text-green-400">
                              more...
                            </button></p>
                            
                          </div>
                        ) : (
                          <p>{currentEpisodeCharacters.map(char => char.name).join(', ')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
