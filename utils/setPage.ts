import { Dispatch, SetStateAction } from "react";
import { CharacterResponse, EpisodeResponse } from "./types";

export const setPage = (
  baseURL: string,
  page: number,
  setPage: (value: SetStateAction<number>) => void,
  setInfo: Dispatch<SetStateAction<CharacterResponse | undefined>> |  Dispatch<SetStateAction<EpisodeResponse | undefined>>
) => {
  setPage(page);
  if (page > 1) {
    fetch(`${baseURL}?page=${page}`).then(
      (response) => response.json().then(setInfo)
    );
  } else {
    fetch(baseURL).then((response) =>
      response.json().then(setInfo)
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
