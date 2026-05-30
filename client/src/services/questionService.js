import axios from "axios";

const API_URL =
  "http://localhost:5000/api/questions";


// Add Question
export const addQuestion = async (
  questionData
) => {

  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.post(
    API_URL,
    questionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Get Questions
export const getQuestions = async () => {

  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete Question
export const deleteQuestion = async (
  id
) => {

  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update Question
export const updateQuestion = async (
  id,
  updatedData
) => {

  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.put(
    `${API_URL}/${id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};