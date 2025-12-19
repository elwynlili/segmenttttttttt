import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import type { Account, Contact, NewAccountFormData, NewContactFormData } from '../types/accountContact';
import { ACCOUNT_STORAGE_KEY, CONTACT_STORAGE_KEY } from '../types/accountContact';
import { getFromStorage, addToStorage, updateInStorage, deleteFromStorage } from '../utils/storage';
import { ensureTestDataExists } from '../utils/testDataGenerator';

const AccountContactManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0); // 0: Accounts, 1: Contacts
  const [accounts, setAccounts] = useState<Account[]>(() => getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []));
  const [contacts, setContacts] = useState<Contact[]>(() => getFromStorage<Contact>(CONTACT_STORAGE_KEY, []));

  // Load data from localStorage and refresh every few seconds to ensure we get the latest data
  useEffect(() => {
    // Check if data exists and generate only if needed
    const existingAccounts = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
    const existingContacts = getFromStorage<Contact>(CONTACT_STORAGE_KEY, []);
    
    if (existingAccounts.length === 0 || existingContacts.length === 0) {
      console.log('No data found, generating fresh test data...');
      ensureTestDataExists();
      // Reload data after generating
      const freshAccounts = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
      const freshContacts = getFromStorage<Contact>(CONTACT_STORAGE_KEY, []);
      setAccounts(freshAccounts);
      setContacts(freshContacts);
    } else {
      console.log('Data already exists, using existing data...');
      // No need for interval refresh
    }

  }, []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<Account | Contact | null>(null);
  const [formData, setFormData] = useState<NewAccountFormData | NewContactFormData>({
    name: '',
    firstname: '',
    lastname: '',
    parentcustomerid: ''
  } as NewAccountFormData | NewContactFormData);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });

  // Loading data from localStorage has been moved to useState initial value function

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Open add dialog
  const handleAddClick = () => {
    setDialogMode('add');
    setSelectedItem(null);
    setFormData(tabValue === 0 ? { name: '' } : { firstname: '', lastname: '', parentcustomerid: accounts[0]?.id || '' });
    setDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (row: Account | Contact) => {
    setDialogMode('edit');
    setSelectedItem(row);
    setFormData(row);
    setDialogOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (id: string) => {
    if (tabValue === 0) {
      // When deleting an account, also delete associated contacts
      const updatedAccounts = deleteFromStorage<Account>(ACCOUNT_STORAGE_KEY, id);
      const updatedContacts = contacts.filter(contact => contact.parentcustomerid !== id);
      setAccounts(updatedAccounts);
      setContacts(updatedContacts);
      showSnackbar('Account deleted successfully');
    } else {
      const updatedContacts = deleteFromStorage<Contact>(CONTACT_STORAGE_KEY, id);
      setContacts(updatedContacts);
      showSnackbar('Contact deleted successfully');
    }
  };

  // Handle form input change
  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (tabValue === 0) {
      // Handle account form
      const accountFormData = formData as NewAccountFormData;
      if (!accountFormData.name?.trim()) {
        showSnackbar('Account name is required', 'error');
        return;
      }

      if (dialogMode === 'add') {
        const updatedAccounts = addToStorage<Account>(ACCOUNT_STORAGE_KEY, accountFormData);
        setAccounts(updatedAccounts);
        showSnackbar('Account added successfully');
      } else if (selectedItem?.id) {
        const updatedAccounts = updateInStorage<Account>(ACCOUNT_STORAGE_KEY, selectedItem.id, accountFormData as Partial<Account>);
        setAccounts(updatedAccounts);
        showSnackbar('Account updated successfully');
      }
    } else {
      // Handle contact form
      const contactFormData = formData as NewContactFormData;
      if (!contactFormData.firstname?.trim() || !contactFormData.lastname?.trim() || !contactFormData.parentcustomerid) {
        showSnackbar('First name, last name, and account are required', 'error');
        return;
      }

      if (dialogMode === 'add') {
        const updatedContacts = addToStorage<Contact>(CONTACT_STORAGE_KEY, contactFormData);
        setContacts(updatedContacts);
        showSnackbar('Contact added successfully');
      } else if (selectedItem?.id) {
        const updatedContacts = updateInStorage<Contact>(CONTACT_STORAGE_KEY, selectedItem.id, contactFormData as Partial<Contact>);
        setContacts(updatedContacts);
        showSnackbar('Contact updated successfully');
      }
    }

    setDialogOpen(false);
  };

  // Show notification
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close notification
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Account table columns definition
  const accountColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Account Name',
      width: 200,
      editable: true
    },
    {
      field: 'accountnumber',
      headerName: 'Account Number',
      width: 150
    },
    {
      field: 'telephone1',
      headerName: 'Main Phone',
      width: 150
    },
    {
      field: 'websiteurl',
      headerName: 'Website',
      width: 200
    },
    {
      field: 'industrycode',
      headerName: 'Industry',
      width: 120
    },
    {
      field: 'accountcategorycode',
      headerName: 'Account Type',
      width: 120
    },
    {
      field: 'address1_city',
      headerName: 'City',
      width: 120
    },
    {
      field: 'address1_country',
      headerName: 'Country/Region',
      width: 120
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params: any) => new Date((params as any).value).toLocaleString()
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams<Account>) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row.id)}

        />
      ]
    }
  ];

  // Contact table columns definition
  const contactColumns: GridColDef[] = [
    {
      field: 'firstname',
      headerName: 'First Name',
      width: 120,
      editable: true
    },
    {
      field: 'lastname',
      headerName: 'Last Name',
      width: 120,
      editable: true
    },
    {
      field: 'jobtitle',
      headerName: 'Job Title',
      width: 150
    },
    {
      field: 'parentcustomerid',
      headerName: 'Account',
      width: 200,
      valueFormatter: (params) => {
        console.log('=== Account Column Debug ===');
        console.log('Contact parentcustomerid:', (params as any).value);
        console.log('Available accounts in state:', accounts.length);
        
        // Log first few account IDs for comparison
        if (accounts.length > 0) {
          console.log('First 5 account IDs in state:', accounts.slice(0, 5).map(a => a.id));
        }
        
        // First try to find the account in the current state
        let account = accounts.find(a => a.id === (params as any).value);
        
        // If not found in state, try to get from localStorage directly
        if (!account) {
          console.log('Account not found in state, checking localStorage...');
          const allAccounts = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
          console.log('Accounts in localStorage:', allAccounts.length);
          if (allAccounts.length > 0) {
            console.log('First 5 account IDs in localStorage:', allAccounts.slice(0, 5).map(a => a.id));
          }
          account = allAccounts.find(a => a.id === (params as any).value);
        }
        
        console.log('Found account:', account?.name || 'NOT FOUND');
        console.log('===========================');
        return account?.name || '';
      }
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 120
    },
    {
      field: 'telephone1',
      headerName: 'Business Phone',
      width: 150
    },
    {
      field: 'mobilephone',
      headerName: 'Mobile Phone',
      width: 150
    },
    {
      field: 'emailaddress1',
      headerName: 'Email',
      width: 200
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params: any) => new Date((params as any).value).toLocaleString()
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams<Contact>) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row.id)}

        />
      ]
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, minHeight: '100vh', width: '100%', bgcolor: '#f5f5f5' }}>
      <Card sx={{ boxShadow: 2, borderRadius: 2, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 4 } }}>
        <CardContent>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Account & Contact Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: 3 }
              }}
            >
              Add {tabValue === 0 ? 'Account' : 'Contact'}
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main'
                },
                '& .MuiTab-root': {
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }
              }}
            >
              <Tab label="Accounts" sx={{ minWidth: 100 }} />
              <Tab label="Contacts" sx={{ minWidth: 100 }} />
            </Tabs>
          </Box>

          <Box sx={{ height: 500, width: '100%', mb: 2 }}>
            <DataGrid<Account | Contact>
              columns={tabValue === 0 ? accountColumns : contactColumns}
              rows={tabValue === 0 ? accounts : contacts}
              initialState={{ 
                pagination: { 
                  paginationModel: { page: 0, pageSize: 10 } 
                }
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeader': {
                  fontWeight: 600,
                  backgroundColor: '#f8f9fa'
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Add' : 'Edit'} {tabValue === 0 ? 'Account' : 'Contact'}
        </DialogTitle>
        <DialogContent>
          {tabValue === 0 ? (
            // Account Form
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label="Account Name"
                value={(formData as NewAccountFormData).name || ''}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="accountnumber"
                label="Account Number"
                value={(formData as NewAccountFormData).accountnumber || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="telephone1"
                label="Main Phone"
                value={(formData as NewAccountFormData).telephone1 || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="websiteurl"
                label="Website URL"
                value={(formData as NewAccountFormData).websiteurl || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  name="industrycode"
                  value={(formData as NewAccountFormData).industrycode || ''}
                  label="Industry"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="accountcategorycode"
                  value={(formData as NewAccountFormData).accountcategorycode || ''}
                  label="Account Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                  <MenuItem value="Medium Business">Medium Business</MenuItem>
                  <MenuItem value="Small Business">Small Business</MenuItem>
                  <MenuItem value="Startup">Startup</MenuItem>
                  <MenuItem value="Individual">Individual</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="address1_line1"
                label="Address Line 1"
                value={(formData as NewAccountFormData).address1_line1 || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address1_city"
                label="City"
                value={(formData as NewAccountFormData).address1_city || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address1_stateorprovince"
                label="State/Province"
                value={(formData as NewAccountFormData).address1_stateorprovince || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address1_postalcode"
                label="Postal Code"
                value={(formData as NewAccountFormData).address1_postalcode || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="address1_country"
                label="Country"
                value={(formData as NewAccountFormData).address1_country || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="creditlimit"
                label="Credit Limit"
                type="number"
                value={(formData as NewAccountFormData).creditlimit || ''}
                onChange={handleInputChange}
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Box>
          ) : (
            // Contact Form
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="firstname"
                label="First Name"
                value={(formData as NewContactFormData).firstname || ''}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="lastname"
                label="Last Name"
                value={(formData as NewContactFormData).lastname || ''}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="jobtitle"
                label="Job Title"
                value={(formData as NewContactFormData).jobtitle || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Account</InputLabel>
                <Select
                  name="parentcustomerid"
                  value={(formData as NewContactFormData).parentcustomerid || ''}
                  label="Account"
                  onChange={handleInputChange}
                >
                  {accounts.map(account => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="department"
                label="Department"
                value={(formData as NewContactFormData).department || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="telephone1"
                label="Business Phone"
                value={(formData as NewContactFormData).telephone1 || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="mobilephone"
                label="Mobile Phone"
                value={(formData as NewContactFormData).mobilephone || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="emailaddress1"
                label="Email"
                value={(formData as NewContactFormData).emailaddress1 || ''}
                onChange={handleInputChange}
                fullWidth
                type="email"
              />
              <TextField
                name="address1_line1"
                label="Address Line 1"
                value={(formData as NewContactFormData).address1_line1 || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="assistantname"
                label="Assistant"
                value={(formData as NewContactFormData).assistantname || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="assistantphone"
                label="Assistant Phone"
                value={(formData as NewContactFormData).assistantphone || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="birthdate"
                label="Birth Date"
                type="date"
                value={(formData as NewContactFormData).birthdate || ''}
                onChange={handleInputChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <FormControl fullWidth>
                <InputLabel>Decision Influence Tag</InputLabel>
                <Select
                  name="msdyn_decisioninfluencetag"
                  value={(formData as NewContactFormData).msdyn_decisioninfluencetag || ''}
                  label="Decision Influence Tag"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="Decision Maker">Decision Maker</MenuItem>
                  <MenuItem value="Influencer">Influencer</MenuItem>
                  <MenuItem value="Blocker">Blocker</MenuItem>
                  <MenuItem value="Supporter">Supporter</MenuItem>
                  <MenuItem value="Information Gatherer">Information Gatherer</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    name="msdyn_gdproptout"
                    checked={(formData as NewContactFormData).msdyn_gdproptout || false}
                    onChange={handleInputChange}
                  />
                }
                label="GDPR Opt Out"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountContactManagement;
