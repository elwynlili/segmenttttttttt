// Updated CustomerField interface to include accounts table
export interface CustomerField {
  id: string;
  name: string;
  displayName: string;
  table: 'contacts' | 'leads' | 'accounts';
  type: 'string' | 'number' | 'date' | 'boolean';
}

// Generate account fields dynamically from Account interface
export const customerFields: CustomerField[] = [
  // Account fields from Account interface
  { id: 'id', name: 'id', displayName: 'ID', table: 'accounts', type: 'string' },
  { id: 'name', name: 'name', displayName: 'Name', table: 'accounts', type: 'string' },
  { id: 'primarycontactid', name: 'primarycontactid', displayName: 'Primary Contact ID', table: 'accounts', type: 'string' },
  { id: 'parentaccountid', name: 'parentaccountid', displayName: 'Parent Account ID', table: 'accounts', type: 'string' },
  { id: 'address1_line1', name: 'address1_line1', displayName: 'Address Line 1', table: 'accounts', type: 'string' },
  { id: 'address1_city', name: 'address1_city', displayName: 'City', table: 'accounts', type: 'string' },
  { id: 'address1_stateorprovince', name: 'address1_stateorprovince', displayName: 'State or Province', table: 'accounts', type: 'string' },
  { id: 'address1_postalcode', name: 'address1_postalcode', displayName: 'Postal Code', table: 'accounts', type: 'string' },
  { id: 'address1_country', name: 'address1_country', displayName: 'Country', table: 'accounts', type: 'string' },
  { id: 'telephone1', name: 'telephone1', displayName: 'Telephone', table: 'accounts', type: 'string' },
  { id: 'websiteurl', name: 'websiteurl', displayName: 'Website URL', table: 'accounts', type: 'string' },
  { id: 'industrycode', name: 'industrycode', displayName: 'Industry Code', table: 'accounts', type: 'string' },
  { id: 'accountcategorycode', name: 'accountcategorycode', displayName: 'Account Category Code', table: 'accounts', type: 'string' },
  { id: 'accountnumber', name: 'accountnumber', displayName: 'Account Number', table: 'accounts', type: 'string' },
  { id: 'defaultpricelevelid', name: 'defaultpricelevelid', displayName: 'Default Price Level ID', table: 'accounts', type: 'string' },
  { id: 'creditlimit', name: 'creditlimit', displayName: 'Credit Limit', table: 'accounts', type: 'number' },
  { id: 'lastusedincampaign', name: 'lastusedincampaign', displayName: 'Last Used in Campaign', table: 'accounts', type: 'string' },
  { id: 'createdAt', name: 'createdAt', displayName: 'Created At', table: 'accounts', type: 'date' },
  { id: 'updatedAt', name: 'updatedAt', displayName: 'Updated At', table: 'accounts', type: 'date' },
];

// Get field by display name
export const getFieldByDisplayName = (displayName: string): CustomerField | undefined => {
  return customerFields.find(field => field.displayName === displayName);
};

// Get field by name
export const getFieldByName = (name: string): CustomerField | undefined => {
  return customerFields.find(field => field.name === name);
};

// Get all account fields
export const getAccountFields = (): CustomerField[] => {
  return customerFields.filter(field => field.table === 'accounts');
};
