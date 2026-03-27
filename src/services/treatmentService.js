import api from './api';

const treatmentService = {
  // Get treatment recommendations for a result
  getTreatment: async (resultId) => {
    const response = await api.get(`/treatment/${resultId}`);
    return response.data;
  },
};

export default treatmentService;