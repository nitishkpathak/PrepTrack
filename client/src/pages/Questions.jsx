import { useEffect, useState, useMemo } from "react";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";

import {
  addQuestion,
  getQuestions,
  deleteQuestion,
  updateQuestion,
  scrapeDescription,
} from "../services/questionService";
import { getProfile } from "../services/userService";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState(false);

  // Edit states
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [addMode, setAddMode] = useState("manual");
  const [linkInput, setLinkInput] = useState("");
  const [scraping, setScraping] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    title: "",
    topic: savedUser.preferredPlatform || "LeetCode",
    difficulty: "Easy",
    status: "Pending",
    notes: "",
    link: "",
  });

  // Fetch Questions
  const fetchQuestions = async () => {
    setFetching(true);
    try {
      const [questionsData, profileData] = await Promise.all([
        getQuestions(),
        getProfile(),
      ]);
      setQuestions(questionsData);
      if (profileData && profileData.user) {
        localStorage.setItem("user", JSON.stringify(profileData.user));
        window.dispatchEvent(new Event("userUpdated"));

        // Initialize default platform for adding questions
        setFormData((prev) => ({
          ...prev,
          topic: prev.topic || profileData.user.preferredPlatform || "LeetCode",
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load questions");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    window.scrollTo(0, 0);
  }, []);

  // Filter logic (same as Dashboard)
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((question) => {
        return (
          question.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (difficultyFilter === "" ||
            question.difficulty === difficultyFilter) &&
          (statusFilter === "" || question.status === statusFilter) &&
          (!favoriteFilter || question.favorite === true)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [questions, searchTerm, difficultyFilter, statusFilter, favoriteFilter]);

  // Input Change Handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Scrape Link logic
  const handleParseLink = async () => {
    if (!linkInput) {
      toast.error("Please paste a valid problem URL first 😄");
      return;
    }

    setScraping(true);
    try {
      let title = "";
      let platform = "";
      const url = new URL(linkInput);

      if (url.hostname.includes("leetcode.com")) {
        platform = "LeetCode";
        const match = url.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
        if (match && match[1]) {
          title = match[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      } else if (url.hostname.includes("geeksforgeeks.org")) {
        platform = "GeeksforGeeks";
        const match = url.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
        if (match && match[1]) {
          title = match[1]
            .split("-")
            .filter((word) => !(/^\d+$/.test(word) && word.length > 5))
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      } else if (url.hostname.includes("codeforces.com")) {
        platform = "Codeforces";
        const match = url.pathname.match(/\/problemset\/problem\/(\d+)\/([A-Z])/) || url.pathname.match(/\/contest\/(\d+)\/problem\/([A-Z])/);
        if (match) {
          title = `Codeforces ${match[1]}${match[2]}`;
        }
      }

      if (!platform) {
        const hostParts = url.hostname.split(".");
        if (hostParts.length >= 2) {
          const rawName = hostParts[hostParts.length - 2];
          platform = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }
      }

      if (!title) {
        const segments = url.pathname.split("/").filter(Boolean);
        let lastSegment = "";
        for (let i = segments.length - 1; i >= 0; i--) {
          if (isNaN(segments[i])) {
            lastSegment = segments[i];
            break;
          }
        }
        if (!lastSegment && segments.length > 0) {
          lastSegment = segments[segments.length - 1];
        }
        title = lastSegment
          .replace(/[-_]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      if (!title) {
        title = "New DSA Problem";
      }

      let description = "";
      try {
        const res = await scrapeDescription(linkInput);
        if (res && res.description) {
          description = res.description;
        }
      } catch (err) {
        console.error("Scraping description error:", err);
      }

      setFormData({
        title: title,
        topic: platform || "DSA",
        difficulty: "Medium",
        status: "Pending",
        notes: description,
        link: linkInput,
      });

      toast.success("Successfully fetched question details! Please verify below. 🚀");
    } catch (error) {
      console.error(error);
      toast.error("Invalid URL. Please enter a complete web link.");
    } finally {
      setScraping(false);
    }
  };

  // Submit Handler (Used to save edits & additions)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.topic || !formData.notes) {
      toast.error("Please fill all required fields 😄");
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await updateQuestion(editId, formData);
        toast.success(`${formData.topic} Question Updated 🚀`);
        setEditId(null);
      } else {
        await addQuestion(formData);
        toast.success("Question Added Successfully");
      }

      // Refresh Questions
      fetchQuestions();

      // Reset Form
      const savedUser = JSON.parse(localStorage.getItem("user")) || {};
      setFormData({
        title: "",
        topic: savedUser.preferredPlatform || "LeetCode",
        difficulty: "Easy",
        status: "Pending",
        notes: "",
        link: "",
      });
      setLinkInput("");
      setAddMode("manual");

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (question, newStatus) => {
    try {
      await updateQuestion(question._id, { status: newStatus });
      fetchQuestions();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  // Favorite Toggle Handler
  const handleFavorite = async (question) => {
    try {
      await updateQuestion(question._id, { favorite: !question.favorite });
      fetchQuestions();
    } catch (error) {
      console.log(error);
      toast.error("Failed to toggle favorite");
    }
  };

  // Edit Action Trigger
  const handleEdit = (question) => {
    setEditId(question._id);
    setFormData({
      title: question.title,
      topic: question.topic,
      difficulty: question.difficulty,
      status: question.status,
      notes: question.notes,
      link: question.link,
    });
    // Scroll to edit form
    document.getElementById("edit-form-anchor")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Delete Action Trigger
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      await deleteQuestion(id);
      toast.success("Question Deleted");
      fetchQuestions();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete question");
    }
  };

  return (
    <div
      className="
        flex
        min-h-screen
        bg-white
        dark:bg-black
        text-black
        dark:text-white
        transition
        duration-300
      "
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div
        className="
          flex-1
          p-4
          md:p-6
          md:ml-[260px]
        "
      >
        {/* Sticky Header */}
        <div
          className="
            sticky
            top-0
            z-20
            bg-white
            dark:bg-gray-950
            border-b
            border-gray-300
            dark:border-gray-800
            py-5
            mb-8
            backdrop-blur-md
            transition
            duration-300
            flex
            flex-col
            gap-4
          "
        >
          <div className="flex items-center gap-4 justify-between md:justify-start">
            <button
              aria-label="Open Sidebar"
              onClick={() => setSidebarOpen(true)}
              className="
                md:hidden
                p-2
                bg-blue-600
                text-white
                rounded-lg
                cursor-pointer
              "
            >
              <Menu size={20} />
            </button>

            <h1
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-black
                dark:text-white
              "
            >
              Questions
            </h1>
          </div>
        </div>

        {/* Filter bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Favorites filter toggle */}
        <button
          aria-label="Toggle Favorites Filter"
          onClick={() => setFavoriteFilter(!favoriteFilter)}
          className={`
            mb-6
            px-4
            py-2
            rounded-lg
            cursor-pointer
            transition-all
            ${
              favoriteFilter
                ? "bg-yellow-500 text-black"
                : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            }
          `}
        >
          {favoriteFilter ? "⭐ Showing Favorites" : "☆ Show Favorites"}
        </button>

        {/* Add/Edit Form */}
        {(searchTerm === "" || editId) && (
          <div id="edit-form-anchor" className="mb-8">
            <QuestionForm
              editId={editId}
              formData={formData}
              setFormData={setFormData}
              addMode={addMode}
              setAddMode={setAddMode}
              linkInput={linkInput}
              setLinkInput={setLinkInput}
              scraping={scraping}
              loading={loading}
              handleParseLink={handleParseLink}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        )}

        {/* Questions Grid using modular component */}
        <QuestionList
          fetching={fetching}
          filteredQuestions={filteredQuestions}
          expandedQuestion={expandedQuestion}
          setExpandedQuestion={setExpandedQuestion}
          handleStatusChange={handleStatusChange}
          handleFavorite={handleFavorite}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default Questions;