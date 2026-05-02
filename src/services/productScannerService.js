import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/v1';

const productScannerService = {
  scanProduct: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    const token = localStorage.getItem('access_token');
    const response = await axios.post(
      `${API_BASE_URL}/product/scan`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default productScannerService;