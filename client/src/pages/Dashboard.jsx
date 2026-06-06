import {useEffect, useState, useMemo} from "react";
import {useNavigate,} from "react-router-dom";
import {Menu,} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import FilterBar from "../components/FilterBar";
import ProgressChart from "../components/ProgressChart";
import DifficultyChart from "../components/DifficultyChart";
import QuestionForm from "../components/QuestionForm";
import QuestionList from "../components/QuestionList";
import ContributionCalendar from "../components/ContributionCalendar";

import {addQuestion, getQuestions, deleteQuestion, updateQuestion, scrapeDescription} from "../services/questionService";
import { getProfile } from "../services/userService";

function Dashboard() {

  const navigate = useNavigate();

  // Sidebar state
  const [open, setOpen] = useState(false);

  // Preferred Platform link helper
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userPreferredPlatform = savedUser.preferredPlatform || "LeetCode";

  const getPlatformUrl = (platform) => {
    switch (platform) {
      case "LeetCode":
        return "https://leetcode.com";
      case "GeeksforGeeks":
        return "https://www.geeksforgeeks.org";
      case "Codeforces":
        return "https://codeforces.com";
      default:
        return "https://leetcode.com";
    }
  };
  const preferredPlatformLink = getPlatformUrl(userPreferredPlatform);

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
    topic: savedUser.preferredPlatform || "LeetCode",
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
      const [questionsData, profileData] = await Promise.all([
        getQuestions(),
        getProfile(),
      ]);

      console.log(
        "Dashboard Questions:",
        questionsData
      );

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
        w-full
        bg-white
        dark:bg-gray-950
        text-black
        dark:text-white
        transition
        duration-300
        flex
      "
    >

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
      <div className="flex-1 md:ml-[260px] min-w-0">

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
              flex
              justify-between
              items-center
              w-full
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

            {/* Quick Practice Shortcut */}
            {preferredPlatformLink && (
              <a
                href={preferredPlatformLink}
                target="_blank"
                rel="noreferrer"
                className="
                  px-4
                  py-2
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  rounded-lg
                  transition
                  text-sm
                  flex
                  items-center
                  gap-2
                  cursor-pointer
                  shadow-md
                "
              >
                <span>Practice on {userPreferredPlatform} 🚀</span>
              </a>
            )}

          </div>

          {location.pathname ===
            "/dashboard" && ( 
        <>

          <StatsCards questions={questions} />

          <div className="mb-8">
            <ContributionCalendar questions={questions} />
          </div>

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
          {searchTerm === "" && (
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
          )}

          {/* Questions */}
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