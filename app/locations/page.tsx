"use client";

import { Pagination } from "@/components/Pagination";
import { LocationData, LocationResponse } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../loading";
import Image from "next/image";
import { Popup } from "@/components/Popup";
import { LocationCard } from "@/components/LocationCard";
import { fetchDataGraphQL } from "@/utils/grahhQLFetch";

const LocationsTab = () => {
  const [locationInfo, setLocationInfo] = useState<LocationResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullCharactersList, setIsFullCharactersList] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData>();

  const pages: number[] = [];

  useEffect(() => {
    fetchDataGraphQL(1, setLocationInfo);
  }, []);

  if (!locationInfo) {
    return <Loading />;
  }

  const handleOpenPopup = async (state: boolean, id: number) => {
    setIsOpenPopup(state);
    setIsLoading(true);
    const curLocation = await locationInfo.results.find(
      (location) => location.id === id
    );
    setCurrentLocation(curLocation);
    setIsLoading(false);
  };

  if (locationInfo?.info) {
    for (let i = 1; i <= locationInfo?.info.pages; i++) {
      pages.push(i);
    }
  }

  const handleMore = () => {
    setIsFullCharactersList(true);
  };

  const handleClosePopup = () => {
    setIsOpenPopup(false);
    setIsFullCharactersList(false);
  };

  const takePageNumbers = () => {
    if (pages.length > 4) {
      if (currentPage <= 3) {
        return pages.slice(0, 4);
      }

      if (currentPage > 3 && currentPage < locationInfo.info.pages - 1) {
        return pages.slice(currentPage - 3, currentPage + 1);
      }

      return pages.slice(locationInfo.info.pages - 4, locationInfo.info.pages);
    }

    return pages;
  };

  const pageNumbersToShow = takePageNumbers();

  const handleSetPage = async (page: number) => {
    setCurrentPage(page);
    if (page > 1) {
      fetchDataGraphQL(page, setLocationInfo);
    } else {
      fetchDataGraphQL(1, setLocationInfo);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTogglePage = async (direction: "next" | "prev") => {
    let searchPage = 1;

    if (direction === "next") {
      setCurrentPage(currentPage + 1);
      searchPage = currentPage + 1;
    } else {
      setCurrentPage(currentPage - 1);
      searchPage = currentPage - 1;
    }
    fetchDataGraphQL(searchPage, setLocationInfo);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-6xl w-full min-h-dvh flex justify-between flex-col bg-white text-black p-7 gap-6">
      <div className="flex flex-row justify-between">
        <h2 className="md:text-3xl text-xl">
          &quot;Rick and Morty&quot; location list:
        </h2>
        <div>
          {locationInfo.info && (
            <Pagination
              pages={pageNumbersToShow}
              currentPage={currentPage}
              setPage={handleSetPage}
              togglePage={handleTogglePage}
              next={locationInfo.info.next}
              prev={locationInfo.info.prev}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col border rounded p-3">
        {locationInfo.results &&
          locationInfo.results.map((location) => {
            return (
              <LocationCard
                location={location}
                onClick={handleOpenPopup}
                key={location.id}
              />
            );
          })}
      </div>

      <div className="self-center">
        {locationInfo.info && (
          <Pagination
            pages={pageNumbersToShow}
            currentPage={currentPage}
            setPage={handleSetPage}
            togglePage={handleTogglePage}
            next={locationInfo.info.next}
            prev={locationInfo.info.prev}
          />
        )}
      </div>

      {isOpenPopup && (
        <Popup onClose={handleClosePopup}>
          <div className="flex items-center justify-center h-full z-10">
            {isLoading && <Loading />}
            {error && <p className="text-xl">Oops, something went wrong.</p>}
            {!isLoading && !error && currentLocation && (
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
                      {currentLocation.name}
                    </p>
                    <p>
                      <b>Type: </b>
                      {currentLocation.type}
                    </p>
                    <p>
                      <b>Dimension: </b>
                      {currentLocation.dimension}
                    </p>
                    <div className="">
                      <p className="font-medium md:text-xl text-lg">
                        Residents:
                      </p>
                      {!currentLocation.residents.length && (
                        <p>There is no residents on this location.</p>
                      )}
                      {currentLocation.residents.length <= 3 ? (
                        <p>
                          {currentLocation.residents
                            .map((res) => res.name)
                            .join(", ")}
                        </p>
                      ) : !isFullCharactersList ? (
                        <div className="flex flex-row gap-1">
                          <p>
                            {currentLocation.residents
                              .map((res) => res.name)
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
                          {currentLocation.residents
                            .map((res) => res.name)
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
    </div>
  );
};

export default LocationsTab;
