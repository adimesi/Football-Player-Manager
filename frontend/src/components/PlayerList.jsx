import React, { lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, Button, Paper, Typography, TextField, MenuItem, 
  Select, Chip, FormControl, InputLabel, OutlinedInput,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Stack, InputAdornment, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Flag from 'react-world-flags';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import api from '../services/api'; 



const POSITIONS = [
    'Goalkeeper',
    'Center Back',
    'Right Back',
    'Left Back',
    'Defensive Midfielder',
    'Central Midfielder',
    'Attacking Midfielder',
    'Right Midfielder',
    'Left Midfielder',
    'Right Winger',
    'Left Winger',
    'Center Forward',
    'Striker'
  ];
  
  const NATIONALITIES = [
    { code: 'GB-ENG', name: 'England' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'PT', name: 'Portugal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'CO', name: 'Colombia' },
    { code: 'HR', name: 'Croatia' },
    { code: 'DK', name: 'Denmark' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'US', name: 'USA' },
    { code: 'MX', name: 'Mexico' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' }
  ];


const PlayerList = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        nationalities: [],
        minAge: '',
        maxAge: '',
        positions: [],
        minHeight: '',
        maxHeight: ''
      });

      const fetchPlayers = async () => {
        setLoading(true);
        try {
          const response = await api.getPlayersWithFilters(filters);
          setPlayers(response.data);
          console.log('Fetched players:', response.data);
        } catch (error) {
          console.error('Error fetching players:', error);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchPlayers();
      }, [filters]);
      
      const handleFilterChange = (name, value) => {
        setFilters(prev => ({
          ...prev,
          [name]: value
        }));
      };

      
      const handleDeleteClick = (player) => {
        setPlayerToDelete(player);
        setDeleteDialogOpen(true);
      };
      
      const handleDeleteConfirm = async () => {
        try {
          await api.deletePlayer(playerToDelete.id);
          fetchPlayers();
        } catch (error) {
          console.error('Error deleting player:', error);
        } finally {
          setDeleteDialogOpen(false);
          setPlayerToDelete(null);
        }
      };
      
      const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };
      
      const handleFileUpload = async () => {
        if (!selectedFile) return;
        
        try {
          await api.bulkUpload(selectedFile);
          setUploadDialogOpen(false);
          setSelectedFile(null);
          fetchPlayers();
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      
        const formatHeight = (height) => {
        const feet = Math.floor(height / 30.48);
        const inches = Math.round((height / 2.54) % 12);
        return `${height} cm (${feet}'${inches}")`;
      };
    
      const formatNationality = (nationalities) => {
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {nationalities.map(nat => {
              const nationality = NATIONALITIES.find(n => n.name === nat);
              const code = nationality ? nationality.code.toLowerCase() : '';
              return (
                <Flag code={code} style={{ width: 24, height: 20 }} />
              );
            })}
          </Box>
        );
      };
      
      const columns = [
        { 
            field: 'fullName',
            headerName: 'Full Name',
            width: 200,
            renderCell: (params) => { return `${params.row.firstName} ${params.row.lastName}`}
        },
        { 
          field: 'nationalities', 
          headerName: 'Nationalities', 
          width: 300,
          renderCell: (params) => formatNationality(params.row.nationalities)
        },
        { 
          field: 'dateOfBirth', 
          headerName: 'Age', 
          width: 100,
          valueGetter: (params) => {
            if (!params) {
                return params.row.dateOfBirth;
              }
            const today = new Date();
            const birthDate = new Date(params);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {age--;}
            return `${age}`;}
        },
        { 
          field: 'positions', 
          headerName: 'Positions', 
          width: 300,
          renderCell: (params) => (
            <Box sx={{ display: 'box', flexWrap: 'wrap', gap: 1 }}>
              {params.row.positions.map(pos => (
                <Chip key={pos} label={pos} size="small" />
              ))}
            </Box>
          )
        },
        { 
          field: 'height', 
          headerName: 'Height', 
          width: 150,
          renderCell: (params) => formatHeight(params.row.height)
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 150,
          renderCell: (params) => (
            <Stack direction="row" spacing={1}>
              <IconButton 
                color="primary" 
                size="small"
                onClick={(e) => {
                  e.preventDefault(); 
                  navigate(`/player/${params.row.id}/edit`); 
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteClick(params.row); 
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )
        }
      ];
      
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="h1" >
              Football Players
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/player/new')}
                sx={{ mr: 1 }}
              >
                Add Player
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload CSV
              </Button>
            </Box>
          </Box>
          
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                size="small"
                value={filters.name}
                onChange={(e) => handleFilterChange('firstName', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl sx={{ width: 200 }} size="small">
                <InputLabel>Nationalities</InputLabel>
                <Select
                  multiple
                  value={filters.nationalities}
                  onChange={(e) => handleFilterChange('nationalities', e.target.value)}
                  input={<OutlinedInput label="Nationalities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {NATIONALITIES.map((nat) => (
                    <MenuItem key={nat.name} value={nat.name}>
                      {nat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Min Age"
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ width: 100 }}
                  value={filters.minAge}
                  onChange={(e) =>{handleFilterChange('minAge', e.target.value);
                    if(filters.maxAge==''&& e.target.value!=''){handleFilterChange('maxAge', 100)}
                  } }
                />
                <TextField
                  label="Max Age"
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ width: 100 }}
                  value={filters.maxAge}
                  onChange={(e) => {handleFilterChange('maxAge', e.target.value);
                    if(filters.minAge=='' && e.target.value!=''){handleFilterChange('minAge', 15)}
                   }
                  }
                />
              </Box>
              
              <FormControl sx={{ width: 200 }} size="small">
                <InputLabel>Positions</InputLabel>
                <Select
                  multiple
                  value={filters.positions}
                  onChange={(e) => handleFilterChange('positions', e.target.value)}
                  input={<OutlinedInput label="Positions" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
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
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Min Height (cm)"
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ width: 120 }}
                  value={filters.minHeight}
                  onChange={(e) =>{ handleFilterChange('minHeight', e.target.value);
                    if(filters.maxHeight=='' && e.target.value!=''){handleFilterChange('maxHeight', 210)}
                  } }
                />
                <TextField
                  label="Max Height (cm)"
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ width: 120 }}
                  value={filters.maxHeight}
                  onChange={(e) =>{ handleFilterChange('maxHeight', e.target.value);
                  if(filters.minHeight==''&& e.target.value!=''){handleFilterChange('minHeight', 150)}
                  } }
                />
              </Box>
            </Box>
        </Paper>
          
          <Paper sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={players}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              onRowClick={(params) => navigate(`/player/${params.row.id}`)}
            
            />
          </Paper>
          
          {/* Delete Confirmation Dialog */} 
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Player</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete {playerToDelete?.firstName} {playerToDelete?.lastName}? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          
          CSV Upload Dialog
          <Dialog
            open={uploadDialogOpen}
            onClose={() => setUploadDialogOpen(false)}
          >
            <DialogTitle>Upload CSV File</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Upload a CSV file containing player data to add multiple players at once.
                The CSV must include the following columns: firstName, lastName, nationalities, 
                dateOfBirth, positions, height.
              </DialogContentText>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </DialogContent>
             <DialogActions>
              <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleFileUpload} 
                color="primary" 
                disabled={!selectedFile}
              >
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    };
    
export default PlayerList;