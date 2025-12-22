// Test Data Generator Utility
// Generates realistic English test data for accounts and contacts

import type { NewAccountFormData, NewContactFormData, IndustryCode, AccountCategoryCode, Account, Contact } from '../types/accountContact';
import { ACCOUNT_STORAGE_KEY, CONTACT_STORAGE_KEY } from '../types/accountContact';
import { addToStorage, getFromStorage, saveToStorage } from './storage';

// Realistic company names
const companyNames = [
  'Tech Innovations Inc.',
  'Global Solutions Group',
  'Digital Transformation Co.',
  'Business Analytics Corp.',
  'Cloud Services Unlimited',
  'Enterprise Solutions LLC',
  'Innovative Technologies',
  'Strategic Consulting Group',
  'Data Management Systems',
  'Software Development Co.',
  'Financial Services Group',
  'Healthcare Solutions Inc.',
  'Retail Technologies',
  'Manufacturing Innovations',
  'Marketing Analytics Corp.',
  'Human Resources Solutions',
  'Logistics Management Group',
  'Energy Services Inc.',
  'Construction Technologies',
  'Telecommunications Group'
];

// Realistic industries
const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Construction',
  'Energy',
  'Telecommunications',
  'Transportation',
  'Education',
  'Government',
  'Media',
  'Entertainment',
  'Agriculture',
  'Hospitality'
];

// Realistic account categories
const accountCategories = [
  'Enterprise',
  'Medium Business',
  'Small Business',
  'Startup',
  'Individual'
];

// Realistic first names
const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Daniel', 'Jessica',
  'James', 'Amanda', 'Robert', 'Jennifer', 'William', 'Elizabeth', 'Richard',
  'Lisa', 'Joseph', 'Mary', 'Thomas', 'Patricia', 'Charles', 'Barbara',
  'Christopher', 'Susan', 'Matthew', 'Karen', 'Andrew', 'Nancy', 'Kevin',
  'Betty', 'Brian', 'Sandra', 'George', 'Margaret', 'Timothy', 'Ashley',
  'Donald', 'Kimberly', 'Steven', 'Emily', 'Paul', 'Donna', 'Mark', 'Michelle'
];

// Realistic last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
  'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
  'Lewis', 'Lee', 'Gonzalez', 'Harris', 'Allen', 'Young', 'Hernandez', 'King',
  'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez',
  'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips'
];

// Realistic job titles
const jobTitles = [
  'CEO', 'CTO', 'CFO', 'COO', 'President', 'Vice President', 'Director',
  'Manager', 'Senior Engineer', 'Engineer', 'Developer', 'Analyst', 'Consultant',
  'Specialist', 'Coordinator', 'Administrator', 'Assistant', 'Associate',
  'Representative', 'Executive', 'Technician', 'Designer', 'Architect',
  'Strategist', 'Planner', 'Supervisor', 'Team Lead', 'Accountant', 'Lawyer'
];

// Realistic departments
const departments = [
  'Sales', 'Marketing', 'Finance', 'Human Resources', 'Information Technology',
  'Operations', 'Research & Development', 'Customer Service', 'Legal',
  'Administration', 'Production', 'Quality Assurance', 'Supply Chain',
  'Business Development', 'Product Management', 'Project Management',
  'Training & Development', 'Public Relations', 'Facilities Management'
];

// Realistic cities
const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'San Francisco', 'Columbus', 'Indianapolis', 'Fort Worth', 'Charlotte',
  'Seattle', 'Denver', 'El Paso', 'Detroit', 'Nashville', 'Memphis', 'Portland',
  'Oklahoma City', 'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque'
];

// Generate random phone number
const generatePhoneNumber = (): string => {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 10000);
  return `${areaCode}-${prefix}-${lineNumber.toString().padStart(4, '0')}`;
};

// Generate random email address
const generateEmail = (firstName: string, lastName: string, companyName: string): string => {
  const companyDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const emailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  const provider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}.${provider}`;
};

// Generate random company name from list with variation
const generateCompanyName = (index: number): string => {
  // Use existing company names and add variations
  const baseName = companyNames[index % companyNames.length];
  if (Math.random() > 0.7) {
    // Add a location suffix for some companies
    const locations = ['North America', 'Europe', 'Asia', 'Global'];
    return `${baseName} ${locations[Math.floor(Math.random() * locations.length)]}`;
  }
  return baseName;
};

// Generate realistic account data
const generateAccountData = (index: number): NewAccountFormData => {
  const companyName = generateCompanyName(index);
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const category = accountCategories[Math.floor(Math.random() * accountCategories.length)];
  
  return {
    name: companyName,
    industrycode: industry as IndustryCode,
    accountcategorycode: category as AccountCategoryCode,
    accountnumber: `ACCT-${(index + 1).toString().padStart(5, '0')}`,
    telephone1: generatePhoneNumber(),
    websiteurl: `https://www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    address1_city: cities[Math.floor(Math.random() * cities.length)],
    address1_country: 'United States',
    creditlimit: Math.floor(Math.random() * 500000) + 50000
  };
};

// Generate realistic contact data
const generateContactData = (accountId: string): NewContactFormData => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  const department = departments[Math.floor(Math.random() * departments.length)];
  
  // Get the account name to use in email
  const accounts = getFromStorage<{ id: string; name: string }>(ACCOUNT_STORAGE_KEY, []);
  const account = accounts.find(acc => acc.id === accountId);
  const companyName = account ? account.name : 'company';
  
  return {
    firstname: firstName,
    lastname: lastName,
    jobtitle: jobTitle,
    parentcustomerid: accountId,
    department: department,
    telephone1: generatePhoneNumber(),
    mobilephone: generatePhoneNumber(),
    emailaddress1: generateEmail(firstName, lastName, companyName),
    address1_line1: `${Math.floor(Math.random() * 1000)} ${['Main', 'Oak', 'Maple', 'Pine', 'Cedar'][Math.floor(Math.random() * 5)]} St`
  };
};

// Generate and insert multiple accounts
const generateAccounts = (count: number = 100): void => {
  console.log(`Generating ${count} account records...`);
  
  for (let i = 0; i < count; i++) {
    const accountData = generateAccountData(i);
    addToStorage(ACCOUNT_STORAGE_KEY, accountData);
  }
  
  console.log(`Generated ${count} account records`);
};

// Generate and insert multiple contacts
const generateContacts = (count: number = 100): void => {
  console.log(`Generating ${count} contact records...`);
  
  const accounts = getFromStorage<{ id: string }>(ACCOUNT_STORAGE_KEY, []);
  
  if (accounts.length === 0) {
    console.error('No accounts found. Please generate accounts first.');
    return;
  }
  
  console.log('Available account IDs for contacts:', accounts.slice(0, 5).map(a => a.id));
  
  for (let i = 0; i < count; i++) {
    // Distribute contacts across accounts
    const accountIndex = i % accounts.length;
    const accountId = accounts[accountIndex].id;
    console.log(`Generating contact ${i+1} for account ${accountId}`);
    
    const contactData = generateContactData(accountId);
    console.log('Generated contact with parentcustomerid:', contactData.parentcustomerid);
    
    // Verify the account exists before adding the contact
    const accountExists = accounts.find(acc => acc.id === accountId);
    console.log(`Account ${accountId} exists: ${!!accountExists}`);
    
    addToStorage(CONTACT_STORAGE_KEY, contactData);
  }
  
  // Verify the contacts were added correctly
  const addedContacts = getFromStorage<{ parentcustomerid: string }>(CONTACT_STORAGE_KEY, []);
  console.log('First 5 added contacts with parentcustomerid:', addedContacts.slice(0, 5).map(c => c.parentcustomerid));
  
  console.log(`Generated ${count} contact records`);
};

// Generate both accounts and contacts
const generateTestData = (accountCount: number = 100, contactCount: number = 100): void => {
  console.log('Starting test data generation...');
  
  // Generate accounts first
  generateAccounts(accountCount);
  
  // Get the accounts we just generated
  const accounts = getFromStorage<{ id: string }>(ACCOUNT_STORAGE_KEY, []);
  console.log(`Generated ${accounts.length} accounts`);
  
  if (accounts.length === 0) {
    console.error('No accounts were generated!');
    return;
  }
  
  // Log first few account IDs
  console.log('First few account IDs:', accounts.slice(0, 3).map(a => a.id));
  
  // Generate contacts with valid account IDs
  generateContacts(contactCount);
  
  console.log('Test data generation completed!');
};

// Check if data exists and generate if needed
const ensureTestDataExists = (): void => {
  console.log('ensureTestDataExists function called');
  
  // Generate new data every time to ensure we have fresh test data
  console.log('Generating new test data...');
  
  // Clear existing data
  console.log('Clearing existing data...');
  saveToStorage(ACCOUNT_STORAGE_KEY, []);
  saveToStorage(CONTACT_STORAGE_KEY, []);
  
  console.log('Starting new data generation...');
  
  // Generate new English data
  generateTestData(50, 100);
  
  console.log('Data generation completed!');
  
  // Verify data was generated correctly
  const accounts = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
  const contacts = getFromStorage<Contact>(CONTACT_STORAGE_KEY, []);
  console.log(`Generated ${accounts.length} accounts and ${contacts.length} contacts`);
  
  // Log first few account IDs
  if (accounts.length > 0) {
    console.log('First few account IDs:', accounts.slice(0, 3).map(a => a.id));
  }
  
  // Log first few contact parentcustomerid
  if (contacts.length > 0) {
    console.log('First few contact parentcustomerid:', contacts.slice(0, 3).map(c => c.parentcustomerid));
  }
};

export {
  generateTestData,
  generateAccounts,
  generateContacts,
  ensureTestDataExists
};
