import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';
import PlayerForm from './components/PlayerForm';

function App() {
  return (
    <div className="App">
     <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Football Player Manager
            </Typography>
          </Toolbar>
        </AppBar>
          <Routes>
            <Route path="/" element={<PlayerList />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/player/new" element={<PlayerForm />} />
            <Route path="/player/:id/edit" element={<PlayerForm />} />
          </Routes>
      </Router>

    </div>
  );
}

export default App;
