
export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export interface EarningsDatum {
  month: string;
  earnings: number;
}

export interface PieDiagramProps {
  title?: string;
  className?: string;
  statusData: PieDatum[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showIcon?: boolean;
}

export interface EarningsDatum {
  month: string;
  earnings: number;
}


export interface GraphDiagramProps {
  title?: string;
  data: EarningsDatum[];
  xKey?: string;
  yKey?: string;
  className?: string;
  color?: string;
  yFormatter?: (value: number) => string;
}

export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export type StatusKey = "orders" | "complaint" | "visitors" | "customers";
export type StatCardKey = "orders" | "sales" | "products" | "visitors";

export interface StatCardDatum {
  today: number;
  yesterday: number;
  week: number;
  month: number;
}

