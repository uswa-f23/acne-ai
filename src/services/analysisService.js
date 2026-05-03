import api from './api';

const extractErrorMessage = (err) => {
  const data = err.response?.data;
  if (!data) return err.message;

  // Your backend shape: { success: false, error: { code, message } }
  if (typeof data.error?.message === 'string') return data.error.message;

  // Flat message string on the response body
  if (typeof data.message === 'string') return data.message;

  // FastAPI validation errors — detail is an array of objects
  if (Array.isArray(data.detail)) {
    return data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
  }

  // FastAPI plain string detail
  if (typeof data.detail === 'string') return data.detail;

  // Last resort
  return err.message;
};

const analysisService = {
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      // Use the shared `api` instance so its auth interceptor adds the token automatically
      const response = await api.post('/analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  getStatus: async (jobId) => {
    const response = await api.get(`/analysis/status/${jobId}`);
    return response.data;
  },

  pollUntilComplete: async (jobId, onProgress, maxAttempts = 60) => {
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    throw new Error('Analysis timed out. Please try again.');
  },
};

export default analysisService;