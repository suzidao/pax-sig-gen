/** @format */
"use client";

import data from "./data.json";
import { useMyBadgesContext } from "./contexts";
import BadgeBox from "./components/BadgeBox";
import ShowBox from "./components/ShowBox";
import { useEffect, useState } from "react";

const shows = data.shows;

export default function Home() {
  const { myBadges, setMyBadges, setActiveShow } = useMyBadgesContext();
  const [containerHeight, setContainerHeight] = useState(36);

  const clearShow = (show: string) => {
    setMyBadges(myBadges.filter((badge) => !badge.show.pax.includes(show)));
    setActiveShow(null);
  };

  useEffect(() => {
    const container = document.getElementById("container");
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(container.offsetHeight);
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="w-full bg-white fixed z-10 grid place-items-center py-2 px-2 sm:px-4 border-b border-gray-500"
        id="container"
      >
        <BadgeBox />
      </div>

      <div
        className="max-w-4xl w-full items-center flex-col text-sm flex sm:mt-3 px-4 pb-8 sm:px-8 transition-all ease-in-out"
        style={{ paddingTop: `${containerHeight + 12}px` }}
      >
        {shows.map((show) => {
          return <ShowBox show={show} key={show.pax} clearShow={clearShow} />;
        })}
      </div>
    </main>
  );
}
