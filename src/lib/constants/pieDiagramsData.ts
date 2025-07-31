import {
  EarningsDatum,
  PieDatum,
  StatCardDatum,
  StatCardKey,
  StatusKey,
} from "../types/pieDiagramsType";


  /* Pie‑chart datasets */
   export const statusData: Record<StatusKey, PieDatum[]> = {
  orders: [
    { name: "Pending",    value: 45, color: "#8b5cf6" },
    { name: "Dispatched", value: 32, color: "#a855f7" },
    { name: "Shipped",    value: 78, color: "#c084fc" },
    { name: "Delivered",  value: 125, color: "#7c3aed" },
  ],
  complaint: [
    { name: "Solved",   value: 89, color: "#8b5cf6" },
    { name: "Pending",  value: 23, color: "#a855f7" },
    { name: "Unsolved", value: 12, color: "#c084fc" },
  ],
  visitors: [
    { name: "Desktops", value: 89, color: "#8b5cf6" },
    { name: "Mobiles",  value: 23, color: "#a855f7" },
    { name: "Tablets",  value: 12, color: "#c084fc" },
  ],
  customers: [
    { name: "New",       value: 89, color: "#8b5cf6" },
    { name: "Returning", value: 23, color: "#a855f7" },
    { name: "Inactive",  value: 12, color: "#c084fc" },
  ],
};

export const statsCardData: Record<StatCardKey, StatCardDatum> = {
  orders: {
    today: 12,
    yesterday: 7,
    week: 45,
    month: 178,
  },
  sales: {
    today: 10500,
    yesterday: 9450,
    week: 32000,
    month: 98500,
  },
  products: {
    today: 10,
    yesterday: 9,
    week: 28,
    month: 124,
  },
  visitors: {
    today: 93,
    yesterday: 105,
    week: 210,
    month: 730,
  },
};

/* Area‑chart dataset */

 export const yearlyEarnings: EarningsDatum[] = [
    { month: "Jan", earnings: 45_000 },
    { month: "Feb", earnings: 52_000 },
    { month: "Mar", earnings: 48_000 },
    { month: "Apr", earnings: 61_000 },
    { month: "May", earnings: 55_000 },
    { month: "Jun", earnings: 67_000 },
    { month: "Jul", earnings: 71_000 },
    { month: "Aug", earnings: 69_000 },
    { month: "Sep", earnings: 75_000 },
    { month: "Oct", earnings: 82_000 },
    { month: "Nov", earnings: 88_000 },
    { month: "Dec", earnings: 95_000 },
  ];
