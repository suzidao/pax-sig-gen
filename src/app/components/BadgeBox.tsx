/** @format */

"use client";

import Anta from "next/font/local";
import BadgeIcon from "../../../public/badge.svg";
import { useMyBadgesContext } from "../contexts";
import { useEffect, useState } from "react";
import downloadjs from "downloadjs";
import { toPng, toSvg } from "html-to-image";

const anta = Anta({
  src: "../Anta-Regular.ttf",
});

export default function BadgeBox() {
  const { myBadges, setMyBadges } = useMyBadgesContext();
  const [rowNum, setRowNum] = useState<number>(1);
  const [boxWidth, setBoxWidth] = useState<number>(0);
  const [boxHeight, setBoxHeight] = useState<number>(29);

  const rowOptions = [];

  for (let i = 1; i <= 12; i++) {
    rowOptions.push(i);
  }

  useEffect(() => {
    const box = document.getElementById("badgeBox");
    if (!box) return;

    const resizeObserver = new ResizeObserver(() => {
      setBoxHeight(box.offsetHeight);
    });
    resizeObserver.observe(box);

    if (rowNum > 1) {
      setBoxWidth(Math.ceil(myBadges.length / rowNum) * 24);
    } else {
      !!box ?? setBoxWidth(box.offsetWidth);
    }

    return () => resizeObserver.disconnect();
  }, [myBadges.length, rowNum]);

  const handleChange = (e: any) => {
    setRowNum(e.target.value);
  };

  const handleClick = () => {
    const savedBadges = document.getElementById("badgeBox");
    const elements = document.querySelectorAll("div.ribbonTxt");

    if (!savedBadges) return;

    if (!!elements) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("export-class");
      }
    }

    toPng(savedBadges, {
      cacheBust: true,
      pixelRatio: 1,
      height: boxHeight,
      width: boxWidth,
    })
      .then((dataURL) => {
        const img = new Image();
        img.src = dataURL;
        img.style.imageRendering = "pixelated";

        downloadjs(dataURL, "badges.png", "image/png");
      })
      .then(() => {
        for (let i = 0; i < elements.length; i++) {
          elements[i].classList.remove("export-class");
        }
      });
    // TODO: get SVG export working

    // await toSvg(savedBadges, { cacheBust: true, type: "image/svg+xml" }).then((dataURL) => {
    //   let img = new Image();
    //   img.src = dataURL;

    //   downloadjs(dataURL, "badges.svg", "image/svg+xml");
    // });
  };

  return (
    <>
      <div className="relative w-full flex flex-row items-center justify-between">
        <div className="flex flex-col xs:flex-row gap-2 xs:items-center">
          <div className="text-sm whitespace-nowrap">
            Badge Count: <strong>{myBadges.length}</strong>
          </div>
          <label className="xs:ml-4 text-sm whitespace-nowrap">
            # of Rows:
            <select
              className="ml-2 pl-1 border border-solid border-gray-500 w-12"
              value={rowNum}
              onChange={handleChange}
              name="rowCounter"
            >
              {rowOptions.map((num, idx) => {
                return (
                  <option key={`row${idx + 1}`} value={num}>
                    {num}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <div className="flex xs:flex-nowrap flex-col xs:flex-row gap-2 space-between items-center">
          <button
            type="button"
            className="border border-solid border-gray-600 rounded-sm text-sm px-3 py-px"
            onClick={handleClick}
          >
            Save
          </button>
          <button type="button" className="text-sm px-2 py-px whitespace-nowrap" onClick={() => setMyBadges([])}>
            Clear All
          </button>
        </div>
      </div>
      {myBadges.length > 0 && (
        <div className="p-2 pt-4">
          <div
            id="badgeBox"
            className="flex gap-px flex-wrap h-auto"
            style={rowNum > 1 ? { width: `${boxWidth}px` } : { width: "auto" }}
          >
            {myBadges.map((badge, idx) => {
              const shortYear = badge.year.toString().substring(2);
              const currentYear = new Date().getFullYear();
              const currentMonth = new Date().getMonth() + 1;
              const isFuture =
                badge.year > currentYear || (badge.year === currentYear && badge.show.month > currentMonth);
              const badgeType = badge.type;
              const ribbonColor = badgeType!.color;
              const hasRibbon = badgeType!.abbr !== null;
              const useDarkTxt = badgeType!.abbr && ["OMG", "CON", "MED", "VND", "VIP"].includes(badgeType!.abbr);
              const useBlackBadge = badge.black;

              return (
                <div key={`badge${idx}`} className="relative w-[23px] h-[29px]">
                  <div
                    className={
                      "absolute w-full grid place-items-center text-[14px] h-[29px] leading-none " +
                      anta.className +
                      (hasRibbon ? " -mt-[2px] ribbonYear" : " mt-px year")
                    }
                    style={useBlackBadge || isFuture ? { color: `${badge.show.color}` } : { color: "white" }}
                  >
                    {shortYear}
                  </div>
                  <div
                    className={
                      "absolute w-full text-[7px] flex items-center justify-center bottom-[2px] h-[7px] font-medium tracking-wider leading-none " +
                      (hasRibbon ? "block" : "hidden")
                    }
                    style={{ backgroundColor: `${ribbonColor}` }}
                  >
                    <div
                      className={
                        "adjust-export ribbonTxt h-[7px] w-full flex items-center justify-center leading-none mt-px ml-px " +
                        anta.className +
                        (useDarkTxt ? " text-black" : " text-white")
                      }
                    >
                      {badgeType?.abbr}
                    </div>
                  </div>
                  <BadgeIcon
                    width={23}
                    height={29}
                    style={useBlackBadge ? { color: "black" } : { color: badge.show.color }}
                    className={isFuture ? "badge is-future" : "badge"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div
        id="tempBox"
        className="flex flex-col"
        style={rowNum > 1 ? { width: `${boxWidth}px` } : { width: "auto" }}
      ></div>
    </>
  );
}
