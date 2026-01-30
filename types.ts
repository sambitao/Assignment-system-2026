
export interface Assignment {
  id: string;
  category: string;
  internalId: string;
  jobType: string;
  description: string;
  agency?: string;
  location?: string;
  remark?: string;
  nsRespond: string[];
  status: 'new' | 'process' | 'assign' | 'approve' | 'finish' | 'complete' | 'update_fms' | 'cancel';
  actionDate: string;
  dueDate?: string;
  createdAt: any;
  updatedAt: any;
  subcontractor?: string;
  expenses?: number;
  routeCode?: string;
  project?: string;
  projectCode?: string;
  routeName?: string;
  distance?: number;
  symImpact?: string;
  progressPercent?: number;
  progressSteps?: string[];
  fileUrl?: string;
  fileName?: string;
  planDate?: string;
  planStartTime?: string;
  planEndTime?: string;
  sentPlanDate?: string;
  unplannedImpact?: string;
  cmId?: string;
  itemCount?: number;
  teamReq?: string;
  reqPerson?: number;
  refJobId?: string;
  gps?: string;
  gpsStart?: string;
  gpsEnd?: string;
  owner?: string;
  crossReq?: string;
  electricDistrict?: string;
  sideCount?: string;
  asNumber?: string;
  ssfNumber?: string;
  cancelBy?: string;
  cancelReason?: string;
  cancelDate?: string;
}

export interface LinkSupportItem {
  name: string;
  url: string;
  type: string;
  detail?: string;
}

export interface MasterData {
  subcontractors: string[];
  nsRespond: string[];
  linkSupport?: LinkSupportItem[];
  rrIndexes?: Record<string, { index: number; lastJob: string }>;
}
