import api from './api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/v1';

const analysisService = {
  // Upload face image for analysis
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

  // Poll job status
  getStatus: async (jobId) => {
    const response = await api.get(`/analysis/status/${jobId}`);
    return response.data;
  },

  // Poll until completed (with timeout)
  pollUntilComplete: async (jobId, onProgress, maxAttempts = 30) => {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await analysisService.getStatus(jobId);
      const { status, progress, result_id } = response.data;

      if (onProgress) onProgress(progress || 0);

      if (status === 'completed') {
        return result_id;
      }

      if (status === 'failed') {
        throw new Error('Analysis failed. Please try again.');
      }

      // Wait 2 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    throw new Error('Analysis timed out. Please try again.');
  },
};

export default analysisService;