import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,Paper,Typography,TextField,Button,Grid,FormControl,
  InputLabel,Select,MenuItem,Chip,OutlinedInput,CircularProgress,
  Alert,Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import api from '../services/api';

const POSITIONS = [
  'Center Back',
  'Right Back',
  'Left Back',
  'Left Wing-Back',
  'Right Wing-Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Central Attacking Midfielder',
  'Right Midfielder',
  'Left Midfielder',
  'Right Forward',
  'Left Forward',
  'Centre Forward',
  'Right Winger',
  'Left Winger',
  'Striker'
];

const NATIONALITIES = [
  'England',
  'Spain',
  'France',
  'Germany',
  'Italy',
  'Brazil',
  'Argentina',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Uruguay',
  'Colombia',
  'Croatia',
  'Denmark',
  'Sweden',
  'Norway',
  'USA',
  'Mexico',
  'Japan',
  'South Korea'
];

const PlayerForm = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalities: [],
    dateOfBirth: '',
    positions: [],
    height: ''
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    if (isEditMode) {
      const fetchPlayer = async () => {
        try {
          const response = await api.getPlayerById(id);
          const player = response.data;
          const dateOfBirth = new Date(player.dateOfBirth).toISOString().split('T')[0];
          setFormData({
            firstName: player.firstName,
            lastName: player.lastName,
            nationalities: player.nationalities,
            dateOfBirth,
            positions: player.positions,
            height: player.height
          });
        } catch (error) {
          console.error('Error fetching player:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load player data',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchPlayer();
    }
  }, [id, isEditMode]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Player cannot be older than 100 years';
      } else if (age < 15) {
        newErrors.dateOfBirth = 'Player must be at least 15 years old';
      }
    }
    
    if (formData.nationalities.length === 0) {
      newErrors.nationalities = 'At least one nationality is required';
    }
    
    if (formData.positions.length === 0) {
      newErrors.positions = 'At least one position is required';
    }
    
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else {
      const height = parseFloat(formData.height);
      if (isNaN(height) || height <= 0) {
        newErrors.height = 'Height must be a positive number';
      } else if (height < 150) {
        newErrors.height = 'Height must be at least 150 cm';
      } else if (height > 230) {
        newErrors.height = 'Height cannot exceed 230 cm';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const playerData = {
        ...formData,
        height: parseFloat(formData.height)
      };
      
      if (isEditMode) {
        await api.updatePlayer(id, playerData);
      } else {
        await api.createPlayer(playerData);
      }
      
      setSnackbar({
        open: true,
        message: `Player ${isEditMode ? 'updated' : 'created'} successfully`,
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate(isEditMode ? `/player/${id}` : '/');

      }, 1500);
    } catch (error) {
      console.error('Error saving player:', error);
      
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} player`;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(isEditMode ? `/player/${id}` : '/')}
        >
          {isEditMode ? 'Back to details' : 'Back to list'}
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Player' : 'Add New Player'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                error={!!errors.height}
                helperText={errors.height}
                required
                inputProps={{ step: 0.1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.nationalities}>
                <InputLabel>Nationalities</InputLabel>
                <Select
                  multiple
                  name="nationalities"
                  value={formData.nationalities}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Nationalities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {NATIONALITIES.map((nationality) => (
                    <MenuItem key={nationality} value={nationality}>
                      {nationality}
                    </MenuItem>
                  ))}
                </Select>
                {errors.nationalities && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1 }}>
                    {errors.nationalities}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.positions}>
                <InputLabel>Positions</InputLabel>
                <Select
                  multiple
                  name="positions"
                  value={formData.positions}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Positions" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {POSITIONS.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </Select>
                {errors.positions && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1 }}>
                    {errors.positions}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(isEditMode ? `/player/${id}` : '/')}
                  sx={{ mr: 1 }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Player'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlayerForm;