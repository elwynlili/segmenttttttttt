import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import type { Segment, SegmentFilter, NewSegmentFormData } from '../types/segment';
import { mockSegments } from '../mock/segments';
import NewSegmentDialog from './NewSegmentDialog';
import { useNavigate } from 'react-router-dom';

const SegmentsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [segments, setSegments] = useState<Segment[]>(mockSegments);
  const [filter, setFilter] = useState<SegmentFilter>({
    searchTerm: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Calculate filtered segments directly instead of using state
  const filteredSegments = segments.filter(segment => {
    const matchesSearch = !filter.searchTerm || 
      segment.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      segment.createdBy.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      segment.source.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    const matchesStatus = !filter.status || segment.status === filter.status;
    const matchesType = !filter.type || segment.type === filter.type;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = event.target;
    if (name) {
      setFilter(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewSegment = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateSegment = (formData: NewSegmentFormData) => {
    // Create new segment with mock data
    const newSegment: Segment = {
      id: `segment-${Date.now()}`,
      name: formData.name,
      source: formData.audience === 'contact' ? 'Contacts' : 'Leads',
      lastUpdate: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
      statusReason: 'Draft',
      createdBy: 'Current User',
      membersCount: 0,
      type: 'Dynamic',
      status: 'Draft',
      audience: formData.audience
    };
    
    // Add new segment to the list
    setSegments(prev => [...prev, newSegment]);
    
    console.log('New segment created:', newSegment);
    
    // Navigate to SegmentBuilder with segment data
    navigate('/builder', { 
      state: { 
        segmentData: { 
          name: formData.name, 
          audience: formData.audience 
        } 
      } 
    });
  };

  const getStatusColor = (status: Segment['status']) => {
    switch (status) {
      case 'Draft':
        return 'default';
      case 'Ready to use':
        return 'success';
      case 'Getting ready':
        return 'warning';
      default:
        return 'default';
    }
  };

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
              All Segments
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNewSegment}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: 3 }
              }}
            >
              New Segment
            </Button>
          </Box>

          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              bgcolor: 'background.default',
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            <TextField
              size="small"
              label="Search by keyword"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              value={filter.searchTerm}
              onChange={e => setFilter({ ...filter, searchTerm: e.target.value })}
              sx={{ 
                minWidth: { xs: '100%', sm: 250 },
                width: { xs: '100%', sm: 'auto' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />

            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={filter.status || ''}
                onChange={handleFilterChange}
                sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Ready to use">Ready to use</MenuItem>
                <MenuItem value="Getting ready">Getting ready</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                name="type"
                value={filter.type || ''}
                onChange={handleFilterChange}
                sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Dynamic">Dynamic</MenuItem>
                <MenuItem value="Static">Static</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>

          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredSegments.length} segments
            </Typography>
          </Box>

          <Box sx={{ overflowX: 'auto', borderRadius: 1, '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: 4 }, '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: 4 }, '&::-webkit-scrollbar-thumb:hover': { background: '#555' } }}>
            <TableContainer component={Paper} sx={{ minWidth: 800, borderRadius: 1, boxShadow: 'none' }}>
              <Table aria-label="segments table" size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { borderBottom: '2px solid #e0e0e0' } }}>
                    <TableCell padding="checkbox" sx={{ minWidth: 50 }} />
                    <TableCell sx={{ fontWeight: 600, minWidth: 150, color: 'text.secondary' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120, color: 'text.secondary' }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 150, color: 'text.secondary' }}>Last update</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 150, color: 'text.secondary' }}>Created date</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120, color: 'text.secondary' }}>Status reason</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120, color: 'text.secondary' }}>Created by</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 80, color: 'text.secondary' }}>Members</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 80, color: 'text.secondary' }}>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSegments.map(segment => (
                    <TableRow 
                      key={segment.id} 
                      hover 
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        '&:last-child td': { borderBottom: 0 }
                      }}
                    >
                      <TableCell padding="checkbox" />
                      <TableCell component="th" scope="row">
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                          {segment.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{segment.source}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{segment.lastUpdate}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{segment.createdAt}</TableCell>
                      <TableCell>
                        <Chip
                          label={segment.statusReason}
                          size="small"
                          color={getStatusColor(segment.status)}
                          variant="outlined"
                          sx={{ minWidth: 80, transition: 'all 0.2s' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{segment.createdBy}</TableCell>
                      <TableCell sx={{ textAlign: 'right', color: 'text.primary' }}>{segment.membersCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={segment.type}
                          size="small"
                          color={segment.type === 'Dynamic' ? 'primary' : 'secondary'}
                          variant="outlined"
                          sx={{ minWidth: 70, transition: 'all 0.2s' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
      
      {/* New Segment Dialog */}
      <NewSegmentDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleCreateSegment}
      />
    </Box>
  );
};

export default SegmentsOverview;
