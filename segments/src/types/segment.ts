export interface Segment {
  id: string;
  name: string;
  source: string;
  lastUpdate: string;
  createdAt: string;
  statusReason: string;
  createdBy: string;
  membersCount: number;
  type: 'Dynamic' | 'Static';
  status: 'Draft' | 'Ready to use' | 'Getting ready';
  audience: 'contact' | 'leads' | 'account';
  description?: string;
  groups: Group[];
}

export interface Group {
  id: string;
  type: 'attribute' | 'behavior' | 'existing';
  logicalOperator: 'and' | 'or';
  conditions: Condition[];
  subgroups: Group[];
  memberType?: 'only_matches' | 'between_both';
}

export interface Condition {
  id: string;
  attribute: string;
  operator: string;
  value: string | number | boolean;
}

export interface SegmentFilter {
  searchTerm: string;
  status?: Segment['status'];
  type?: Segment['type'];
}

export interface NewSegmentFormData {
  name: string;
  audience: 'contact' | 'leads' | 'account';
}
