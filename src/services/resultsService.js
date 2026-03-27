import api from './api';

const resultsService = {
  // Get single result by ID
  getResult: async (resultId) => {
    const response = await api.get(`/results/${resultId}`);
    return response.data;
  },

  // Get all results history
  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/results/`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export default resultsService;