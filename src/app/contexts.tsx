/** @format */

"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import data from "./data.json";
import { Badge, Show, BadgeType } from "./types";

const badgeTypes = data.badgeTypes;

type ShowType = Show | null;
type YearType = number | null;

type MyBadgesContext = {
  myBadges: Badge[];
  setMyBadges: Dispatch<SetStateAction<Badge[]>>;
  activeShow: ShowType;
  setActiveShow: Dispatch<SetStateAction<ShowType>>;
  activeType: BadgeType;
  setActiveType: Dispatch<SetStateAction<BadgeType>>;
  activeYear: YearType;
  setActiveYear: Dispatch<SetStateAction<YearType>>;
  blackBadge: boolean;
  setBlackBadge: Dispatch<SetStateAction<boolean>>;
  manageBadges: (updateProp: string, show: Show, year: number, type?: BadgeType, black?: boolean) => void;
  defaultBadgeType: BadgeType;
};

export const MyBadgesContext = createContext<MyBadgesContext | null>(null);

export function MyBadgesContextProvider({ children }: { children: any }) {
  const defaultBadgeType = badgeTypes.find((type) => type.name === "Default") as BadgeType;
  const [myBadges, setMyBadges] = useState<Badge[]>([]);
  const [activeShow, setActiveShow] = useState<ShowType>(null);
  const [activeType, setActiveType] = useState<BadgeType>(defaultBadgeType!);
  const [activeYear, setActiveYear] = useState<YearType>(null);
  const [blackBadge, setBlackBadge] = useState<boolean>(false);

  const manageBadges = (updateProp: string, show: Show, year: number, type?: BadgeType, black?: boolean) => {
    setActiveShow(show);
    setActiveYear(year);
    type && setActiveType(type);

    const badgeExists = myBadges.filter((badge) => badge.show.pax === show.pax && badge.year === year).length > 0;

    const addBadge = (show: Show, year: number, type: BadgeType, black: boolean) => {
      let newBadges = [...myBadges, { show, year, type, black }]
        .sort((a, b) => a.show.month - b.show.month)
        .sort((a, b) => a.year - b.year);

      setMyBadges(newBadges);
    };

    const removeBadge = (show: Show, year: number) => {
      const idx = myBadges.findIndex((badge) => badge.show.pax === show.pax && badge.year === year);

      let deleteBadges = myBadges
        .filter((badge) => myBadges.indexOf(badge) !== idx)
        .sort((a, b) => a.show.month - b.show.month)
        .sort((a, b) => a.year - b.year);

      setMyBadges(deleteBadges);
      setActiveYear(0);
    };

    const updateBadge = (show: Show, year: number, type: BadgeType, black?: boolean) => {
      let updatedBadges = myBadges.map((badge) =>
        badge.show.pax === show.pax && badge.year === year ? { ...badge, type: type, black: black } : badge
      );

      setMyBadges(updatedBadges);
    };

    switch (updateProp) {
      case "year":
        if (!badgeExists) {
          addBadge(show, year, type!, black || false);
        } else if (badgeExists && year > 0) {
          removeBadge(show, year);
        }
        break;
      case "type":
      case "black":
        updateBadge(show, year, type!, black);
        break;
      default:
        addBadge(show, year, type!, black || false);
        break;
    }
  };

  return (
    <MyBadgesContext.Provider
      value={{
        myBadges,
        setMyBadges,
        activeShow,
        setActiveShow,
        activeYear,
        setActiveYear,
        activeType,
        setActiveType,
        blackBadge,
        setBlackBadge,
        manageBadges,
        defaultBadgeType,
      }}
    >
      {children}
    </MyBadgesContext.Provider>
  );
}

export function useMyBadgesContext() {
  const context = useContext(MyBadgesContext);

  if (!context) {
    throw new Error("useMyBadgesContext must be used within a MyBadgesContextProvider");
  }

  return context;
}
