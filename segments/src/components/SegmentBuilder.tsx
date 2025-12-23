import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Tabs,
  Tab,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccountFields } from '../mock/customerFields';
import type { Group, Condition, Segment } from '../types/segment';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { calculateMembersCount, getMatchingMembers } from '../utils/segmentEvaluator';
import type { Account, Contact } from '../types/accountContact';



const SegmentBuilder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Storage key for segments
  const SEGMENT_STORAGE_KEY = 'segments';
  
  // Get segment data from location state
  const segmentData = location.state?.segmentData;
  // Determine editability based on location state or segment status
  const isEditable = location.state?.isEditable || segmentData?.status === 'Draft' || false;
  
  const [activeTab, setActiveTab] = useState(0);
  const [groups, setGroups] = useState<Group[]>(segmentData?.groups || []);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [segmentName, setSegmentName] = useState<string>(segmentData?.name || '');
  const [description, setDescription] = useState<string>(segmentData?.description || '');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [loading, setLoading] = useState(false); // Prevent multiple clicks
  
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: 'group' as 'group' | 'condition',
    id: '',
    groupId: ''
  });

  // Customer info dialog state
  const [customerInfoDialog, setCustomerInfoDialog] = useState({
    open: false,
    customers: [] as (Account | Contact)[]
  });

  // Helper function to recursively find a group by ID
  const findGroupById = useMemo(() => {
    const recursiveFind = (searchGroups: Group[], id: string): Group | undefined => {
      for (const group of searchGroups) {
        if (group.id === id) return group;
        const foundInSubgroup = recursiveFind(group.subgroups, id);
        if (foundInSubgroup) return foundInSubgroup;
      }
      return undefined;
    };
    return recursiveFind;
  }, []);

  // Helper function to recursively update a group by ID
  const updateGroupById = useCallback((searchGroups: Group[], id: string, updateFn: (group: Group) => Group): Group[] => {
    const recursiveUpdate = (groups: Group[]): Group[] => {
      return groups.map(group => {
        if (group.id === id) {
          return updateFn(group);
        }
        return {
          ...group,
          subgroups: recursiveUpdate(group.subgroups)
        };
      });
    };
    return recursiveUpdate(searchGroups);
  }, []);

  // Helper function to recursively delete a group by ID
  const deleteGroupById = useCallback((searchGroups: Group[], id: string): Group[] => {
    const recursiveDelete = (groups: Group[]): Group[] => {
      return groups
        .filter(group => group.id !== id)
        .map(group => ({
          ...group,
          subgroups: recursiveDelete(group.subgroups)
        }));
    };
    return recursiveDelete(searchGroups);
  }, []);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const handleAddGroup = useCallback(() => {
    setGroupDropdownOpen(prev => !prev);
  }, []);

  const handleSelectGroupType = useCallback((type: 'attribute' | 'behavior' | 'existing') => {
    // Logic to add new group based on type
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      type,
      logicalOperator: 'and',
      conditions: [],
      subgroups: []
    };
    setGroups(prev => [...prev, newGroup]);
    setGroupDropdownOpen(false);
    setSelectedGroupId(newGroup.id); // Auto-select the new group
  }, []);

  // Delete group handler with confirmation
  const handleDeleteGroup = useCallback((groupId: string) => {
    setDeleteDialog({
      open: true,
      type: 'group',
      id: groupId,
      groupId: ''
    });
  }, []);

  // Confirm delete group
  const confirmDeleteGroup = useCallback(() => {
    if (deleteDialog.id) {
      setGroups(prev => deleteGroupById(prev, deleteDialog.id));
      if (selectedGroupId === deleteDialog.id) {
        setSelectedGroupId(null);
      }
      // Show success message
      setSnackbar({
        open: true,
        message: 'Group deleted successfully',
        severity: 'success'
      });
    }
    setDeleteDialog(prev => ({ ...prev, open: false }));
  }, [deleteDialog.id, selectedGroupId, deleteGroupById]);

  const handleGroupSelect = useCallback((groupId: string) => {
    // Logic to select a group
    setSelectedGroupId(prev => prev === groupId ? null : groupId);
  }, []);

  // Helper function to update a specific condition
  const updateCondition = useCallback((groupId: string, conditionId: string, updateFn: (condition: Condition) => Condition) => {
    const updatedGroups = updateGroupById(groups, groupId, group => ({
      ...group,
      conditions: group.conditions.map(condition => 
        condition.id === conditionId ? updateFn(condition) : condition
      )
    }));
    setGroups(updatedGroups);
  }, [groups, updateGroupById]);

  // Generic condition property update function
  const updateConditionProperty = useCallback((
    groupId: string,
    conditionId: string,
    property: keyof Condition,
    value: Condition[keyof Condition]
  ) => {
    updateCondition(groupId, conditionId, (condition) => ({
      ...condition,
      [property]: value
    }));
  }, [updateCondition]);

  // Helper function to add a new condition to a group
  const addConditionToGroup = useCallback((groupId: string, condition: Omit<Condition, 'id'>) => {
    const newCondition: Condition = {
      ...condition,
      id: `condition-${Date.now()}`
    };
    
    const updatedGroups = updateGroupById(groups, groupId, group => ({
      ...group,
      conditions: [...group.conditions, newCondition]
    }));
    setGroups(updatedGroups);
  }, [groups, updateGroupById]);

  const handleAddCondition = useCallback((groupId: string) => {
    // Logic to add a new condition to a group (including subgroups)
    const accountFields = getAccountFields();
    addConditionToGroup(groupId, {
      attribute: accountFields[0]?.name || '', // Use first account field as default
      operator: '=',
      value: ''
    });
  }, [addConditionToGroup]);

  // Delete condition handler with confirmation
  const handleDeleteCondition = useCallback((groupId: string, conditionId: string) => {
    setDeleteDialog({
      open: true,
      type: 'condition',
      id: conditionId,
      groupId: groupId
    });
  }, []);

  // Confirm delete condition
  const confirmDeleteCondition = useCallback(() => {
    if (deleteDialog.id && deleteDialog.groupId) {
      const updatedGroups = updateGroupById(groups, deleteDialog.groupId, group => ({
        ...group,
        conditions: group.conditions.filter(condition => condition.id !== deleteDialog.id)
      }));
      setGroups(updatedGroups);
      // Show success message
      setSnackbar({
        open: true,
        message: 'Condition deleted successfully',
        severity: 'success'
      });
    }
    setDeleteDialog(prev => ({ ...prev, open: false }));
  }, [deleteDialog.id, deleteDialog.groupId, groups, updateGroupById]);

  const handleAddSubgroup = useCallback((groupId: string) => {
    // Logic to add a new subgroup to a group (including subgroups)
    const newSubgroup: Group = {
      id: `group-${Date.now()}-sub`,
      type: 'attribute',
      logicalOperator: 'and',
      conditions: [],
      subgroups: []
    };
    
    const updatedGroups = updateGroupById(groups, groupId, group => ({
      ...group,
      subgroups: [...group.subgroups, newSubgroup]
    }));
    setGroups(updatedGroups);
  }, [groups, updateGroupById]);

  const handleAddConditionWithAttribute = useCallback((groupId: string, attribute: string, value: string) => {
    // Logic to add a new condition with pre-filled attribute and value
    addConditionToGroup(groupId, {
      attribute,
      operator: '=',
      value
    });
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Condition added successfully',
      severity: 'success'
    });
  }, [addConditionToGroup]);

  // Snackbar close handler
  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Save segment as draft
  const handleSaveDraft = useCallback(() => {
    if (loading || !segmentName.trim()) {
      if (!segmentName.trim()) {
        setSnackbar({
          open: true,
          message: 'Segment name is required',
          severity: 'error'
        });
      }
      return;
    }
    setLoading(true);

    const segments = getFromStorage<Segment>(SEGMENT_STORAGE_KEY, []);
    const timestamp = new Date().toISOString();
    const localSegmentData: Omit<Segment, 'id' | 'createdAt'> = {
      name: segmentName,
      description,
      groups,
      source: segmentData?.source || 'Contacts',
      lastUpdate: timestamp,
      statusReason: 'Draft',
      createdBy: segmentData?.createdBy || 'Current User',
      membersCount: calculateMembersCount({
        id: segmentData?.id || `temp-${Date.now()}`,
        name: segmentName,
        description,
        groups,
        source: segmentData?.source || 'Contacts',
        lastUpdate: timestamp,
        createdAt: segmentData?.createdAt || timestamp,
        statusReason: 'Draft',
        createdBy: segmentData?.createdBy || 'Current User',
        type: segmentData?.type || 'Dynamic',
        status: 'Draft',
        audience: segmentData?.audience || 'contact',
        membersCount: 0
      }),

      type: segmentData?.type || 'Dynamic',
      status: 'Draft',
      audience: segmentData?.audience || 'contact'
    };

    let updatedSegments;
    if (segmentData?.id) {
      // Update existing segment
      updatedSegments = segments.map(segment => {
        if (segment.id === segmentData.id) {
          return {
            ...segment,
            ...localSegmentData,
            lastUpdate: timestamp
          };
        }
        return segment;
      });
    } else {
      // Check if segment name already exists
      const isNameExists = segments.some(segment => segment.name.trim().toLowerCase() === segmentName.trim().toLowerCase());
      if (isNameExists) {
        setSnackbar({
          open: true,
          message: 'A segment with this name already exists',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      
      // Create new segment
      const newSegment: Segment = {
        ...localSegmentData,
        id: `segment-${Date.now()}`,
        createdAt: timestamp
      };
      updatedSegments = [...segments, newSegment];
    }

    saveToStorage(SEGMENT_STORAGE_KEY, updatedSegments);
    
    setSnackbar({
      open: true,
      message: 'Segment saved as draft successfully',
      severity: 'success'
    });

    // Navigate back to overview after saving
    setTimeout(() => {
      navigate('/');
      setLoading(false);
    }, 1500);
  }, [segmentName, description, groups, segmentData, navigate, loading]);

  // Save and activate segment
  const handleSaveActivate = useCallback(() => {
    if (loading || !segmentName.trim()) {
      if (!segmentName.trim()) {
        setSnackbar({
          open: true,
          message: 'Segment name is required',
          severity: 'error'
        });
      }
      return;
    }

    if (groups.length === 0) {
      setSnackbar({
        open: true,
        message: 'At least one group is required',
        severity: 'error'
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    const segments = getFromStorage<Segment>(SEGMENT_STORAGE_KEY, []);
    const timestamp = new Date().toISOString();
    const localSegmentData: Omit<Segment, 'id' | 'createdAt'> = {
      name: segmentName,
      description,
      groups,
      source: segmentData?.source || 'Contacts',
      lastUpdate: timestamp,
      statusReason: 'Ready to use',
      createdBy: segmentData?.createdBy || 'Current User',
      membersCount: calculateMembersCount({
        id: segmentData?.id || `temp-${Date.now()}`,
        name: segmentName,
        description,
        groups,
        source: segmentData?.source || 'Contacts',
        lastUpdate: timestamp,
        createdAt: segmentData?.createdAt || timestamp,
        statusReason: 'Ready to use',
        createdBy: segmentData?.createdBy || 'Current User',
        type: segmentData?.type || 'Dynamic',
        status: 'Ready to use',
        audience: segmentData?.audience || 'contact',
        membersCount: 0
      }),

      type: segmentData?.type || 'Dynamic',
      status: 'Ready to use',
      audience: segmentData?.audience || 'contact'
    };

    let updatedSegments;
    if (segmentData?.id) {
      // Update existing segment
      updatedSegments = segments.map(segment => {
        if (segment.id === segmentData.id) {
          return {
            ...segment,
            ...localSegmentData,
            lastUpdate: timestamp
          };
        }
        return segment;
      });
    } else {
      // Check if segment name already exists
      const isNameExists = segments.some(segment => segment.name.trim().toLowerCase() === segmentName.trim().toLowerCase());
      if (isNameExists) {
        setSnackbar({
          open: true,
          message: 'A segment with this name already exists',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      
      // Create new segment
      const newSegment: Segment = {
        ...localSegmentData,
        id: `segment-${Date.now()}`,
        createdAt: timestamp
      };
      updatedSegments = [...segments, newSegment];
    }

    saveToStorage(SEGMENT_STORAGE_KEY, updatedSegments);
    
    setSnackbar({
      open: true,
      message: 'Segment saved and activated successfully',
      severity: 'success'
    });

    // Navigate back to overview after saving
    setTimeout(() => {
      navigate('/');
      setLoading(false);
    }, 1500);
  }, [segmentName, description, groups, segmentData, navigate, loading]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Handle display customer information
  const handleDisplayCustomerInfo = useCallback(() => {
    console.log('handleDisplayCustomerInfo called');
    console.log('segmentName:', segmentName);
    console.log('description:', description);
    console.log('groups:', groups);
    console.log('segmentData:', segmentData);
    
    // Build the current segment data
    const currentSegment: Segment = {
      id: segmentData?.id || `temp-${Date.now()}`,
      name: segmentName,
      description,
      groups: groups,
      source: segmentData?.source || 'Contacts',
      lastUpdate: new Date().toISOString(),
      createdAt: segmentData?.createdAt || new Date().toISOString(),
      statusReason: segmentData?.statusReason || 'Draft',
      createdBy: segmentData?.createdBy || 'Current User',
      type: segmentData?.type || 'Dynamic',
      status: segmentData?.status || 'Draft',
      audience: segmentData?.audience || 'contact',
      membersCount: 0
    };
    
    console.log('currentSegment:', currentSegment);
    console.log('currentSegment.groups.length:', currentSegment.groups.length);
    
    // Get matching members
    try {
      const matchingCustomers = getMatchingMembers(currentSegment);
      console.log('matchingCustomers length:', matchingCustomers.length);
      console.log('matchingCustomers:', matchingCustomers);
      
      // Open dialog with customer info
      setCustomerInfoDialog({
        open: true,
        customers: matchingCustomers
      });
      console.log('customerInfoDialog set to open');
      console.log('customerInfoDialog state after setting:', { open: true, customers: matchingCustomers });
    } catch (error) {
      console.error('Error in handleDisplayCustomerInfo:', error);
    }
  }, [segmentName, description, groups, segmentData]);

  // Close customer info dialog
  const handleCloseCustomerInfoDialog = useCallback(() => {
    setCustomerInfoDialog(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', position: 'absolute', inset: 0, margin: 0, padding: 0 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.default'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            New Segment
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isEditable && (
            <>
              <Button variant="outlined" onClick={handleSaveDraft} disabled={loading} loading={loading}>Save as draft</Button>
              <Button variant="contained" color="primary" onClick={handleSaveActivate} disabled={loading} loading={loading}>Save & activate</Button>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', width: '100%', height: '100%' }}>
        {/* Canvas Area */}
        <Box sx={{ 
          flex: 1, 
          p: { xs: 2, md: 4 },  // 响应式内边距
          bgcolor: '#f5f5f5',
          overflowY: 'auto',
          minHeight: 'calc(100vh - 120px)',  // 最小高度
          maxWidth: 'none',
          width: '100%'
        }}>
          {/* Segment Name and Description */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
            <TextField
              fullWidth
              label="Segment name"
              value={segmentName}
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={(e) => setSegmentName(e.target.value)}
              helperText={segmentName.trim() ? '' : 'Segment name is required'}
            />
            <TextField
              fullWidth
              label="Description (optional)"
              multiline
              rows={2}
              variant="outlined"
              placeholder="Add a description to help identify this segment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Paper>

          {/* Canvas */}
          <Paper sx={{ 
            p: 4, 
            minHeight: 400,
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: groups.length === 0 ? 'center' : 'flex-start'
          }}>
            {groups.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: '#1976d2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  boxShadow: 3
                }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: '4px dashed white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AddIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
                  Add elements to build your segment
                </Typography>
                {isEditable && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddGroup}
                    endIcon={<ExpandMoreIcon />}
                    sx={{ mt: 2, px: 4, py: 1 }}
                  >
                    + Add a new group
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                {groups.map((group) => (
                  <Paper 
                    key={group.id} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderLeft: 4, 
                      borderColor: selectedGroupId === group.id ? '#1976d2' : 'transparent',
                      bgcolor: selectedGroupId === group.id ? '#f5f9ff' : 'white',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f9f9f9' },
                      boxShadow: 1
                    }}
                    onClick={() => handleGroupSelect(group.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {group.type === 'attribute' ? 'Attribute Group' : 
                         group.type === 'behavior' ? 'Behavior Group' : 'Existing Segment'} 
                        <Chip 
                          label={group.logicalOperator.toUpperCase()} 
                          size="small" 
                          sx={{ ml: 2, bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }}
                        />
                      </Typography>
                      {isEditable && (
                        <Tooltip title="Delete group">
                          <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    {/* Group content */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Conditions ({group.conditions.length})
                      </Typography>
                      {group.conditions.length === 0 ? (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          No conditions added yet. Add conditions from the Elements panel.
                        </Typography>
                      ) : (
                        <Box sx={{ ml: 2 }}>
                          {group.conditions.map((condition) => (
                        <Box key={condition.id} sx={{ mb: 2, p: 2, bgcolor: '#f8f8f8', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Chip 
                              label={condition.attribute} 
                              size="small" 
                              sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }}
                            />
                            <Typography variant="body2" sx={{ color: '#616161', fontWeight: 500 }}>{condition.operator}</Typography>
                            <Chip 
                              label={String(condition.value)} 
                              size="small" 
                              sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
                            />
                            {isEditable && (
                              <IconButton 
                                size="small" 
                                color="error" 
                                sx={{ ml: 'auto' }}
                                onClick={(e) => { e.stopPropagation(); handleDeleteCondition(group.id, condition.id); }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      ))}
                        </Box>
                      )}
                      {/* Add condition button */}
                      {isEditable && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<AddIcon />}
                          onClick={(e) => { e.stopPropagation(); handleAddCondition(group.id); }}
                          sx={{ mr: 1 }}
                        >
                          Add condition
                        </Button>
                      )}
                        
                      {/* Add subgroup button */}
                      {isEditable && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<AddIcon />}
                          onClick={(e) => { e.stopPropagation(); handleAddSubgroup(group.id); }}
                        >
                          Add subgroup
                        </Button>
                      )}
                       
                      {/* Subgroups */}
                      {group.subgroups.length > 0 && (
                        <Box sx={{ mt: 3, ml: 4, borderLeft: 2, borderColor: '#e0e0e0', pl: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#616161' }}>
                            Subgroups ({group.subgroups.length})
                          </Typography>
                          {group.subgroups.map((subgroup) => (
                            <Paper 
                              key={subgroup.id} 
                              sx={{ 
                                p: 2, 
                                mb: 2, 
                                borderLeft: 4, 
                                borderColor: selectedGroupId === subgroup.id ? '#1976d2' : '#bdbdbd',
                                bgcolor: selectedGroupId === subgroup.id ? '#f5f9ff' : '#fafafa',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#f9f9f9' },
                                boxShadow: 1
                              }}
                              onClick={(e) => { e.stopPropagation(); handleGroupSelect(subgroup.id); }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2">
                                  {subgroup.type === 'attribute' ? 'Attribute Subgroup' : 
                                   subgroup.type === 'behavior' ? 'Behavior Subgroup' : 'Existing Segment Subgroup'} 
                                  <Chip 
                                    label={subgroup.logicalOperator.toUpperCase()} 
                                    size="small" 
                                    sx={{ ml: 2, bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, fontSize: '0.7rem' }}
                                  />
                                </Typography>
                                {isEditable && (
                                  <Tooltip title="Delete subgroup">
                                    <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDeleteGroup(subgroup.id); }}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                              
                              {/* Subgroup conditions */}
                              {subgroup.conditions.length > 0 ? (
                                <Box sx={{ ml: 2 }}>
                                  {subgroup.conditions.map((condition) => (
                                    <Box key={condition.id} sx={{ mb: 1, p: 1, bgcolor: '#f8f8f8', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip 
                                          label={condition.attribute} 
                                          size="small" 
                                          sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontSize: '0.7rem' }}
                                        />
                                        <Typography variant="caption" sx={{ color: '#616161', fontWeight: 500 }}>{condition.operator}</Typography>
                                        <Chip 
                                          label={String(condition.value)} 
                                          size="small" 
                                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem' }}
                                        />
                                        {isEditable && (
                                        <IconButton 
                                          size="small" 
                                          color="error" 
                                          sx={{ ml: 'auto' }}
                                          onClick={(e) => { e.stopPropagation(); handleDeleteCondition(subgroup.id, condition.id); }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2 }}>
                                  No conditions in this subgroup
                                </Typography>
                              )}
                            </Paper>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Paper>
                ))}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  {isEditable && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddGroup}
                    >
                      + Add a new group
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Paper>

            {/* Group Type Dropdown */}
            {groupDropdownOpen && (
              <Paper sx={{ 
                position: 'absolute', 
                mt: 1, 
                minWidth: 250,
                boxShadow: 3
              }}>
                <Box sx={{ p: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => handleSelectGroupType('attribute')}
                    sx={{ justifyContent: 'flex-start', p: 2 }}
                  >
                    Attribute group
                  </Button>
                  <Divider />
                  <Button
                    fullWidth
                    onClick={() => handleSelectGroupType('behavior')}
                    sx={{ justifyContent: 'flex-start', p: 2 }}
                  >
                    Behavior group
                  </Button>
                  <Divider />
                  <Button
                    fullWidth
                    onClick={() => handleSelectGroupType('existing')}
                    sx={{ justifyContent: 'flex-start', p: 2 }}
                  >
                    Existing segment
                  </Button>
                </Box>
              </Paper>
            )}
          
          {/* View sample of included members */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500, mb: 2 }}>
              View sample of included members
            </Typography>
            {/* Button to display customer information */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleDisplayCustomerInfo}
              sx={{ px: 4, py: 1, zIndex: 100 }}
            >
              展示当前segment包括的客户信息
            </Button>
          </Box>
        </Box>

        {/* Elements Sidebar */}
        <Paper sx={{ 
          minWidth: 400,  // 最小宽度400px
          width: '30%',   // 占屏幕宽度30%
          borderLeft: 1, 
          borderColor: 'divider',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Sidebar Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedGroupId ? 'Configure Group' : 'Elements'}
            </Typography>
            <Tooltip title="Refresh">
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Display different content based on whether a group is selected */}
          {selectedGroupId ? (
            // Content when a group is selected
            <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Group Settings
              </Typography>
              
              {/* Group Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Group Type
                </Typography>
                <TextField
                  fullWidth
                  value={findGroupById(groups, selectedGroupId ?? '')?.type || ''}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Box>
              
              {/* Logical Operator */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Logical Operator
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant={findGroupById(groups, selectedGroupId ?? '')?.logicalOperator === 'and' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={isEditable ? () => {
                      if (selectedGroupId) {
                        const updatedGroups = updateGroupById(groups, selectedGroupId, group => ({
                          ...group,
                          logicalOperator: 'and'
                        }));
                        setGroups(updatedGroups);
                      }
                    } : undefined}
                    disabled={!isEditable}
                  >
                    AND
                  </Button>
                  <Button
                    variant={findGroupById(groups, selectedGroupId ?? '')?.logicalOperator === 'or' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={isEditable ? () => {
                      if (selectedGroupId) {
                        const updatedGroups = updateGroupById(groups, selectedGroupId, group => ({
                          ...group,
                          logicalOperator: 'or'
                        }));
                        setGroups(updatedGroups);
                      }
                    } : undefined}
                    disabled={!isEditable}
                  >
                    OR
                  </Button>
                </Box>
              </Box>
              
              {/* Conditions Section */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Conditions
              </Typography>
              
              {selectedGroupId && findGroupById(groups, selectedGroupId)?.conditions.map((condition) => (
                <Box key={condition.id} sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Condition {condition.id.split('-')[1]}
                  </Typography>
                  
                  {/* Attribute Selection */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                      Attribute
                    </Typography>
                    <Select
                      fullWidth
                      value={condition.attribute}
                      variant="outlined"
                      size="small"
                      onChange={isEditable ? (e) => {
                        // Update condition attribute using generic function
                        updateConditionProperty(selectedGroupId, condition.id, 'attribute', e.target.value);
                      } : undefined}
                      disabled={!isEditable}
                    >
                      {getAccountFields().map(field => (
                        <MenuItem key={field.id} value={field.name}>
                          {field.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  
                  {/* Operator Selection */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                      Operator
                    </Typography>
                    <Select
                      fullWidth
                      value={condition.operator}
                      variant="outlined"
                      size="small"
                      onChange={isEditable ? (e) => {
                        // Update condition operator using generic function
                        updateConditionProperty(selectedGroupId, condition.id, 'operator', e.target.value);
                      } : undefined}
                      disabled={!isEditable}
                    >
                      <MenuItem value="=">=</MenuItem>
                      <MenuItem value=">">{'>'}</MenuItem>
                      <MenuItem value="<">{'<'}</MenuItem>
                      <MenuItem value=">=">{'>='}</MenuItem>
                      <MenuItem value="<=">{'<='}</MenuItem>
                      <MenuItem value="!=">!=</MenuItem>
                      <MenuItem value="contains">Contains</MenuItem>
                      <MenuItem value="not_contains">Not Contains</MenuItem>
                      <MenuItem value="starts_with">Starts With</MenuItem>
                      <MenuItem value="ends_with">Ends With</MenuItem>
                      <MenuItem value="is_empty">Is Empty</MenuItem>
                      <MenuItem value="is_not_empty">Is Not Empty</MenuItem>
                    </Select>
                  </Box>
                  
                  {/* Value Input */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                      Value
                    </Typography>
                    <TextField
                      fullWidth
                      value={condition.value}
                      variant="outlined"
                      size="small"
                      onChange={isEditable ? (e) => {
                        // Update condition value using generic function
                        updateConditionProperty(selectedGroupId, condition.id, 'value', e.target.value);
                      } : undefined}
                      disabled={!isEditable}
                    />
                  </Box>
                  
                  {/* Delete Condition Button */}
                  {isEditable && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteCondition(selectedGroupId, condition.id)}
                    >
                      Delete Condition
                    </Button>
                  )}
                </Box>
              ))}
              
              {/* Add Condition Button */}
              {isEditable && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => selectedGroupId && handleAddCondition(selectedGroupId)}
                  sx={{ mt: 2, mr: 1 }}
                >
                  Add New Condition
                </Button>
              )}
              
              {/* Add Subgroup Button */}
              {isEditable && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => selectedGroupId && handleAddSubgroup(selectedGroupId)}
                  sx={{ mt: 2 }}
                >
                  Add Subgroup
                </Button>
              )}
            </Box>
          ) : (
            // Default elements content when no group is selected
            <>
              <Typography variant="body2" sx={{ p: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                Add elements such as demographic attributes, interactions, existing segments, and/or select members to include or exclude.
              </Typography>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Attributes" />
                <Tab label="Behavioral" />
                <Tab label="Segments" />
                <Tab label="Include contacts" />
                <Tab label="Exclude contacts" />
              </Tabs>

              {/* Search */}
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  variant="outlined"
                />
              </Box>

              {/* Tab Content */}
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {/* Attributes Tab */}
                {activeTab === 0 && (
                  <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Target audience
                </Typography>
                
                {/* Target audience */}
                <Accordion sx={{ mb: 2, boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="target-audience-content"
                    id="target-audience-header"
                  >
                    <Typography>Individual</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
                        603 attributes
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Related tables
                </Typography>
                
                {/* Related tables */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Account (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>287 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Check-in (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>35 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Entity (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>412 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Event (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>188 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Event Registration (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>45 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Individual (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>603 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">Lead (syncing)</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>229 attributes</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Button
                    variant="text"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    + Add table
                  </Button>
              </Box>
            )}

            {/* Behavioral Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Standard marketing triggers
                </Typography>

                <Accordion sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="custom-channel-content"
                    id="custom-channel-header"
                  >
                    <Typography>Custom channel message (5 interactions)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography 
                  variant="body2" 
                  sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedGroupId) {
                      handleAddConditionWithAttribute(selectedGroupId, 'custom_channel_message', 'blocked');
                    }
                  }}
                >
                  Blocked
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedGroupId) {
                      handleAddConditionWithAttribute(selectedGroupId, 'custom_channel_message', 'delivered');
                    }
                  }}
                >
                  Delivered
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedGroupId) {
                      handleAddConditionWithAttribute(selectedGroupId, 'custom_channel_message', 'delivery_failed');
                    }
                  }}
                >
                  Delivery failed
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedGroupId) {
                      handleAddConditionWithAttribute(selectedGroupId, 'custom_channel_message', 'sent');
                    }
                  }}
                >
                  Sent
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedGroupId) {
                      handleAddConditionWithAttribute(selectedGroupId, 'custom_channel_message', 'total_clicks');
                    }
                  }}
                >
                  Total clicks
                </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="email-content"
                    id="email-header"
                  >
                    <Typography>Email (8 interactions)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography 
                      variant="body2" 
                      sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                      onClick={() => {
                        if (selectedGroupId) {
                          handleAddConditionWithAttribute(selectedGroupId, 'email', 'bounced');
                        }
                      }}
                    >
                      Bounced
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}
                      onClick={() => {
                        if (selectedGroupId) {
                          handleAddConditionWithAttribute(selectedGroupId, 'email', 'clicked');
                        }
                      }}
                    >
                      Clicked
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

            {/* Segments Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Select from existing segments to include in your new segment.
                </Typography>
                
                {/* Mock Segments */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      if (selectedGroupId) {
                        handleAddConditionWithAttribute(selectedGroupId, 'segment', 'top_tier_recipients');
                      }
                    }}
                  >
                    <span>Top Tier Recipients</span>
                    <Chip label="Dynamic" size="small" variant="outlined" />
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      if (selectedGroupId) {
                        handleAddConditionWithAttribute(selectedGroupId, 'segment', 'all_segment');
                      }
                    }}
                  >
                    <span>All segment</span>
                    <Chip label="Dynamic" size="small" variant="outlined" />
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      if (selectedGroupId) {
                        handleAddConditionWithAttribute(selectedGroupId, 'segment', 'event_recipients');
                      }
                    }}
                  >
                    <span>Event Recipients</span>
                    <Chip label="Dynamic" size="small" variant="outlined" />
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      if (selectedGroupId) {
                        handleAddConditionWithAttribute(selectedGroupId, 'segment', 'uk_clients');
                      }
                    }}
                  >
                    <span>UK Clients</span>
                    <Chip label="Dynamic" size="small" variant="outlined" />
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      if (selectedGroupId) {
                        handleAddConditionWithAttribute(selectedGroupId, 'segment', 'vip_customers');
                      }
                    }}
                  >
                    <span>VIP Customers</span>
                    <Chip label="Static" size="small" variant="outlined" />
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Include contacts Tab */}
            {activeTab === 3 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Select specific contacts to include in your segment.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload contacts
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add manually
                </Button>
              </Box>
            )}

            {/* Exclude contacts Tab */}
            {activeTab === 4 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Select specific contacts to exclude from your segment.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload contacts
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add manually
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </Paper>

    {/* Delete Confirmation Dialog */}
    <Dialog
      open={deleteDialog.open}
      onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
    >
      <DialogTitle>
        {deleteDialog.type === 'group' ? 'Delete Group' : 'Delete Condition'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {deleteDialog.type === 'group' 
            ? 'Are you sure you want to delete this group? All subgroups and conditions will also be deleted.' 
            : 'Are you sure you want to delete this condition?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={deleteDialog.type === 'group' ? confirmDeleteGroup : confirmDeleteCondition}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    {/* Customer Information Dialog */}
    <Dialog
      open={customerInfoDialog.open}
      onClose={handleCloseCustomerInfoDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>当前Segment包括的客户信息</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          共找到 {customerInfoDialog.customers.length} 个匹配的客户
        </DialogContentText>
        
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {customerInfoDialog.customers.map((customer, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}>
              {Object.prototype.hasOwnProperty.call(customer, 'name') ? (
                // Account information
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {(customer as Account).name}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {(customer as Account).accountnumber && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>客户编号</Typography>
                        <Typography variant="body2">{(customer as Account).accountnumber}</Typography>
                      </Box>
                    )}
                    {(customer as Account).industrycode && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>行业</Typography>
                        <Typography variant="body2">{(customer as Account).industrycode}</Typography>
                      </Box>
                    )}
                    {(customer as Account).accountcategorycode && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>客户规模</Typography>
                        <Typography variant="body2">{(customer as Account).accountcategorycode}</Typography>
                      </Box>
                    )}
                    {(customer as Account).telephone1 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>电话</Typography>
                        <Typography variant="body2">{(customer as Account).telephone1}</Typography>
                      </Box>
                    )}
                    {(customer as Account).websiteurl && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>网站</Typography>
                        <Typography variant="body2" component="a" href={(customer as Account).websiteurl} target="_blank" rel="noopener noreferrer">
                          {(customer as Account).websiteurl}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                // Contact information
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {(customer as Contact).firstname} {(customer as Contact).lastname}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {(customer as Contact).jobtitle && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>职位</Typography>
                        <Typography variant="body2">{(customer as Contact).jobtitle}</Typography>
                      </Box>
                    )}
                    {(customer as Contact).department && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>部门</Typography>
                        <Typography variant="body2">{(customer as Contact).department}</Typography>
                      </Box>
                    )}
                    {(customer as Contact).emailaddress1 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>邮箱</Typography>
                        <Typography variant="body2" component="a" href={`mailto:${(customer as Contact).emailaddress1}`}>
                          {(customer as Contact).emailaddress1}
                        </Typography>
                      </Box>
                    )}
                    {(customer as Contact).telephone1 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>商务电话</Typography>
                        <Typography variant="body2">{(customer as Contact).telephone1}</Typography>
                      </Box>
                    )}
                    {(customer as Contact).mobilephone && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>移动电话</Typography>
                        <Typography variant="body2">{(customer as Contact).mobilephone}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCustomerInfoDialog} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>

    {/* Snackbar for user feedback */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleSnackbarClose} 
        severity={snackbar.severity} 
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </Box>
    </Box>
  );
};

export default SegmentBuilder;
