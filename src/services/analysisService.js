import api from './api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/v1';

const analysisService = {
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${API_BASE_URL}/analysis/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getStatus: async (jobId) => {
    const response = await api.get(`/analysis/status/${jobId}`);
    return response.data;
  },

pollUntilComplete: async (jobId, onProgress, maxAttempts = 60) => {  // ← increase to 60
  for (let i = 0; i < maxAttempts; i++) {
    const response = await analysisService.getStatus(jobId);
    console.log('Poll response:', response);

    const status = response?.data?.status;
    const progress = response?.data?.progress;
    const result_id = response?.data?.result_id;

    if (onProgress) onProgress(progress || 0);

    if (status === 'completed' && result_id) {
      return result_id;
    }

    if (status === 'failed') {
      throw new Error('Analysis failed. Please try again.');
    }

    // ← increase wait to 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error('Analysis timed out. Please try again.');
},
};

export default analysisService;