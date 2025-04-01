import axios from 'axios';

const API_URL = 'http://localhost:8080/api';


const api = {
 
  getPlayersWithFilters: async (filters) => {
    const body = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null && v !== ''));
    return axios.post(`${API_URL}/player/filter`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  ,
  
  getPlayerById: async (id) => {
    return axios.get(`${API_URL}/player/${id}`);
  },
  
  createPlayer: async (player) => {
    return axios.post(`${API_URL}/player`, player);
  },
  
  updatePlayer: async (id, player) => {
    return axios.put(`${API_URL}/player/${id}`, player);
  },
  
  deletePlayer: async (id) => {
    return axios.delete(`${API_URL}/player/${id}`);
  },
  
  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/player/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;