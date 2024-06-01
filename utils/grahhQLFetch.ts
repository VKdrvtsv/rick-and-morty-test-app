import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { LocationResponse } from "./types";

export const fetchDataGraphQL = async (
  page: number,
  setInfo: Dispatch<SetStateAction<LocationResponse | undefined>>
) => {
  const query = `
          query {
            locations(page: ${page}) {
              info {
                count
                pages
                next
                prev
              }
              results {
                id
                name
                type
                dimension
                residents {
                  name
                }
                created
              }
            }
          }
        `;

  const url = new URL("https://rickandmortyapi.com/graphql");
  url.searchParams.append("query", query);

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    setInfo(response.data.data.locations);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
            