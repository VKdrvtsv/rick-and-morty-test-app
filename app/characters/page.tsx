"use client";

import { CharacterResponse } from "@/utils/types";
import { useEffect, useState } from "react";
import cn from "classnames";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import * as RadioGroup from "@radix-ui/react-radio-group";

import Loading from "../loading";
import { Pagination } from "@/components/Pagination";
import { CharacterCard } from "@/components/Character";
import { Popup } from "@/components/Popup";
import { setPage } from "@/utils/setPage";

const CharactersTab = () => {
  const [charactersInfo, setCharactersInfo] = useState<CharacterResponse>();
  const pages: number[] = [];
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [filterByStatus, setFilterByStatus] = useState("all");
  const [filterByGender, setFilterByGender] = useState("all");
  const baseURL = "https://rickandmortyapi.com/api/character";

  useEffect(() => {
    fetch(baseURL).then((response) => response.json().then(setCharactersInfo));
  }, []);

  if (!charactersInfo) {
    return <Loading />;
  }

  if (charactersInfo.results) {
    for (let i = 1; i <= charactersInfo?.info.pages; i++) {
      pages.push(i);
    }
  }

  const takePageNumbers = () => {
    if (pages.length > 4) {
      if (currentPage <= 3) {
        return pages.slice(0, 4);
      }

      if (currentPage > 3 && currentPage < charactersInfo.info.pages - 1) {
        return pages.slice(currentPage - 3, currentPage + 1);
      }

      return pages.slice(
        charactersInfo.info.pages - 4,
        charactersInfo.info.pages
      );
    }

    return pages;
  };

  const pageNumbersToShow = takePageNumbers();

  const handleSetPage = (page: number) => {
    setPage(baseURL, page, setCurrentPage, setCharactersInfo);
  };

  const handleTogglePage = (direction: "next" | "prev", url?: string) => {
    if (direction === "next") {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }

    if (url) {
      fetch(url).then((response) => response.json().then(setCharactersInfo));
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClosePopup = () => {
    setIsOpenPopup(false);
  };

  const handleFilterByStatus = (status: string) => {
    setFilterByStatus(status);
  };

  const handleFilterByGender = (status: string) => {
    setFilterByGender(status);
  };

  const constructURL = (nameQuery: string) => {
    let fetchURL = baseURL;
    let params = new URLSearchParams();

    if (filterByStatus !== "all") {
      params.append("status", filterByStatus);
    }
    if (filterByGender !== "all") {
      params.append("gender", filterByGender);
    }
    if (nameQuery) {
      params.append("name", nameQuery);
    }

    if (params.toString()) {
      fetchURL += `?${params.toString()}`;
    }

    return fetchURL;
  };

  const handleFilterSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const fetchURL = constructURL(filterQuery);

    fetch(fetchURL).then((response) => response.json().then(setCharactersInfo));
    setIsOpenPopup(false);
    setCurrentPage(1);
  };

  const handleFilterByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilterQuery(e.target.value);

    const fetchURL = constructURL(e.target.value);
    console.log(fetchURL);

    fetch(fetchURL)
      .then((response) => response.json())
      .then(setCharactersInfo);

    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl w-full min-h-dvh flex justify-between flex-col bg-white text-black p-7 gap-6">
      <div className="flex flex-row justify-between">
        <h2 className="md:text-3xl text-xl">
          &quot;Rick and Morty&quot; character list:
        </h2>

        <div className="flex flex-row gap-4">
          <button type="button" onClick={() => setIsOpenPopup(true)}>
            <MixerHorizontalIcon className="w-5 h-5" />
          </button>
          <div
            className={cn(
              "flex flex-row w-52 gap-1 pl-3 pr-3 py-2 border rounded items-center xl:text-base text-sm text-dashboard-secondary hover:border-green-400",
              isFocused && "border-green-200"
            )}
          >
            <input
              type="text"
              className="border-0 outline-none w-full"
              placeholder="Search name..."
              value={filterQuery}
              onChange={handleFilterByName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmit={() => setIsFocused(false)}
            />
            <MagnifyingGlassIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col border rounded p-3 h-full min-h-96">
        {charactersInfo.results ? (
          charactersInfo.results.map((character) => {
            return <CharacterCard character={character} key={character.id} />;
          })
        ) : (
          <p className="font-medium text-xl text-center">
            Unfortunately, no characters match your search query.
          </p>
        )}
      </div>

      <div className="self-center">
        {charactersInfo.info && (
          <Pagination
            pages={pageNumbersToShow}
            currentPage={currentPage}
            setPage={handleSetPage}
            togglePage={handleTogglePage}
            next={charactersInfo.info.next}
            prev={charactersInfo.info.prev}
          />
        )}
      </div>

      {isOpenPopup && (
        <Popup onClose={handleClosePopup}>
          <div className="flex flex-col gap-3">
            <p className="text-xl">Filter by:</p>

            <form className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-bold">Gender</p>
                <RadioGroup.Root
                  className="flex flex-row flex-wrap gap-3"
                  aria-label="View density"
                  onValueChange={handleFilterByGender}
                  value={filterByGender}
                >
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="all"
                      id="r1"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="r1">
                      All
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="female"
                      id="r2"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="r2">
                      Female
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="male"
                      id="r3"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="r3">
                      Male
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="genderless"
                      id="r4"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="r4">
                      Genderless
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="unknown"
                      id="r5"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="r5">
                      Unknown
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-bold">Status</p>

                <RadioGroup.Root
                  className="flex flex-row gap-3"
                  aria-label="View density"
                  onValueChange={handleFilterByStatus}
                  value={filterByStatus}
                >
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="all"
                      id="s1"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="s1">
                      All
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="alive"
                      id="s2"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="s2">
                      Alive
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="dead"
                      id="s3"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="s3">
                      Dead
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroup.Item
                      className="border border-black w-5 h-5 rounded-full flex items-center justify-center"
                      value="unknown"
                      id="s4"
                    >
                      <RadioGroup.Indicator className="bg-black h-2 w-2 rounded" />
                    </RadioGroup.Item>
                    <label className="" htmlFor="s4">
                      Unknown
                    </label>
                  </div>
                </RadioGroup.Root>
              </div>

              <div className="flex w-full items-center justify-center mt-5 ">
                <button
                  type="submit"
                  onClick={handleFilterSubmit}
                  className="flex self-center border py-2 px-4 rounded hover:bg-green-100 hover:border-green-400"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default CharactersTab;
