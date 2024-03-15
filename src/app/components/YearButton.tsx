/** @format */

"use client";

import { useEffect, useState } from "react";
import { BadgeType, Show } from "../types";
import { useMyBadgesContext } from "../contexts";

interface Props {
  year: number;
  show: Show;
  isOpen: boolean;
  selectedType: BadgeType;
  blackBadge: boolean;
  setAllYearsSelected: (allYearsSelected: boolean) => void;
}

export default function YearButton(props: Props) {
  const { manageBadges, myBadges } = useMyBadgesContext();
  const { year, show, isOpen, selectedType, blackBadge, setAllYearsSelected } = props;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    !isOpen && setIsSelected(false);
  }, [isOpen, setIsSelected]);

  useEffect(() => {
    let badgeExists = !!myBadges.find((badge) => badge.show.pax === show.pax && badge.year === year);

    setIsSelected(badgeExists);

    !badgeExists && setAllYearsSelected(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myBadges]);

  const selectYear = () => {
    if (isSelected) {
      setIsSelected(false);
      manageBadges("year", show, year);
    } else {
      setIsSelected(true);
      manageBadges("year", show, year, selectedType, blackBadge);
    }
  };

  return (
    <button
      type="button"
      className={
        "mr-2 mb-2 w-14 border-solid border-black border py-1 rounded-sm transition-all " +
        (isSelected ? "font-medium text-white " : "") +
        (show.pax === "AUS" ? " text-black " : "")
      }
      style={isSelected ? { backgroundColor: `${show.color}` } : { backgroundColor: "white" }}
      key={`PAX ${show.pax} ${year}`}
      onClick={selectYear}
    >
      {year}
    </button>
  );
}
