// src/types/ga4.ts
export interface SiteConfig {
  SiteName: string;
  PropertyID: string;
}

export interface KPI {
  activeUsers: number;
  sessions: number;
  conversions: number;
  avgSessionDuration: number;
}

export interface DateRangeComparison {
  current: KPI;
  previous: KPI;
}

export interface DimensionMetric {
  name: string;
  value: number;
}
