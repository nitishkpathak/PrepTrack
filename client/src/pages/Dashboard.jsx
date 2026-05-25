import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  addQuestion,
  getQuestions,
} from "../services/questionService";

function Dashboard() {

  const navigate = useNavigate();

  // Check token
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    difficulty: "Easy",
    status: "Pending",
    notes: "",
  });

  // Questions state
  const [questions, setQuestions] = useState([]);

  // Fetch Questions
  const fetchQuestions = async () => {

    try {

      const data = await getQuestions();

      setQuestions(data);

    } catch (error) {

      console.log(error);

    }
  };

  // Load questions on page load
  useEffect(() => {

    fetchQuestions();

  }, []);

  // Handle input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Handle submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await addQuestion(
        formData
      );

      console.log(data);

      alert("Question Added Successfully");

      // Refresh questions
      fetchQuestions();

      // Reset form
      setFormData({
        title: "",
        topic: "",
        difficulty: "Easy",
        status: "Pending",
        notes: "",
      });

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }
  };

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (
    // <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="flex bg-gray-950 text-white">

    <Sidebar
      handleLogout={handleLogout}
    />

    <div className="flex-1 p-6 md:p-8 pt-24 md:pt-8">

      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl md:text-3xl font-bold pl-14 md:pl-0">
          PrepTrack Dashboard
        </h1>

      </div>

      {/* Add Question Form */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Add Question
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
        >

          <input
            type="text"
            name="title"
            placeholder="Question Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 outline-none"
          />

          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 outline-none"
          />

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 outline-none"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 outline-none"
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
          >
            Add Question
          </button>

        </form>

      </div>

      {/* Questions List */}
      <div className="mt-8">

        <h2 className="text-2xl font-bold mb-4">
          Your Questions
        </h2>

        <div className="grid gap-4">

          {questions.map((question) => (

            <div
              key={question._id}
              className="bg-gray-800 p-4 rounded-xl"
            >

              <h3 className="text-xl font-semibold">
                {question.title}
              </h3>

              <p className="text-gray-400">
                {question.topic}
              </p>

              <p className="mt-2">
                Difficulty:
                <span className="ml-2 text-blue-400">
                  {question.difficulty}
                </span>
              </p>

              <p>
                Status:
                <span className="ml-2 text-green-400">
                  {question.status}
                </span>
              </p>

              <p className="mt-2 text-gray-300">
                {question.notes}
              </p>

            </div>

          ))}

        </div>

      </div>
    </div>

    </div>
  );
}

export default Dashboard;