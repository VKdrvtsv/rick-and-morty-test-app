"use client";

import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

export const NavBar = () => {
  return (
    <div className="px-6 flex items-center justify-center w-full py-5 mb-3 bg-[#121212]">
      <div className="max-w-7xl w-full flex flex-row">
        <NavigationMenu.Root>
          <NavigationMenu.List className="flex flex-row font-medium gap-x-10 flex-wrap md:w-full w-60 items-center">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/" className="text-sm font-medium hover:bg-[#1F1F1F] px-4 py-2 rounded">
                  Episodes
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/characters" className="text-sm font-medium hover:bg-[#1F1F1F] px-4 py-2 rounded">
                  Characters
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/locations" className="text-sm font-medium hover:bg-[#1F1F1F] px-4 py-2 rounded">
                  Locations
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </div>
  );
};