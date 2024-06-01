"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { EpisodeCard } from "@/components/EpisodeCard";
import { Character, Episode, EpisodeResponse } from "@/utils/types";
import { Pagination } from "@/components/Pagination";
import { Popup } from "@/components/Popup";
import Loading from "./loading";
import { setPage } from "@/utils/setPage";

export default function Home() {
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeResponse>();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>();
  const [currentEpisodeCharacters, setCurrentEpisodeCharacters] = useState<
    Character[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullCharactersList, setIsFullCharactersList] = useState(false);
  const [error, setError] = useState(false);
  const pages = [];
  const [currentPage, setCurrentPage] = useState(1);
  const baseURL = "https://rickandmortyapi.com/api/episode";

  useEffect(() => {
    fetch(baseURL).then((response) => response.json().then(setEpisodesInfo));
  }, []);

  const handleOpenPopup = async (state: boolean, url: string) => {
    setIsOpenPopup(state);
    setIsLoading(true);
    fetch(url)
      .then((response) => response.json().then(setCurrentEpisode))
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentEpisode) {
      const fetchCharacters = async () => {
        try {
          const responses = await Promise.all(
            currentEpisode.characters.map((url) => fetch(url))
          );
          const data = await Promise.all(
            responses.map((response) => response.json())
          );
          setCurrentEpisodeCharacters(data);
        } catch (error) {
          console.error("Error fetching additional data:", error);
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
  };

  const handleSetPage = (page: number) => {
    setPage(baseURL, page, setCurrentPage, setEpisodesInfo);
  };

  const handleTogglePage = (direction: "next" | "prev", url?: string) => {
    if (direction === "next") {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }

    if (url) {
      fetch(url).then((response) => response.json().then(setEpisodesInfo));
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="flex w-full h-full justify-center">
      <div className="max-w-6xl w-full h-full flex justify-between flex-col bg-white text-black p-7 gap-6">
        <div className="flex flex-row justify-between">
          <h2 className="md:text-3xl text-xl">
            &quot;Rick and Morty&quot; episode list:
          </h2>
          <div>
            <Pagination
              pages={pages}
              currentPage={currentPage}
              setPage={handleSetPage}
              togglePage={handleTogglePage}
              next={episodesInfo.info.next}
              prev={episodesInfo.info.prev}
            />
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

        <div className="self-center">
          <Pagination
            pages={pages}
            currentPage={currentPage}
            setPage={handleSetPage}
            togglePage={handleTogglePage}
            next={episodesInfo.info.next}
            prev={episodesInfo.info.prev}
          />
        </div>
      </div>

      {isOpenPopup && (
        <Popup onClose={handleClosePopup}>
          <div className="flex items-center justify-center h-full z-10">
            {isLoading && <Loading />}
            {error && <p className="text-xl">Oops, something went wrong.</p>}
            {!isLoading && !error && currentEpisode && (
              <div>
                <div className="flex flex-row gap-5 max-h-[500px]">
                  <div className="shrink-0">
                    <Image
                      src="/episode-image.jpg"
                      alt="Rick and Morty"
                      width={150}
                      height={200}
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <p className="md:text-2xl text-lg font-medium">
                      {currentEpisode.name}
                    </p>
                    <p>{currentEpisode.air_date}</p>
                    <div>
                      <p className="font-medium  md:text-xl text-lg">
                        Characters:
                      </p>
                      {currentEpisode.characters.length <= 3 ? (
                        <p>
                          {currentEpisodeCharacters
                            .map((char) => char.name)
                            .join(", ")}
                        </p>
                      ) : !isFullCharactersList ? (
                        <div className="flex flex-row gap-1">
                          <p>
                            {currentEpisodeCharacters
                              .map((char) => char.name)
                              .slice(0, 3)
                              .join(", ")}{" "}
                            <button
                              type="button"
                              onClick={handleMore}
                              className="text-green-400"
                            >
                              more...
                            </button>
                          </p>
                        </div>
                      ) : (
                        <p className="md:max-h-96 max-h-64 overflow-y-auto">
                          {currentEpisodeCharacters
                            .map((char) => char.name)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Popup>
      )}
    </main>
  );
}
