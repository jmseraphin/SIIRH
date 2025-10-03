import axios from "axios";

const API_URL = "http://localhost:8000/api/recrutement";

export const submitCandidature = async (formData) => {
  try {
    // mandefa multipart/form-data (CV + formulaire)
    const response = await axios.post(`${API_URL}/candidatures`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCandidatures = async () => {
  try {
    const response = await axios.get(`${API_URL}/candidatures`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
