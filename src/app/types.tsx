/** @format */

export type Show = {
  pax: string;
  first: number;
  last?: number;
  skip?: number[];
  colors: string[];
  month: number;
};

export type BadgeType =
  | {
      name: string;
      abbr: string | null;
      color: string | null;
    }
  | undefined;

export type Badge = {
  show: Show;
  year: number;
  type: BadgeType;
  black?: boolean;
};
