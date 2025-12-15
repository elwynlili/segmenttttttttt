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
  audience: 'contact' | 'leads';
}

export interface SegmentFilter {
  searchTerm: string;
  status?: Segment['status'];
  type?: Segment['type'];
}

export interface NewSegmentFormData {
  name: string;
  audience: 'contact' | 'leads';
}
