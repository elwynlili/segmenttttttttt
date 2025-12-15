import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import type { NewSegmentFormData } from '../types/segment';

interface NewSegmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewSegmentFormData) => void;
}

const NewSegmentDialog: React.FC<NewSegmentDialogProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewSegmentFormData>({
    name: '',
    audience: 'contact'
  });
  
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = event.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error when user starts typing
      if (name === 'name' && errors.name) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Segment name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      // Reset form after submission
      setFormData({ name: '', audience: 'contact' });
      setErrors({});
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form when canceled
    setFormData({ name: '', audience: 'contact' });
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
        New segment
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
            Name the segment *
          </Typography>
          <TextField
            fullWidth
            size="small"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Segment name"
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </Box>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
            Select a target audience
          </Typography>
          <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
            <InputLabel>Audience</InputLabel>
            <Select
              name="audience"
              value={formData.audience}
              label="Audience"
              onChange={handleChange}
            >
              <MenuItem value="contact">Contact</MenuItem>
              <MenuItem value="leads">Leads</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderRadius: 1,
            minWidth: 80
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            borderRadius: 1,
            minWidth: 80,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-1px)', boxShadow: 3 }
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSegmentDialog;