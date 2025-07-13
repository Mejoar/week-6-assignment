import axios from 'axios';
import { debugNetworkRequest, debugNetworkResponse, debugNetworkError } from '../utils/debugUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    debugNetworkRequest(config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    debugNetworkError(error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    debugNetworkResponse(response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    debugNetworkError(error);
    return Promise.reject(error);
  }
);

export const bugService = {
  // Get all bugs
  getAllBugs: async (filters = {}) => {
    try {
      const response = await api.get('/bugs', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bugs');
    }
  },

  // Get bug by ID
  getBugById: async (id) => {
    try {
      const response = await api.get(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bug');
    }
  },

  // Create new bug
  createBug: async (bugData) => {
    try {
      const response = await api.post('/bugs', bugData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create bug');
    }
  },

  // Update bug
  updateBug: async (id, bugData) => {
    try {
      const response = await api.put(`/bugs/${id}`, bugData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update bug');
    }
  },

  // Delete bug
  deleteBug: async (id) => {
    try {
      const response = await api.delete(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete bug');
    }
  }
};

export default bugService;
