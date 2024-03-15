/** @format */

export type Show = {
  pax: string;
  first: number;
  last?: number;
  skip?: number[];
  color: string;
  month: number;
};

export type BadgeType = {
  name: string;
  abbr: string | null;
  color: string | null;
};

export type Badge = {
  show: Show;
  year: number;
  type: BadgeType;
  black?: boolean;
};
