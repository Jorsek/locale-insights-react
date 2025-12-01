export type ResourceStatus = 'OUTDATED' | 'MISSING' | 'CURRENT';
export type JobStatus = 'CANCELLED' | 'COMPLETED' | 'ACTIVE';
export type LoadingStatus = 'IDLE' | 'LOADING' | 'SUCCEEDED' | 'FAILED';
export type SortDirection = 'asc' | 'desc';

export type ResourceSummary = Record<ResourceStatus, number>;

export interface JobSummary {
  CANCELLED: number;
  COMPLETED: number;
  ACTIVE: number;
}

export interface ResourcesData {
  summary: ResourceSummary;
  total: number;
}

export interface JobsData {
  summary: JobSummary;
  total: number;
}

export interface LocaleSummary {
  summary: ResourceSummary;
  total: number;
}

export interface SummaryData {
  [localeCode: string]: LocaleSummary;
}

export interface LocalesMap {
  [localeCode: string]: string;
}

export interface LocaleInsightsData {
  resources: ResourcesData;
  jobs: JobsData;
  summary: SummaryData;
  locales: LocalesMap;
  includesJobs: number[];
}

export type LocaleInsightSummaryReport = LocaleInsightsData;

export interface Locale {
  code: string;
  displayName: string;
}

export interface ResourceMetadata {
  [key: string]: string;
}

export interface ResourceItem {
  id: number;
  filename: string;
  mapFilename: string;
  localizationStatus: ResourceStatus;
  sourceResourceUuid: string;
  locale: Locale;
  due: string;
  jobs: number[];
  metadata: ResourceMetadata;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ResourceListResponse {
  content: ResourceItem[];
  page: PageInfo;
}

export interface InsightsResourceFilter {
  status?: ResourceStatus;
  localeCode?: string;
  jobId?: number;
  metadata?: ResourceMetadata;
}

