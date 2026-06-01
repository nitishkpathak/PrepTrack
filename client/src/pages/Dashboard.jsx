import {useEffect, useState, useMemo} from "react";
import {useNavigate,} from "react-router-dom";
import {Menu,} from "lucide-react";
import toast from "react-hot-toast";
import {formatDistanceToNow, } from "date-fns";

import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import FilterBar from "../components/FilterBar";
import ProgressChart from "../components/ProgressChart";
import DifficultyChart from "../components/DifficultyChart";

import {addQuestion, getQuestions, deleteQuestion, updateQuestion, scrapeDescription} from "../services/questionService";

function Dashboard() {

  const navigate = useNavigate();

  // Sidebar state
  const [open, setOpen] = useState(false);

  // Check token
  const token = localStorage.getItem(
    "token"
  );

  useEffect(() => {

    if (!token) {

      navigate("/");

    }

  }, [token]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    difficulty: "Easy",
    status: "Pending",
    notes: "",
    link: "",
  });

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter,] = useState("");
  const [statusFilter, setStatusFilter,] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [updatedQuestionId, setUpdatedQuestionId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [addMode, setAddMode] = useState("manual");
  const [linkInput, setLinkInput] = useState("");
  const [scraping, setScraping] = useState(false);
  
  // Fetch Questions
  const fetchQuestions = async () => {
    setFetching(true);
    try {
      const data = await getQuestions();

      console.log(
        "Dashboard Questions:",
        data
      );

      setQuestions(data);

    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

    

  // Load Questions
  useEffect(() => {
    fetchQuestions();

    window.scrollTo(0, 0);
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions
      .filter((question) => {
        return (
          question.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
          &&
          (
            difficultyFilter === ""
            ||
            question.difficulty === difficultyFilter
          )
          &&
          (
            statusFilter === ""
            ||
            question.status === statusFilter
          )
          &&
          (
            !favoriteFilter
            ||
            question.favorite === true
          )
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [questions, searchTerm, difficultyFilter, statusFilter, favoriteFilter]);

  // Parse problem link to auto-fill form details
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

      // LeetCode check
      if (url.hostname.includes("leetcode.com")) {
        platform = "LeetCode";
        const match = url.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
        if (match && match[1]) {
          title = match[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }
      // GeeksforGeeks check
      else if (url.hostname.includes("geeksforgeeks.org")) {
        platform = "GeeksforGeeks";
        const match = url.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
        if (match && match[1]) {
          title = match[1]
            .split("-")
            .filter((word) => !(/^\d+$/.test(word) && word.length > 5))
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }
      // Codeforces check
      else if (url.hostname.includes("codeforces.com")) {
        platform = "Codeforces";
        const match = url.pathname.match(/\/problemset\/problem\/(\d+)\/([A-Z])/) || url.pathname.match(/\/contest\/(\d+)\/problem\/([A-Z])/);
        if (match) {
          title = `Codeforces ${match[1]}${match[2]}`;
        }
      }

      // Fallback platform detector
      if (!platform) {
        const hostParts = url.hostname.split(".");
        if (hostParts.length >= 2) {
          const rawName = hostParts[hostParts.length - 2];
          platform = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }
      }

      // Fallback parser if we couldn't get title
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

      // Fetch description (Notes) from server side scraping endpoint
      let description = "";
      try {
        const res = await scrapeDescription(linkInput);
        if (res && res.description) {
          description = res.description;
        }
      } catch (err) {
        console.error("Scraping description error:", err);
      }

      // Populate form data
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

  // Handle Input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Handle Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (

      !formData.title ||
      !formData.topic ||
      !formData.notes

    ) {

      toast.error(
        "Please fill all required fields 😄"
      );

      return;
    }

    try {

      setLoading(true);

      if (editId) {

        await updateQuestion(
          editId,
          formData
        );

        toast.success(`${formData.topic} Question Updated 🚀`);
        setUpdatedQuestionId(editId);

        setEditId(null);

      } else {

        await addQuestion(formData);

        toast.success("Question Added Successfully");

      }

      // Refresh Questions
      fetchQuestions();

      // Reset Form
      setFormData({
        title: "",
        topic: "",
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

    }
  };

  useEffect(() => {

  if (updatedQuestionId) {

    document
      .getElementById(
        updatedQuestionId
      )
      ?.scrollIntoView({

        behavior: "smooth",
        block: "center",

      });

    setUpdatedQuestionId(null);

  }

}, [questions]);


  // Toggle Favorite
const handleFavorite =
  async (question) => {

    try {

      await updateQuestion(
        question._id,
        {
          favorite:
            !question.favorite,
        }
      );

      fetchQuestions();

    } catch (error) {

      console.log(error);

    }
  };

  // Delete Question
    const handleDelete =
      async (id) => {

        const confirmDelete =
          window.confirm(

            "Are you sure you want to delete this question?"
          );

        if (!confirmDelete)
          return;

        try {

          await deleteQuestion(id);

          toast.success(
            "Question Deleted"
          );

          fetchQuestions();

        } catch (error) {

          console.log(error);

        }
      };

      // Update Status
      const handleStatusChange =
        async (
          question,
          newStatus
        ) => {

          try {

            await updateQuestion(
              question._id,
              {
                status: newStatus,
              }
            );

            fetchQuestions();

          } catch (error) {

            console.log(error);

          }
        };


    // Edit Question
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

      // Scroll to form
      document
        .getElementById("question-form")
        .scrollIntoView({
          behavior: "smooth",
        });
    };

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (

    <div
      className="
        min-h-screen
        bg-white
        dark:bg-gray-950
        text-black
        dark:text-white
        transition
        duration-300
        flex
      "
    >
      <ThemeToggle />

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={
          setActiveSection
        }
        open={open}
        closeSidebar={() =>
          setOpen(false)
        }
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-[260px]">

        {/* Mobile Topbar */}
        <div
          className="
            fixed
            top-0
            left-0
            right-0
            h-16
            border-b
            bg-white
            dark:bg-gray-950
            border-gray-300
            dark:border-gray-800
            flex
            items-center
            px-4
            z-30
            md:hidden
          "
        >

          {/* Menu Button */}
          <button
            aria-label="Open Sidebar"
            onClick={() => setOpen(true)}
            className="
              bg-blue-600
              hover:bg-blue-700
              p-2
              rounded-lg
            "
          >
            <Menu size={22} />
          </button>

        </div>

        {/* Content */}
        <div
          className="
            p-4
            sm:p-6
            md:p-8
            pt-24
            md:pt-8
          "
        >

          {/* Sticky Header */}
          <div
            className="
              sticky
              top-0
              z-10

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
            "
          >

            <h1
                className="
                  text-2xl
                  md:text-3xl
                  font-bold

                  text-black
                  dark:text-white
                "
              >
                PrepTrack Dashboard
              </h1>

          </div>

          {location.pathname ===
            "/dashboard" && ( 
        <>

          <StatsCards questions={questions} />
          <FilterBar

            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}

            difficultyFilter={
              difficultyFilter
            }

            setDifficultyFilter={
              setDifficultyFilter
            }

            statusFilter={statusFilter}

            setStatusFilter={
              setStatusFilter
            }

          />
          <button
            aria-label="Toggle Favorites Filter"
            onClick={() =>
              setFavoriteFilter(
                !favoriteFilter
              )
            }

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

            {
              favoriteFilter

                ? "⭐ Showing Favorites"

                : "☆ Show Favorites"
            }

          </button>
          {/* Add Question */}
          {
          searchTerm === "" && (

            <div
              id="question-form"

              className="
                bg-gray-200
                dark:bg-gray-800
                p-6
                rounded-xl
                mb-8
              "
            >

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {editId ? "Update Question" : "Add Question"}
              </h2>
            </div>

            {/* Form Mode Tabs (Only show if not editing a question) */}
            {!editId && (
              <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-3 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAddMode("manual");
                    setLinkInput("");
                    setFormData({
                      title: "",
                      topic: "",
                      difficulty: "Easy",
                      status: "Pending",
                      notes: "",
                      link: "",
                    });
                  }}
                  className={`pb-1 font-semibold transition-all border-b-2 cursor-pointer ${
                    addMode === "manual"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Manually Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddMode("link");
                    setLinkInput("");
                    setFormData({
                      title: "",
                      topic: "",
                      difficulty: "Easy",
                      status: "Pending",
                      notes: "",
                      link: "",
                    });
                  }}
                  className={`pb-1 font-semibold transition-all border-b-2 cursor-pointer ${
                    addMode === "link"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Add via Link
                </button>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid gap-4"
            >
              {/* URL Input and Done Button for Link mode */}
              {addMode === "link" && !formData.title && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    aria-label="Paste Problem URL"
                    type="url"
                    disabled={scraping}
                    placeholder="Paste Link (LeetCode, GeeksforGeeks, etc.)"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    className="
                      flex-1
                      p-3
                      rounded-lg
                      bg-white
                      dark:bg-gray-700
                      text-black
                      dark:text-white
                      border
                      border-gray-300
                      dark:border-gray-600
                      outline-none
                      disabled:opacity-60
                    "
                  />
                  <button
                    type="button"
                    disabled={scraping}
                    onClick={handleParseLink}
                    className={`
                      px-6
                      py-3
                      rounded-lg
                      text-white
                      font-semibold
                      transition-all
                      ${
                        scraping
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }
                    `}
                  >
                    {scraping ? "Fetching..." : "Done"}
                  </button>
                </div>
              )}

              {/* Show Form fields if Manual mode OR Link mode with parsed title */}
              {(addMode === "manual" || (addMode === "link" && formData.title)) && (
                <>
                  {addMode === "link" && !editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setLinkInput("");
                        setFormData({
                          title: "",
                          topic: "",
                          difficulty: "Easy",
                          status: "Pending",
                          notes: "",
                          link: "",
                        });
                      }}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm text-left mb-2 cursor-pointer w-fit inline-flex items-center gap-1 font-medium"
                    >
                      ← Paste a different link
                    </button>
                  )}

                  {/* Title */}
                  <input
                    aria-label="Question Title"
                    type="text"
                    name="title"
                    placeholder="Question Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-lg
                      bg-white
                      dark:bg-gray-700

                      text-black
                      dark:text-white

                      border
                      border-gray-300
                      dark:border-gray-600
                      outline-none
                    "
                  />

                  {/* Topic */}
                  <input
                    aria-label="Question Topic"
                    type="text"
                    name="topic"
                    placeholder="Topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-lg
                      bg-white
                      dark:bg-gray-700

                      text-black
                      dark:text-white

                      border
                      border-gray-300
                      dark:border-gray-600
                      outline-none
                    "
                  />

                  {/* Difficulty */}
                  <select
                    id="difficulty"
                    name="difficulty"
                    aria-label="Select Difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-lg
                      bg-white
                      dark:bg-gray-700

                      text-black
                      dark:text-white

                      border
                      border-gray-300
                      dark:border-gray-600
                      outline-none
                      cursor-pointer
                    "
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>

                  {/* Problem Link */}
                  <input
                    aria-label="Problem Link"
                    type="text"
                    name="link"
                    placeholder="Problem Link"
                    value={formData.link}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-lg
                      bg-white
                      dark:bg-gray-700

                      text-black
                      dark:text-white

                      border
                      border-gray-300
                      dark:border-gray-600
                      outline-none
                    "
                  />

                  {/* Notes */}
                  <textarea
                    aria-label="Question Notes"
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}

                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter"
                        &&
                        !e.shiftKey
                      ) {

                        e.preventDefault();

                        handleSubmit(e);

                      }
                    }}

                    className="
                      p-3
                      rounded-lg
                      bg-white
                      dark:bg-gray-700

                      text-black
                      dark:text-white

                      border
                      border-gray-300
                      dark:border-gray-600
                      outline-none
                    "
                  />

                  {/* Button */}
                  <button
                    disabled={loading}
                    className={`
                      p-3
                      rounded-lg
                      transition-all
                      text-white
                      font-semibold

                      ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }
                    `}
                  >
                    {loading
                      ? "Loading..."
                      : editId
                        ? "Update Question"
                        : "Add Question"}
                  </button>
                </>
              )}          
            </form>
          </div>
          )
          }

          {/* Questions */}
          <div>

            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >
              Your Questions
            </h2>

            <div className="grid gap-4">

              {fetching ? (
                <div className="text-center py-10 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-2xl animate-pulse">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    🔄 Loading questions from server...
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Please wait, initial load may take a moment if server is waking up
                  </p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-10 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">No Questions Found 😄</h3>
                  <p className="text-gray-400">Add a new question above to start tracking!</p>
                </div>
              ) : (
                filteredQuestions.map((question) => (

                <div
                  key={question._id}
                  id={question._id}

                  className="
                    p-4
                    rounded-xl
                    border
                    bg-gray-200
                    dark:bg-gray-800

                    border-gray-300
                    dark:border-gray-700
                    hover:border-blue-500
                    transition
                  "
                >

              <div
                    className="
                      flex
                      flex-col
                      md:flex-row
                      justify-between
                      items-start
                      gap-4
                      mb-3
                    "
                  >

                  {/* Title */}
                  <h3
                    className="
                      text-xl
                      font-semibold
                    "
                  >
                    {question.title}
                  </h3>

                  {/* Topic */}
                    <p
                      className="
                        text-gray-700
                        dark:text-gray-400
                        text-sm
                        mt-1
                      "
                    >
                      {question.topic}
                    </p>

                  {/* Difficulty */}
                  <p className="mt-2">
                    Difficulty:

                    <span
                      className={`
                        ml-2
                        px-2
                        py-1
                        rounded-lg
                        text-sm

                        ${
                          question.difficulty === "Easy"
                            ? "bg-green-600"

                          : question.difficulty === "Medium"
                            ? "bg-yellow-700 text-white"

                          : "bg-red-600"
                        }
                      `}
                    >
                      {question.difficulty}
                    </span>
                    
                  </p>
              </div>

                  {/* Status */}
                  <div className="mt-3">

                    <label
                      className="
                        mr-2

                        text-black
                        dark:text-white
                      "
                    >

                      Status:

                    </label>

                    <select
                      aria-label="Update Question Status"
                      value={question.status}

                      onChange={(e) =>

                        handleStatusChange(

                          question,

                          e.target.value

                        )

                      }

                      className={`
                        p-2
                        rounded-lg
                        outline-none
                        cursor-pointer

                        border

                        ${
                          question.status === "Solved"

                            ? `
                              bg-green-600
                              text-white
                              border-green-500
                            `

                          : question.status === "Revision"

                            ? `
                              bg-yellow-700
                              text-white
                              border-yellow-400
                            `

                            : `
                              bg-gray-300
                              dark:bg-gray-700

                              text-black
                              dark:text-white

                              border-gray-400
                              dark:border-gray-600
                            `
                        }
                      `}
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Solved">
                        Solved
                      </option>

                      <option value="Revision">
                        Revision
                      </option>

                    </select>

                  </div>

                  {/* Notes */}
                    <div className="mt-2">

                      <p
                        className={`
                          text-gray-700
                          dark:text-gray-300
                          whitespace-pre-wrap
                          leading-7

                          ${
                            expandedQuestion === question._id
                              ? ""
                              : "line-clamp-3"
                          }
                        `}
                      >

                        {question.notes}

                      </p>

                      {
                        question.notes.length > 150 && (

                          <button
                          aria-label="Expand Question Notes"

                            onClick={() =>

                              setExpandedQuestion(

                                expandedQuestion ===
                                question._id

                                  ? null

                                  : question._id
                              )
                            }

                            className="
                              mt-2
                              text-blue-300
                              hover:text-blue-200
                              text-sm
                              cursor-pointer
                            "
                          >

                            {
                              expandedQuestion ===
                              question._id

                                ? "Read Less"

                                : "Read More"
                            }

                          </button>

                        )
                      }

                    </div>
                
                {/* Date for Questions */}
                 <div
                      className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-lg
                        text-sm
                        bg-white
                        dark:bg-gray-700

                        text-gray-700
                        dark:text-gray-300

                        border
                        border-gray-300
                        dark:border-gray-600
                      "
                    >

                      <span className="text-blue-300">
                        Added:
                      </span>

                      <span>
                        {new Date(
                          question.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    {/* Updated Date */}
                      <div
                        className="
                          mt-2
                          inline-flex
                          items-center
                          gap-2

                          bg-gray-200
                          dark:bg-gray-700

                          px-3
                          py-2
                          rounded-lg

                          text-sm

                          text-gray-700
                          dark:text-gray-300

                          border
                          border-gray-300
                          dark:border-gray-600

                          transition
                          duration-300
                        "
                      >

                        <span className="text-green-500">
                          Updated:
                        </span>

                        <span>

                          {
                            formatDistanceToNow(

                              new Date(
                                question.updatedAt
                              ),

                              {
                                addSuffix: true,
                              }

                            )
                          }

                        </span>

                      </div>

                <div className="flex flex-wrap gap-3">
                  
                  {/* Favorite Button */}
                    <button
                        aria-label="Mark as Favorite"
                        onClick={() =>
                          handleFavorite(question)
                        }
                      

                      className="
                        mt-4
                        bg-yellow-700
                        hover:bg-yellow-800
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        cursor-pointer
                      "
                    >

                      {
                        question.favorite

                          ? "⭐ Favorited"

                          : "☆ Favorite"
                      }

                    </button>

                    {/* Copy Notes Button */}
                    <button
                      aria-label="Copy Notes"

                      onClick={() => {

                        navigator.clipboard.writeText(
                          question.notes
                        );

                        toast.success(
                          "Notes Copied 😄"
                        );
                      }}

                      className="
                        mt-4
                        bg-blue-600
                        hover:bg-blue-700
                        px-4
                        py-2
                        rounded-lg
                        cursor-pointer
                      "
                    >

                      📋 Copy

                    </button>

                  {/* Edit Button */}
                  <button
                  aria-label="Edit Question"
                    onClick={() =>
                      handleEdit(question)
                    }
                    className="
                      mt-4
                      mr-3
                      bg-yellow-800
                      hover:bg-yellow-900
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      cursor-pointer
                    "
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                    <button
                      aria-label="Delete Question"
                      onClick={() =>
                        handleDelete(question._id)
                      }
                      className="
                        mt-4
                        bg-red-600
                        hover:bg-red-700
                        px-4
                        py-2
                        rounded-lg
                        cursor-pointer
                      "
                    >
                      Delete
                    </button>

                    {
                      question.link && (

                        <a
                          href={question.link}
                          target="_blank"
                          rel="noreferrer"

                          className="
                            mt-4
                            bg-blue-600
                            hover:bg-blue-700
                            px-4
                            py-2
                            rounded-lg
                            cursor-pointer
                            inline-block
                          "
                        >

                          🔗 Open Problem

                        </a>

                      )
                    }
                  </div>
                </div>

              )))}

            </div>

          </div>
            
          </>
        )}

        {/* Questions Section */}
        {activeSection === "questions" && (

          <div>

            <h1
              className="
                text-3xl
                font-bold
                mb-6
              "
            >
              Questions
            </h1>

            <div className="grid gap-4">

              {fetching ? (
                <div className="text-center py-10 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-2xl animate-pulse">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    🔄 Loading questions from server...
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Please wait, initial load may take a moment if server is waking up
                  </p>
                </div>
              ) : filteredQuestions.length === 0 ? (

                <div
                  className="
                    bg-gray-200
                    dark:bg-gray-800
                    p-10
                    rounded-xl
                    text-center
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-bold
                      mb-2
                    "
                  >
                    No Questions Found 😄
                  </h2>

                  <p className="text-gray-400">
                    Add a new question
                    to get started 🚀
                  </p>

                </div>

              ) : (

                filteredQuestions.map((question) => (

                  <div
                    key={question._id}
                    className="
                      bg-gray-200
                      dark:bg-gray-800
                      p-4
                      rounded-xl
                    "
                  >

                    <h2 className="text-xl font-semibold">
                      {question.title}
                    </h2>

                    <p className="text-gray-400">
                      {question.topic}
                    </p>

                  </div>

                ))

              )}

            </div>

          </div>

        )}

        {/* Stats Section */}
        {activeSection === "stats" && (

          <div>

            <h1
              className="
                text-3xl
                font-bold
                mb-6
              "
            >
              Stats
            </h1>

            <StatsCards
              questions={questions}
            />

            <ProgressChart
            questions={questions}
          />

          <DifficultyChart
            questions={questions}
          />
          </div>

        )}


        {/* Settings Section */}
        {activeSection === "settings" && (

          <div>

            <h1
              className="
                text-3xl
                font-bold
                mb-6
              "
            >
              Settings
            </h1>

            <div
              className="
                bg-gray-200
                dark:bg-gray-800
                p-6
                rounded-xl
              "
            >

              <p className="text-gray-700 dark:text-gray-300">
                Settings coming soon 😄
              </p>

            </div>

          </div>

        )}

        </div>
        

      </div>

    </div>

  );
}

export default Dashboard;