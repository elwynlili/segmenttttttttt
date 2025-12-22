// Test data debugging script
import { getFromStorage } from './src/utils/storage';
import { ACCOUNT_STORAGE_KEY, CONTACT_STORAGE_KEY, Account, Contact } from './src/types/accountContact';
import { ensureTestDataExists } from './src/utils/testDataGenerator';

// Clear existing data and generate fresh test data
console.log('Starting data debugging...');
ensureTestDataExists();

// Get the generated data
const accounts = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
const contacts = getFromStorage<Contact>(CONTACT_STORAGE_KEY, []);

console.log(`Generated ${accounts.length} accounts and ${contacts.length} contacts`);

// Check if accounts are properly generated
if (accounts.length > 0) {
  console.log('First few accounts:');
  accounts.slice(0, 3).forEach((account: Account, index: number) => {
    console.log(`${index + 1}. ID: ${account.id}, Name: ${account.name}`);
  });
}

// Check if contacts are properly generated with parentcustomerid
if (contacts.length > 0) {
  console.log('First few contacts:');
  contacts.slice(0, 3).forEach((contact: Contact, index: number) => {
    console.log(`${index + 1}. ID: ${contact.id}, Name: ${contact.firstname} ${contact.lastname}, Parent Account ID: ${contact.parentcustomerid}`);
    // Check if the parent account exists
    const parentAccount = accounts.find((acc: Account) => acc.id === contact.parentcustomerid);
    console.log(`   Parent Account: ${parentAccount ? parentAccount.name : 'NOT FOUND'}`);
  });
}

// Check the association between accounts and contacts
console.log('\nChecking contact-account associations:');
let validAssociations = 0;
let invalidAssociations = 0;

contacts.forEach((contact: Contact) => {
  const parentAccount = accounts.find((acc: Account) => acc.id === contact.parentcustomerid);
  if (parentAccount) {
    validAssociations++;
  } else {
    invalidAssociations++;
  }
});

console.log(`Valid associations: ${validAssociations}`);
console.log(`Invalid associations: ${invalidAssociations}`);
console.log(`Total contacts: ${contacts.length}`);
