import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Paper, Typography, Button, Grid, Chip, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await api.getPlayerById(id);
        setPlayer(response.data);
      } catch (error) {
        setError('Failed to load player details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deletePlayer(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting player:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !player) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error || 'Player not found'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to list
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to list
        </Button>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/player/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {player.firstName} {player.lastName}
          <Typography variant="subtitle1" color="text.secondary">
            {player.nationalities.join(', ')}
          </Typography>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ width: 160, fontWeight: 'bold' }}>
                  Date of Birth:
                </Typography>
                <Typography variant="body1">
                  {formatDate(player.dateOfBirth)} ({calculateAge(player.dateOfBirth)} years)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ width: 160, fontWeight: 'bold' }}>
                  Height:
                </Typography>
                <Typography variant="body1">
                  {player.height} cm ({Math.floor(player.height / 30.48)}'{Math.round((player.height / 2.54) % 12)}")
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Nationalities:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {player.nationalities.map(nationality => (
                    <Chip key={nationality} label={nationality} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Football Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Positions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {player.positions.map(position => (
                    <Chip key={position} label={position} color="primary" />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ width: 160, fontWeight: 'bold' }}>
              Created:
            </Typography>
            <Typography variant="body1">
              {formatDate(player.createdAt)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ width: 160, fontWeight: 'bold' }}>
              Last Modified:
            </Typography>
            <Typography variant="body1">
              {formatDate(player.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Player</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {player.firstName} {player.lastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayerDetail;