// Mock customer fields from contacts and leads tables
export interface CustomerField {
  id: string;
  name: string;
  displayName: string;
  table: 'contacts' | 'leads';
  type: 'string' | 'number' | 'date' | 'boolean';
}

export const customerFields: CustomerField[] = [
  { id: 'company_name', name: 'company_name', displayName: 'Company Name', table: 'contacts', type: 'string' },
  { id: 'address', name: 'address', displayName: 'Address', table: 'contacts', type: 'string' },
  { id: 'city', name: 'city', displayName: 'City', table: 'contacts', type: 'string' },
  { id: 'state', name: 'state', displayName: 'State/Province', table: 'contacts', type: 'string' },
  { id: 'zip_code', name: 'zip_code', displayName: 'ZIP/Postal Code', table: 'contacts', type: 'string' },
  { id: 'country', name: 'country', displayName: 'Country', table: 'contacts', type: 'string' },
  { id: 'email', name: 'email', displayName: 'Email Address', table: 'contacts', type: 'string' },
  { id: 'phone', name: 'phone', displayName: 'Phone Number', table: 'contacts', type: 'string' },
  { id: 'industry', name: 'industry', displayName: 'Industry', table: 'contacts', type: 'string' },
  { id: 'employee_count', name: 'employee_count', displayName: 'Employee Count', table: 'contacts', type: 'number' },
  { id: 'revenue', name: 'revenue', displayName: 'Annual Revenue', table: 'contacts', type: 'number' },
  { id: 'created_date', name: 'created_date', displayName: 'Created Date', table: 'contacts', type: 'date' },
  { id: 'last_contact_date', name: 'last_contact_date', displayName: 'Last Contact Date', table: 'contacts', type: 'date' },
  { id: 'is_active', name: 'is_active', displayName: 'Is Active', table: 'contacts', type: 'boolean' },
  { id: 'customer_rating', name: 'customer_rating', displayName: 'Customer Rating', table: 'contacts', type: 'string' },
  { id: 'lead_source', name: 'lead_source', displayName: 'Lead Source', table: 'leads', type: 'string' },
  { id: 'lead_status', name: 'lead_status', displayName: 'Lead Status', table: 'leads', type: 'string' },
  { id: 'lead_score', name: 'lead_score', displayName: 'Lead Score', table: 'leads', type: 'number' },
  { id: 'lead_owner', name: 'lead_owner', displayName: 'Lead Owner', table: 'leads', type: 'string' },
  { id: 'lead_stage', name: 'lead_stage', displayName: 'Lead Stage', table: 'leads', type: 'string' },
];

export const getFieldByDisplayName = (displayName: string): CustomerField | undefined => {
  return customerFields.find(field => field.displayName === displayName);
};

export const getFieldByName = (name: string): CustomerField | undefined => {
  return customerFields.find(field => field.name === name);
};
