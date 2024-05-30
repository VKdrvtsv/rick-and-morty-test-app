import { FC } from "react";
import cn from "classnames";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

interface Props {
  pages: number[];
  currentPage?: number;
  setPage: (page: number) => void;
  togglePage: (url: string, direction: "next" | "prev") => void;
  next: string | null;
  prev: string | null;
}

export const Pagination: FC<Props> = ({ pages, currentPage = 1, setPage, togglePage, next, prev }) => {
  return (
    <div className="flex flex-row gap-1">
      <button
        disabled={!prev}
        type="button"
        className={cn(
          "h-8 w-8 border flex items-center justify-center rounded hover:bg-green-100 hover:border-green-400",
          { "hover:bg-transparent hover:border-inherit": !prev }
        )}
        onClick={() => togglePage(prev || "", "prev")}
      >
        <ArrowLeftIcon />
      </button>

      {pages.map((page) => {
        return (
          <button
            type="button"
            key={page}
            className={cn(
              "h-8 w-8 border flex items-center justify-center rounded hover:bg-green-100 hover:border-green-400",
              { "border-green-400": currentPage === page }
            )}
            onClick={() => setPage(page)}
          >
            <p>{page}</p>
          </button>
        );
      })}

      <button
        disabled={!next}
        type="button"
        className={cn(
          "h-8 w-8 border flex items-center justify-center rounded hover:bg-green-100 hover:border-green-400",
          { "hover:bg-transparent hover:border-inherit": !next }
        )}
        onClick={() => togglePage(next || "", "next")}
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
};
