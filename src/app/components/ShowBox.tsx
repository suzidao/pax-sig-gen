/** @format */

"use client";

import data from "../data.json";
import { useEffect, useState } from "react";
import { Show } from "../types";
import XIcon from "../../../public/x.svg";
import YearButton from "./YearButton";
import { useMyBadgesContext } from "../contexts";

interface Props {
  show: Show;
  clearShow: (show: string) => void;
}

const badgeTypes = data.badgeTypes;

export default function ShowBox(props: Props) {
  const {
    manageBadges,
    setActiveYear,
    activeYear,
    activeShow,
    activeType,
    setActiveType,
    myBadges,
    setMyBadges,
    defaultBadgeType,
  } = useMyBadgesContext();

  const { show, clearShow } = props;
  const [isActive, setIsActive] = useState(true);
  const [selectedType, setSelectedType] = useState("Default");
  const [blackBadge, setBlackBadge] = useState(false);
  const [allYearsSelected, setAllYearsSelected] = useState(false);

  const findType = (type: string) => badgeTypes.find((badgeType) => badgeType.name === type);

  // compare current month with show month to add future show
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = currentMonth > show.month ? new Date().getFullYear() + 1 : new Date().getFullYear();
  const allYears: number[] = [];
  const lastShow = show.last ? show.last : currentYear;

  for (let i = show.first; i <= lastShow; i++) {
    show.skip?.includes(i) ? null : allYears.push(i);
  }

  useEffect(() => {
    if (!activeType) {
      let type = findType(selectedType);
      setActiveType(type);
    }
  }, [activeType]);

  useEffect(() => {
    if (allYearsSelected) {
      let newBadges = [];

      for (let i = 0; i < allYears.length; i++) {
        const badgeExists = !!myBadges.find((badge) => badge.show.pax === show.pax && badge.year === allYears[i]);

        if (!badgeExists) {
          newBadges.push({ show: show, year: allYears[i], type: activeType, black: blackBadge });
        }
      }

      let updatedBadges = myBadges
        .concat(newBadges)
        .sort((a, b) => a.show.month - b.show.month)
        .sort((a, b) => a.year - b.year);

      setMyBadges(updatedBadges);
    }
  }, [allYearsSelected]);

  const toggleShow = () => {
    if (isActive) {
      clearShow(show.pax);
      setActiveYear(0);
      setIsActive(false);
      setBlackBadge(false);
      setActiveType(defaultBadgeType);
      setSelectedType("Default");
    } else {
      setIsActive(true);
    }
  };

  const clearYearOnShowChange = () => {
    if (!!activeShow && activeShow.pax !== show.pax) {
      setActiveYear(0);
    }
  };

  const handleType = (e: any) => {
    let value = e.target.value;
    let type = findType(value);

    setSelectedType(value);
    manageBadges("type", show, activeYear!, type, blackBadge);

    clearYearOnShowChange();
  };

  const handleBlack = (e: any) => {
    setBlackBadge(e.target.checked);
    manageBadges("black", show, activeYear!, activeType, e.target.checked);

    clearYearOnShowChange();
  };

  const handleAll = (e: any) => {
    setAllYearsSelected(e.target.checked);
    e.target.checked ? setActiveYear(0) : clearShow(show.pax);
  };

  return (
    <div key={show.pax} className="w-full">
      <h1
        className="font-bold text-lg text-left mb-2 transition-colors"
        style={isActive ? { color: `${show.colors[0]}` } : { color: "#555" }}
      >
        <button type="button" onClick={toggleShow} className="flex items-center">
          <XIcon
            fill={isActive ? show.colors[0] : "#555"}
            className={
              "relative mr-2 transition-all " +
              (isActive ? "rotate-0 w-4 h-4" : "-rotate-45 w-3 h-3 my-1 mr-2.5 ml-0.5")
            }
          />
          PAX {show.pax}
        </button>
      </h1>
      <div
        className={
          "flex w-full flex-wrap transition-all ease-in-out overflow-hidden " +
          (isActive ? "max-h-96 xs:max-h-60 mb-4" : "max-h-0 mb-2")
        }
      >
        <div
          className="w-full px-3 xs:px-4 py-2 flex flex-row flex-nowrap items-center justify-between"
          style={{ borderBottom: `1px solid ${show.colors[0]}`, background: `${show.colors[0]}66` }}
        >
          <label className="w-36 xs:w-auto flex flex-wrap xs:flex-nowrap xs:basis-auto items-center mr-auto">
            <div className="mr-2 whitespace-nowrap">
              {activeYear! > 0 && activeShow?.pax === show.pax && <span className="font-bold pr-2">{activeYear}</span>}
              Badge Type:
            </div>
            <select
              className="border border-solid p-px my-1"
              style={{ border: `1px solid ${show.colors[0]}` }}
              value={selectedType}
              onChange={handleType}
              name={show.pax + "BadgeSelector"}
            >
              {badgeTypes.map((type, idx) => {
                return (
                  <option key={type.name + idx} value={type.name}>
                    {type.name}
                  </option>
                );
              })}
            </select>
          </label>
          <div
            className={
              "flex flex-row flex-wrap basis-full gap-y-2 text-left " +
              (allYears.length > 1 ? "justify-end" : "justify-start")
            }
          >
            <label className="pl-4 mb-0 pr-1.5 flex items-center justify-self-start whitespace-nowrap">
              <input
                type="checkbox"
                className="mr-2"
                name={show.pax + "Black"}
                onChange={handleBlack}
                checked={blackBadge}
              />
              Enforcer
            </label>

            {allYears.length > 1 && (
              <label className="pl-4 flex items-center mr-px xs:ml-auto whitespace-nowrap">
                <input
                  type="checkbox"
                  className="mr-2"
                  name={show.pax + "CheckAll"}
                  onChange={handleAll}
                  checked={allYearsSelected}
                />
                Select All
              </label>
            )}
          </div>
        </div>
        <div className="pl-3 xs:pl-4 pt-3 xs:pt-4 pr-2 pb-2 w-full" style={{ background: `${show.colors[0]}44` }}>
          {allYears.map((year) => {
            return (
              <YearButton
                key={show.pax + year}
                year={year}
                show={show}
                isOpen={isActive}
                selectedType={findType(selectedType)}
                blackBadge={blackBadge}
                setAllYearsSelected={setAllYearsSelected}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
