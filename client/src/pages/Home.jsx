import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ExternalLink, Trash2, Plus, Loader2, Check, Star, CheckCircle, BookOpen, Award, TrendingUp, Users } from "lucide-react";
import emailjs from "@emailjs/browser";
import ThemeToggle from "../components/ThemeToggle";

function Home() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    });

  const [openFaq, setOpenFaq] = useState(null);

  // Custom Alert state
  const [alertMessage, setAlertMessage] = useState(null);
  const showAlert = (text, type = "error", onClose = null) => {
    setAlertMessage({ text, type, onClose });
  };

  // Playground state
  const [playgroundLink, setPlaygroundLink] = useState("");
  const [playgroundTitle, setPlaygroundTitle] = useState("");
  const [playgroundPlatform, setPlaygroundPlatform] = useState("LeetCode");
  const [playgroundDifficulty, setPlaygroundDifficulty] = useState("Medium");
  const [playgroundScraping, setPlaygroundScraping] = useState(false);
  const [playgroundList, setPlaygroundList] = useState([
    {
      id: 1,
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "Easy",
      link: "https://leetcode.com/problems/two-sum/",
      solved: true,
    },
    {
      id: 2,
      title: "Reverse a Linked List",
      platform: "GeeksforGeeks",
      difficulty: "Medium",
      link: "https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1",
      solved: false,
    },
    {
      id: 3,
      title: "Watermelon",
      platform: "Codeforces",
      difficulty: "Easy",
      link: "https://codeforces.com/problemset/problem/4/A",
      solved: false,
    }
  ]);

  // Selected Sheet state for modal
  const [selectedSheet, setSelectedSheet] = useState(null);

  const sheets = [
    {
      id: "striver",
      name: "Striver's SDE Sheet",
      curator: "Raj Vikramaditya (Striver)",
      questionsCount: 180,
      solvedCount: 65,
      description: "Carefully curated list of most frequently asked coding interview questions. Highly recommended for top tier companies.",
      difficulty: { easy: 45, medium: 95, hard: 40 },
      topics: ["Arrays", "Linked List", "Greedy", "Recursion", "Binary Trees", "Dynamic Programming", "Graphs"]
    },
    {
      id: "neetcode",
      name: "NeetCode 150",
      curator: "Navdeep Sandhu (NeetCode)",
      questionsCount: 150,
      solvedCount: 110,
      description: "A comprehensive roadmap to master data structures and algorithms, organized by difficulty and topics.",
      difficulty: { easy: 30, medium: 85, hard: 35 },
      topics: ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Trees", "Binary Search", "Graphs", "DP"]
    },
    {
      id: "love-babbar",
      name: "Love Babbar 450",
      curator: "Love Babbar",
      questionsCount: 450,
      solvedCount: 220,
      description: "A complete preparation guide containing 450 questions covering every DSA pattern from basics to advanced.",
      difficulty: { easy: 120, medium: 250, hard: 80 },
      topics: ["Arrays", "Matrix", "Strings", "Searching & Sorting", "Binary Trees", "Heaps", "DP", "Trie"]
    },
    {
      id: "blind-75",
      name: "Blind 75",
      curator: "Yangshun Tay (Meta)",
      questionsCount: 75,
      solvedCount: 55,
      description: "The classic collection of 75 essential LeetCode questions for coding interview preparation.",
      difficulty: { easy: 20, medium: 45, hard: 10 },
      topics: ["Array", "Binary", "DP", "Graph", "Interval", "Linked List", "Matrix", "String", "Tree"]
    }
  ];

  const faqs = [
    {
      q: "How does the automatic platform scraper work? ☁️",
      a: "When adding a new question, simply paste the LeetCode or GeeksforGeeks problem link in the input field. PrepTrack will fetch the title, difficulty level, and primary description details automatically to save you typing! ⚡"
    },
    {
      q: "What is a DSA streak and how is it calculated? 🔥",
      a: "Your streak represents the number of consecutive days you have solved at least one question. PrepTrack displays a GitHub-like contribution calendar so you can visualize your daily consistency, build coding habits, and stay motivated! 📅"
    },
    {
      q: "Can I access my dashboard offline? 📱",
      a: "Yes! PrepTrack is built as a Progressive Web App (PWA). Once you visit the website, it caches pages so you can open the app and view your dashboard, calendar, and past questions even when you are offline or have a poor connection. 📶"
    },
    {
      q: "How secure is my data, and can I delete it? 🔐",
      a: "Your security is our priority. All account data is securely stored. If you ever wish to clear your logs, you can reset all data or permanently delete your account securely using email-based OTP and password verification from the Settings dashboard. 🛡️"
    }
  ];

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const menuRef = useRef(null);

    const sendEmail = async (e) => {
    e.preventDefault();

    try {
        await emailjs.send(
        "service_s63d1qt",
        "template_lyy27ns",
        {
            to_email: "npathak.sp@gmail.com",
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            time: new Date().toLocaleString(),
        },
        "t0hko6qmXDfjVglF2"
        );

        showAlert("Message sent successfully 🚀", "success");

        setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        });

    } catch (error) {
        console.error(error);
        showAlert("Failed to send message", "error");
    }
    };

    // Auto-detect coding platform from entered link
    useEffect(() => {
      if (!playgroundLink) return;
      const lower = playgroundLink.toLowerCase();
      if (lower.includes("leetcode")) {
        setPlaygroundPlatform("LeetCode");
      } else if (lower.includes("geeksforgeeks")) {
        setPlaygroundPlatform("GeeksforGeeks");
      } else if (lower.includes("codeforces")) {
        setPlaygroundPlatform("Codeforces");
      } else if (lower.includes("codechef")) {
        setPlaygroundPlatform("CodeChef");
      }
    }, [playgroundLink]);

    // Mock platform scraper simulation
    const handleScrape = () => {
      if (!playgroundLink) {
        showAlert("Please enter a link to scrape! 🔗", "error");
        return;
      }
      setPlaygroundScraping(true);
      setTimeout(() => {
        setPlaygroundScraping(false);
        const lower = playgroundLink.toLowerCase();
        let detectedTitle = "Binary Tree Maximum Path Sum";
        let detectedDifficulty = "Hard";
        let detectedPlatform = "LeetCode";

        if (lower.includes("leetcode")) {
          detectedPlatform = "LeetCode";
          if (lower.includes("two-sum")) {
            detectedTitle = "Two Sum";
            detectedDifficulty = "Easy";
          } else if (lower.includes("reverse-linked-list")) {
            detectedTitle = "Reverse Linked List";
            detectedDifficulty = "Easy";
          } else if (lower.includes("longest-substring")) {
            detectedTitle = "Longest Substring Without Repeating Characters";
            detectedDifficulty = "Medium";
          } else if (lower.includes("median-of-two")) {
            detectedTitle = "Median of Two Sorted Arrays";
            detectedDifficulty = "Hard";
          } else {
            detectedTitle = "Product of Array Except Self";
            detectedDifficulty = "Medium";
          }
        } else if (lower.includes("geeksforgeeks")) {
          detectedPlatform = "GeeksforGeeks";
          if (lower.includes("subarray-with-given-sum")) {
            detectedTitle = "Subarray with given sum";
            detectedDifficulty = "Medium";
          } else if (lower.includes("kadane")) {
            detectedTitle = "Kadane's Algorithm";
            detectedDifficulty = "Medium";
          } else {
            detectedTitle = "Missing number in array";
            detectedDifficulty = "Easy";
          }
        } else if (lower.includes("codeforces")) {
          detectedPlatform = "Codeforces";
          if (lower.includes("watermelon") || lower.includes("4/a")) {
            detectedTitle = "Watermelon";
            detectedDifficulty = "Easy";
          } else {
            detectedTitle = "Way Too Long Words";
            detectedDifficulty = "Easy";
          }
        } else if (lower.includes("codechef")) {
          detectedPlatform = "CodeChef";
          detectedTitle = "ATM Machine";
          detectedDifficulty = "Easy";
        } else {
          detectedPlatform = "Other";
          detectedTitle = "Custom DSA Problem";
          detectedDifficulty = "Medium";
        }

        setPlaygroundTitle(detectedTitle);
        setPlaygroundPlatform(detectedPlatform);
        setPlaygroundDifficulty(detectedDifficulty);
        showAlert("Mock scraper extracted details successfully! ⚡ Details populated below.", "success");
      }, 1200);
    };

    // Add problem to playground local list
    const handleAddToPlayground = (e) => {
      e.preventDefault();
      if (!playgroundTitle) {
        showAlert("Please enter or scrape a question title!", "error");
        return;
      }
      const newQuestion = {
        id: Date.now(),
        title: playgroundTitle,
        platform: playgroundPlatform,
        difficulty: playgroundDifficulty,
        link: playgroundLink || "#",
        solved: false,
      };
      setPlaygroundList([newQuestion, ...playgroundList]);
      setPlaygroundLink("");
      setPlaygroundTitle("");
      setPlaygroundPlatform("LeetCode");
      setPlaygroundDifficulty("Medium");
      showAlert("Question added to your live demo list! 🚀", "success");
    };

    // Toggle problem solved status in playground
    const toggleSolvedPlayground = (id) => {
      setPlaygroundList(
        playgroundList.map((item) =>
          item.id === id ? { ...item, solved: !item.solved } : item
        )
      );
    };

    // Delete problem from playground
    const handleDeletePlayground = (id) => {
      setPlaygroundList(playgroundList.filter((item) => item.id !== id));
      showAlert("Question removed from playground.", "success");
    };

    useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  return (
    <div id="home" className=" bg-white dark:bg-black text-black dark:text-white ">

{/* Navbar */}
        <nav
        className="
            sticky
            top-0
            z-50

            bg-white/90
            dark:bg-black/90

            backdrop-blur-lg

            border-b
            border-gray-200
            dark:border-gray-800
        "
        >

        <div
            className="
                w-full

                px-4

                h-16

                flex
                items-center
                justify-between
            "
            >

            {/* Logo */}

            <Link to="/">

            <div
                className="
                flex
                items-center
                gap-2
                "
            >

                <span
                className="
                    text-2xl
                "
                >
                🚀
                </span>

                <h1
                className="
                    text-lg
                    sm:text-xl
                    md:text-2xl

                    font-bold

                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600

                    bg-clip-text
                    text-transparent
                "
                >
                PrepTrack
                </h1>

            </div>

            </Link>

            {/* Desktop Menu */}

            <div
            className="
                hidden
                lg:flex

                items-center

                gap-6
            "
            >
            <a href="#home" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                Home
            </a>
            
            <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                About
            </a>            

            <a href="#playground" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                Playground
            </a>

            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                Features
            </a>

            <a href="#sheets" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                Cheat Sheets
            </a>

            <a href="#how" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                How It Works
            </a>

            <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                Testimonials
            </a>

            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-sm">
                Contact
            </a>

            </div>

            {/* Right Side */}

            <div
            className="
                flex
                items-center
                gap-3
                shrink-0
            "
            >

            {/* Desktop Buttons */}

            <div
                className="
                hidden
                md:flex

                gap-3
                items-center
                "
            >
                <ThemeToggle className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white transition duration-300 cursor-pointer" />

                <Link to="/login">

                <button
                    className="
                    px-4
                    py-2

                    rounded-xl

                    border
                    "
                >
                    Login
                </button>

                </Link>

                <Link to="/register">

                <button
                    className="
                    px-4
                    py-2

                    rounded-xl

                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600

                    text-white
                    "
                >
                    Sign Up
                </button>

                </Link>

            </div>


            {/* Mobile Theme Toggle & Menu */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 transition duration-300 cursor-pointer" />
              <button
                  onClick={() =>
                  setMenuOpen(
                      !menuOpen
                  )
                  }

                  className="
                  p-1
                  "
              >

                  {
                  menuOpen

                      ? <X size={24} />

                      : <Menu size={24} />
                  }

              </button>
            </div>

            </div>

        </div>

        {/* Mobile Dropdown */}

        {
            menuOpen && (

                <div
                    ref={menuRef}
                    className="
                        md:hidden
                        border-t
                        bg-white
                        dark:bg-black
                    "
                >

                <div
                className="
                    flex
                    flex-col

                    gap-4

                    p-4
                "
                >

                <a href="#home" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    Home
                </a>

                <a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    About
                </a>

                <a href="#playground" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    Playground
                </a>

                <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    Features
                </a>

                <a href="#sheets" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    Cheat Sheets
                </a>

                <a href="#how" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    How It Works
                </a>

                <a href="#testimonials" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    Testimonials
                </a>

                <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    Contact
                </a>

                <Link to="/login" onClick={() => setMenuOpen(false)}>

                    <button
                    className="
                        w-full

                        py-3

                        border

                        rounded-xl
                    "
                    >
                    Login
                    </button>

                </Link>

                <Link to="/register" onClick={() => setMenuOpen(false)}>

                    <button
                    className="
                        w-full

                        py-3

                        rounded-xl

                        bg-gradient-to-r
                        from-blue-600
                        to-purple-600

                        text-white
                    "
                    >
                    Sign Up
                    </button>

                </Link>

                </div>

            </div>

            )
        }

        </nav>

{/* Hero */}
        <section
        className="
            bg-gradient-to-r
            from-blue-600
            via-purple-600
            to-indigo-700

            dark:from-slate-900
            dark:via-gray-900
            dark:to-black

            text-white

            overflow-hidden
        "
        >

        <div
            className="
            max-w-7xl
            mx-auto

            px-6
            sm:px-8
            lg:px-12

            py-20
            md:py-28

            flex
            flex-col
            lg:flex-row

            items-center
            justify-between

            gap-16
            "
        >

            {/* LEFT SIDE */}
            <div
            className="
                flex-1

                text-center
                lg:text-left
            "
            >

            {/* Badge */}
            <div
                className="
                inline-block

                px-4
                py-2

                rounded-full

                bg-white/20

                backdrop-blur-md

                text-sm

                mb-8
                "
            >
                🚀 Built For DSA Learners
            </div>

            {/* Heading */}
            <h1
                className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl

                font-bold

                leading-tight
                "
            >
                Track Your DSA
                <br />
                Journey Like A Pro 🚀
            </h1>

            {/* Description */}
            <p
                className="
                mt-6

                text-base
                sm:text-lg
                md:text-xl

                text-white/90

                max-w-2xl

                mx-auto
                lg:mx-0
                "
            >
                Organize coding questions,
                build daily streaks,
                analyze progress,
                and stay consistent
                throughout your placement journey.
            </p>

            {/* Buttons */}
            <div
                className="
                mt-10

                flex
                flex-col
                sm:flex-row

                gap-4

                justify-center
                lg:justify-start
                "
            >
    {/* Register */}
            <Link to="/register">
                <button
                    className="
                    px-8
                    py-4

                    rounded-2xl

                    bg-white
                    text-blue-600

                    font-semibold

                    hover:scale-105

                    transition
                    duration-300
                    "
                >
                    Start Tracking Free
                </button>
            </Link>

    {/* Login */}
            <Link to="/login">
            <button
                className="
                px-8
                py-4

                rounded-2xl

                border
                border-white

                hover:bg-white/10

                transition
                duration-300
                "
            >
                Login
            </button>
            </Link>

            </div>

            </div>

            {/* RIGHT SIDE */}
            <div
            className="
                flex-1

                w-full
                max-w-lg
            "
            >

            <div
                className="
                bg-white/10

                backdrop-blur-xl

                border
                border-white/20

                rounded-3xl

                p-6

                shadow-2xl
                "
            >

                <h3
                className="
                    text-xl
                    font-bold

                    mb-6
                "
                >
                📊 Dashboard Preview
                </h3>

                <div
                className="
                    grid
                    grid-cols-2

                    gap-4
                "
                >

                <div
                    className="
                    bg-white/10

                    rounded-xl

                    p-4
                    "
                >
                    <p
                    className="
                        text-sm
                        text-white/70
                    "
                    >
                    Total Questions
                    </p>

                    <h4
                    className="
                        text-2xl
                        font-bold
                    "
                    >
                    120
                    </h4>
                </div>

                <div
                    className="
                    bg-white/10

                    rounded-xl

                    p-4
                    "
                >
                    <p
                    className="
                        text-sm
                        text-white/70
                    "
                    >
                    Solved
                    </p>

                    <h4
                    className="
                        text-2xl
                        font-bold
                    "
                    >
                    90
                    </h4>
                </div>

                <div
                    className="
                    bg-white/10

                    rounded-xl

                    p-4
                    "
                >
                    <p
                    className="
                        text-sm
                        text-white/70
                    "
                    >
                    Pending
                    </p>

                    <h4
                    className="
                        text-2xl
                        font-bold
                    "
                    >
                    20
                    </h4>
                </div>

                <div
                    className="
                    bg-white/10

                    rounded-xl

                    p-4
                    "
                >
                    <p
                    className="
                        text-sm
                        text-white/70
                    "
                    >
                    Revision
                    </p>

                    <h4
                    className="
                        text-2xl
                        font-bold
                    "
                    >
                    10
                    </h4>
                </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div
                    className="
                      bg-orange-500/20
                      border
                      border-orange-400/30
                      rounded-xl
                      p-4
                    "
                  >
                    <p
                      className="
                      text-orange-200
                      "
                    >
                      🔥 Current Streak
                    </p>

                    <h3
                      className="
                      text-3xl
                      font-bold
                      "
                    >
                      30 Days
                    </h3>
                  </div>

                  <div
                    className="
                      bg-green-500/20
                      border
                      border-green-400/30
                      rounded-xl
                      p-4
                      flex
                      flex-col
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                        text-green-200
                        "
                      >
                        🎯 Today's Target
                      </p>
                      <h3 className="text-2xl font-bold">3 / 4 Solved</h3>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

{/* Stats */}
        <section
        className="
            py-20
            px-6

            bg-white
            dark:bg-gray-950
        "
        >

        <div
            className="
            max-w-6xl
            mx-auto

            grid
            grid-cols-2
            md:grid-cols-4

            gap-6
            "
        >

            <div
            className="
                p-6

                rounded-3xl

                bg-blue-50
                dark:bg-gray-800

                text-center
            "
            >
            <h3 className="text-4xl font-bold">
                500+
            </h3>

            <p className="mt-2">
                Questions Tracked
            </p>
            </div>

            <div
            className="
                p-6

                rounded-3xl

                bg-green-50
                dark:bg-gray-800

                text-center
            "
            >
            <h3 className="text-4xl font-bold">
                50+
            </h3>

            <p className="mt-2">
                Active Learners
            </p>
            </div>

            <div
            className="
                p-6

                rounded-3xl

                bg-yellow-50
                dark:bg-gray-800

                text-center
            "
            >
            <h3 className="text-4xl font-bold">
                95%
            </h3>

            <p className="mt-2">
                Consistency Rate
            </p>
            </div>

            <div
            className="
                p-6

                rounded-3xl

                bg-purple-50
                dark:bg-gray-800

                text-center
            "
            >
            <h3 className="text-4xl font-bold">
                100%
            </h3>

            <p className="mt-2">
                Free To Use
            </p>
            </div>

        </div>

        </section>

{/* Interactive Playground Section */}
        <section
        id="playground"
        className="
            py-24
            px-6
            bg-gray-55
            dark:bg-gray-900/60
            border-t
            border-b
            border-gray-200
            dark:border-gray-800
        "
        >
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 select-none">
                🎮 Try It Live
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight font-sans">
                Interactive Playground Demo
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base">
                No account required! Test our automatic coding platform link scraper and track mock DSA questions in local memory.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Block */}
              <div className="lg:col-span-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                  <span>⚡</span> Scraper & Quick Add
                </h3>
                
                <form onSubmit={handleAddToPlayground} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-750 dark:text-gray-300 mb-2">
                      Question Link 🔗
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={playgroundLink}
                        onChange={(e) => setPlaygroundLink(e.target.value)}
                        placeholder="e.g. https://leetcode.com/problems/two-sum/"
                        className="flex-1 p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200"
                      />
                      <button
                        type="button"
                        onClick={handleScrape}
                        disabled={playgroundScraping}
                        className="px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        {playgroundScraping ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          "Scrape"
                        )}
                      </button>
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">
                      Supports auto-detection for LeetCode, GFG, and Codeforces.
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-750 dark:text-gray-300 mb-2">
                      Question Title 📝
                    </label>
                    <input
                      type="text"
                      value={playgroundTitle}
                      onChange={(e) => setPlaygroundTitle(e.target.value)}
                      placeholder="e.g. Two Sum"
                      required
                      className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-750 dark:text-gray-300 mb-2">
                        Platform 🎯
                      </label>
                      <select
                        value={playgroundPlatform}
                        onChange={(e) => setPlaygroundPlatform(e.target.value)}
                        className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200"
                      >
                        <option value="LeetCode">LeetCode</option>
                        <option value="GeeksforGeeks">GeeksforGeeks</option>
                        <option value="Codeforces">Codeforces</option>
                        <option value="CodeChef">CodeChef</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-750 dark:text-gray-300 mb-2">
                        Difficulty 🔥
                      </label>
                      <select
                        value={playgroundDifficulty}
                        onChange={(e) => setPlaygroundDifficulty(e.target.value)}
                        className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition duration-300 hover:scale-[1.01] cursor-pointer shadow-lg mt-6"
                  >
                    <Plus size={20} />
                    Add Question to Demo List
                  </button>
                </form>
              </div>

              {/* List Block */}
              <div className="lg:col-span-7 bg-white dark:bg-gray-805 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                      <span>📋</span> Live Demo List
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-405 mt-1">
                      Toggle checkboxes or click problem names to open links.
                    </p>
                  </div>
                  
                  {/* Progress Stats */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-full select-none">
                      🎯 {playgroundList.filter(q => q.solved).length} / {playgroundList.length} Solved
                    </span>
                    <div className="w-24 bg-gray-100 dark:bg-gray-900 h-2.5 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${playgroundList.length ? (playgroundList.filter(q => q.solved).length / playgroundList.length) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {playgroundList.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <p className="text-lg">No questions in your demo list. 🍃</p>
                      <p className="text-xs mt-1 text-gray-405 dark:text-gray-500">
                        Add one using the form on the left!
                      </p>
                    </div>
                  ) : (
                    playgroundList.map((item) => {
                      // Platform Badge Color
                      let platformBadge = "bg-gray-100 text-gray-750 dark:bg-gray-900 dark:text-gray-305";
                      if (item.platform === "LeetCode") platformBadge = "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40";
                      else if (item.platform === "GeeksforGeeks") platformBadge = "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-900/40";
                      else if (item.platform === "Codeforces") platformBadge = "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-305 border border-blue-200 dark:border-blue-900/40";
                      else if (item.platform === "CodeChef") platformBadge = "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/40";

                      // Difficulty Badge Color
                      let diffBadge = "bg-gray-100 text-gray-750 dark:bg-gray-900 dark:text-gray-305";
                      if (item.difficulty === "Easy") diffBadge = "bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/20";
                      else if (item.difficulty === "Medium") diffBadge = "bg-yellow-100 text-yellow-850 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/20";
                      else if (item.difficulty === "Hard") diffBadge = "bg-rose-100 text-rose-850 dark:bg-rose-950/40 dark:text-rose-455 border border-rose-200 dark:border-rose-900/20";

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-gray-850/30 transition duration-200"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Checkbox */}
                            <label className="relative flex items-center cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.solved}
                                onChange={() => toggleSolvedPlayground(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transition-all peer-checked:bg-green-500 peer-checked:border-green-500">
                                {item.solved && <Check size={14} className="text-white font-bold" />}
                              </div>
                            </label>

                            {/* Title & Badges */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`text-sm sm:text-base font-bold truncate hover:underline hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 text-black dark:text-white ${
                                    item.solved ? "line-through opacity-55 text-gray-505 dark:text-gray-400" : ""
                                  }`}
                                >
                                  {item.title}
                                  <ExternalLink size={12} className="opacity-50 shrink-0" />
                                </a>
                              </div>
                              <div className="flex gap-2 mt-1.5 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full select-none ${platformBadge}`}>
                                  {item.platform}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full select-none ${diffBadge}`}>
                                  {item.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDeletePlayground(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer shrink-0"
                            title="Remove problem"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Playground Save CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-sm text-gray-550 dark:text-gray-400 mb-4">
                    Ready to track your coding goals permanently and unlock features like streaks & graphs? 📈
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link to="/register">
                      <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition hover:scale-105 cursor-pointer">
                        Sign Up Now 🚀
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white font-semibold rounded-xl text-xs sm:text-sm transition hover:scale-105 cursor-pointer">
                        Login
                      </button>
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

{/* Features */}
        <section
        id="features"
        className="
            py-24
            px-6

            bg-gray-50
            dark:bg-gray-900
        "
        >

        <div
            className="
            max-w-7xl
            mx-auto
            "
        >

            <div className="text-center mb-16">

            <h2
                className="
                text-4xl
                md:text-5xl

                font-bold

                mb-4
                "
            >
                Everything You Need
            </h2>

            <p
                className="
                text-gray-600
                dark:text-gray-400

                max-w-2xl
                mx-auto
                "
            >
                Designed specifically for DSA learners,
                coding interview preparation,
                and placement success.
            </p>

            </div>

            <div
            className="
                grid
                md:grid-cols-2
                lg:grid-cols-3

                gap-8
            "
            >

            {/* Card 1 */}
            <div
                className="
                bg-white
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg

                hover:-translate-y-2

                transition
                duration-300
                "
            >

                <div className="text-5xl mb-5">
                📚
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Question Tracking
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Organize coding problems by topic,
                difficulty, and status.
                </p>

            </div>

            {/* Card 2 */}
            <div
                className="
                bg-white
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg

                hover:-translate-y-2

                transition
                duration-300
                "
            >

                <div className="text-5xl mb-5">
                🔥
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Daily Targets & Streaks
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Set personalized daily targets and track streaks with interactive completion meters.
                </p>

            </div>

            {/* Card 3 */}
            <div
                className="
                bg-white
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg

                hover:-translate-y-2

                transition
                duration-300
                "
            >

                <div className="text-5xl mb-5">
                📊
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Smart Analytics
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Monitor solved questions,
                pending tasks, and overall progress.
                </p>

            </div>

            {/* Card 4 */}
            <div
                className="
                bg-white
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg

                hover:-translate-y-2

                transition
                duration-300
                "
            >

                <div className="text-5xl mb-5">
                ⭐
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Favorites
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Save important coding questions
                for future revision.
                </p>

            </div>

            {/* Card 5 */}
            <div
                className="
                bg-white
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg

                hover:-translate-y-2

                transition
                duration-300
                "
            >

                <div className="text-5xl mb-5">
                🎯
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Quick Platform Launch
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Open and practice on your preferred platform directly from the sticky header.
                </p>

            </div>

            {/* Card 6 */}
            <div
                className="
                bg-white
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg

                hover:-translate-y-2

                transition
                duration-300
                "
            >

                <div className="text-5xl mb-5">
                ☁️
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Automatic Scraper
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Paste links from LeetCode or GFG to auto-populate question titles and notes instantly.
                </p>

            </div>

            </div>

        </div>

        </section>

{/* DSA Cheat Sheets Section */}
        <section
        id="sheets"
        className="
            py-24
            px-6
            bg-white
            dark:bg-gray-950
            border-b
            border-gray-200
            dark:border-gray-800
        "
        >
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-4 select-none">
                🏆 Study Roadmaps
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight font-sans">
                DSA Cheat Sheets
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base">
                Track industry-standard placement sheets curated by top educators and engineers. Check off items as you go!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sheets.map((sheet) => {
                const percentage = Math.round((sheet.solvedCount / sheet.questionsCount) * 100);
                return (
                  <div
                    key={sheet.id}
                    className="flex flex-col bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md hover:-translate-y-2 hover:shadow-xl hover:border-purple-500/30 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center text-2xl font-bold">
                        {sheet.id === "striver" ? "🚀" : sheet.id === "neetcode" ? "⚡" : sheet.id === "love-babbar" ? "🔥" : "🎯"}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full border border-gray-150 dark:border-gray-700">
                        {sheet.questionsCount} Qs
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                      {sheet.name}
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mb-3 block font-semibold">
                      Curated by {sheet.curator}
                    </span>

                    <p className="text-sm text-gray-550 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                      {sheet.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
                        <span>Interactive Demo Progress</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-850 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-650 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 pt-1 font-semibold">
                        <span>Solved: {sheet.solvedCount}</span>
                        <span>Total: {sheet.questionsCount}</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => setSelectedSheet(sheet)}
                      className="w-full py-3 bg-white dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 font-bold rounded-xl text-sm transition duration-205 hover:scale-[1.01] cursor-pointer shadow-sm"
                    >
                      Track Sheet Details →
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

{/* About */}
        <section
        id="about"
        className="
            py-24
            px-6
            bg-white
            dark:bg-gray-950
        "
        >
        <div className="max-w-7xl mx-auto">

            <div className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                About PrepTrack
            </h2>

            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                PrepTrack is a modern DSA preparation tracker designed
                to help students stay consistent, organize coding
                questions, monitor progress, and build strong problem-solving habits.
            </p>

            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
                <h3 className="text-3xl font-bold mb-6">
                Why PrepTrack?
                </h3>

                <div className="space-y-5">

                <div>
                    <h4 className="font-semibold text-xl">
                    📚 Smart Question Management
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                    Track coding questions by topic, difficulty and status.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-xl">
                    🔥 Daily Consistency
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                    Maintain streaks and stay motivated every day.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-xl">
                    📊 Performance Analytics
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                    Analyze solved, pending and revision questions.
                    </p>
                </div>

                </div>
            </div>

            <div
                className="
                rounded-3xl
                p-8
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                shadow-xl
                "
            >
                <h3 className="text-3xl font-bold mb-4">
                Our Mission 🚀
                </h3>

                <p className="leading-relaxed">
                We believe that consistency beats intensity.
                PrepTrack helps learners build daily coding habits,
                track progress effectively and become placement-ready
                through disciplined practice.
                </p>

                <div className="mt-8">
                <p className="font-semibold">
                    Built by
                </p>

                <p className="text-xl font-bold">
                    Nitish Kumar Pathak
                </p>

                <p className="opacity-90">
                    Software Engineer
                </p>
                </div>

            </div>

            </div>

        </div>
        </section>

{/* How It Works */}
        <section
        id="how"
        className="
            py-24
            px-6

            bg-white
            dark:bg-gray-950
        "
        >

        <div
            className="
            max-w-7xl
            mx-auto
            "
        >

            {/* Heading */}

            <div
            className="
                text-center
                mb-20
            "
            >

            <h2
                className="
                text-4xl
                md:text-5xl

                font-bold

                mb-4
                "
            >
                How It Works
            </h2>

            <p
                className="
                text-gray-600
                dark:text-gray-400

                max-w-2xl
                mx-auto
                "
            >
                Follow a simple workflow and
                keep your DSA preparation
                organized every day.
            </p>

            </div>

            {/* Steps */}

            <div
            className="
                grid
                md:grid-cols-3

                gap-10
            "
            >

            {/* Step 1 */}

            <div
                className="
                relative

                bg-gray-50
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg
                "
            >

                <div
                className="
                    w-14
                    h-14

                    rounded-full

                    bg-blue-600

                    flex
                    items-center
                    justify-center

                    text-white
                    font-bold
                    text-xl

                    mb-6
                "
                >
                1
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Add Questions
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Save coding questions from
                LeetCode, GFG, Codeforces,
                HackerRank and more.
                </p>

            </div>

            {/* Step 2 */}

            <div
                className="
                relative

                bg-gray-50
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg
                "
            >

                <div
                className="
                    w-14
                    h-14

                    rounded-full

                    bg-purple-600

                    flex
                    items-center
                    justify-center

                    text-white
                    font-bold
                    text-xl

                    mb-6
                "
                >
                2
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Track Progress
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Mark questions as Solved,
                Pending, or Revision and
                monitor your growth.
                </p>

            </div>

            {/* Step 3 */}

            <div
                className="
                relative

                bg-gray-50
                dark:bg-gray-800

                p-8

                rounded-3xl

                shadow-lg
                "
            >

                <div
                className="
                    w-14
                    h-14

                    rounded-full

                    bg-green-600

                    flex
                    items-center
                    justify-center

                    text-white
                    font-bold
                    text-xl

                    mb-6
                "
                >
                3
                </div>

                <h3
                className="
                    text-2xl
                    font-bold
                    mb-3
                "
                >
                Build Streaks
                </h3>

                <p
                className="
                    text-gray-600
                    dark:text-gray-400
                "
                >
                Stay consistent daily and
                maintain your coding streak
                for interview success.
                </p>

            </div>

            </div>

        </div>

        </section>

{/* PWA App Installation Guide */}
        <section
        id="pwa-install"
        className="
            py-24
            px-6
            bg-white
            dark:bg-gray-950
            border-t
            border-gray-200
            dark:border-gray-900
        "
        >
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 select-none">
                    📱 Progressive Web App (PWA)
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight font-sans">
                    Install PrepTrack on Your Device
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base">
                    Access your DSA tracking dashboard directly from your home screen with offline support, fast loading, and native app features.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Android */}
                <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl hover:scale-[1.03] transition duration-300 shadow-md">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                        Android (Chrome)
                    </h3>
                    <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">1.</span> Open PrepTrack in Google Chrome.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">2.</span> Look for the install banner at the bottom or click the browser settings menu (three dots).
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">3.</span> Tap <span className="font-semibold text-black dark:text-white">"Install app"</span> or <span className="font-semibold text-black dark:text-white">"Add to Home screen"</span>.
                        </li>
                    </ul>
                </div>

                {/* iOS */}
                <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl hover:scale-[1.03] transition duration-300 shadow-md">
                    <div className="text-4xl mb-4">🍏</div>
                    <h3 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                        iOS / iPhone (Safari)
                    </h3>
                    <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">1.</span> Open PrepTrack in Safari.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">2.</span> Tap the browser's <span className="font-semibold text-black dark:text-white">"Share"</span> button (box with an up arrow 📤) at the bottom.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">3.</span> Scroll down and tap <span className="font-semibold text-black dark:text-white">"Add to Home Screen"</span> ➕.
                        </li>
                    </ul>
                </div>

                {/* Desktop */}
                <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl hover:scale-[1.03] transition duration-300 shadow-md">
                    <div className="text-4xl mb-4">💻</div>
                    <h3 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                        Desktop (Chrome/Edge)
                    </h3>
                    <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">1.</span> Visit PrepTrack on your laptop or desktop browser.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">2.</span> Click the install icon (monitor with down arrow) in the right side of the address bar.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">3.</span> Confirm by clicking <span className="font-semibold text-black dark:text-white">"Install"</span> to launch the desktop app.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </section>

{/* Interactive FAQs Accordion */}
        <section
        id="faqs"
        className="
            py-24
            px-6
            bg-gray-50
            dark:bg-gray-900
            border-t
            border-gray-200
            dark:border-gray-800
        "
        >
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-4 select-none">
                    ❓ Learn More
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight font-sans">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-base">
                    Find quick answers to common queries about streaks, scraping, and platform functionalities.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                        >
                            <button
                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left font-semibold text-base sm:text-lg text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/80 transition cursor-pointer select-none"
                            >
                                <span>{faq.q}</span>
                                <span className={`text-xl text-blue-500 transform transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                                    ➕
                                </span>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    isOpen ? "max-h-60 border-t border-gray-200 dark:border-gray-800" : "max-h-0"
                                }`}
                            >
                                <p className="p-6 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        </section>

{/* Testimonials/Success Stories Section */}
        <section
        id="testimonials"
        className="
            py-24
            px-6
            bg-gray-50
            dark:bg-gray-900/60
            border-b
            border-gray-200
            dark:border-gray-800
        "
        >
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4 select-none">
                💬 Community Reviews
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight font-sans">
                Cracking Interviews with PrepTrack
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base">
                Read how students improved their coding consistency, organised questions, and cracked engineering roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Testimonial 1 */}
              <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 relative group">
                <div className="absolute top-6 right-8 text-5xl text-emerald-100 dark:text-emerald-950/40 select-none group-hover:scale-110 transition duration-300">
                  “
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                    AR
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white">Anjali Roy</h4>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">SDE-1 @ Amazon</span>
                  </div>
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed italic flex-1">
                  "PrepTrack's daily contribution calendar completely transformed my routine! I went from practicing once a week to maintaining a 100-day coding streak. It made me accountable and ready to crack the interview rounds."
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 relative group">
                <div className="absolute top-6 right-8 text-5xl text-emerald-100 dark:text-emerald-950/40 select-none group-hover:scale-110 transition duration-300">
                  “
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                    PS
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white">Pratham Sharma</h4>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Software Engineer @ Microsoft</span>
                  </div>
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed italic flex-1">
                  "The automatic link scraper is an absolute lifesaver. Being able to paste a LeetCode link and instantly have the title and difficulty populate saved me hours. The search and filter options are also incredibly clean."
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 relative group">
                <div className="absolute top-6 right-8 text-5xl text-emerald-100 dark:text-emerald-950/40 select-none group-hover:scale-110 transition duration-300">
                  “
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                    SP
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white">Sneha Patel</h4>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Analyst @ Goldman Sachs</span>
                  </div>
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed italic flex-1">
                  "Having visual sheets like NeetCode 150 and Striver SDE sheet combined with custom notes was incredibly helpful. I always knew exactly what was pending. I recommend PrepTrack to everyone prepping for tech roles."
                </p>
              </div>

            </div>

          </div>
        </section>

{/* Contact */}
        <section
        id="contact"
        className="
            py-24
            px-6
            bg-gray-50
            dark:bg-gray-900
        "
        >
        <div className="max-w-5xl mx-auto">

            <div className="text-center mb-14">

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Contact Us
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
                Have questions, suggestions, or feedback?
                We'd love to hear from you.
            </p>

            </div>

            <div
            className="
                bg-white
                dark:bg-gray-800
                rounded-3xl
                shadow-xl
                p-8
            "
            >

            <form className="space-y-6" onSubmit={sendEmail}>

                <div className="grid md:grid-cols-2 gap-6">

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    dark:bg-gray-900
                    "
                />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    dark:bg-gray-900
                    "
                />

                </div>

                <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    dark:bg-gray-900
                "
                />

                <textarea
                 name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Write your message..."
                className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    dark:bg-gray-900
                "
                />

                <button
                type="submit"
                className="
                    w-full
                    py-4
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    font-semibold
                    hover:scale-[1.02]
                    transition
                "
                >
                Send Message 🚀
                </button>

            </form>

            </div>

        </div>
        </section>

{/* CTA */}
        <section
        className="
            py-24
            px-6

            bg-gradient-to-r
            from-blue-600
            via-purple-600
            to-indigo-700

            text-white
        "
        >

        <div
            className="
            max-w-4xl
            mx-auto

            text-center
            "
        >

            <h2
            className="
                text-4xl
                md:text-5xl

                font-bold

                mb-6
            "
            >
            Ready To Level Up
            Your DSA Journey?
            </h2>

            <p
            className="
                text-lg
                md:text-xl

                text-gray-200

                mb-10
            "
            >
            Join PrepTrack today and
            start tracking your coding
            progress like a professional.
            </p>

            <div
            className="
                flex
                flex-col
                sm:flex-row

                justify-center

                gap-4
            "
            >

            <Link to="/register">

                <button
                className="
                    px-8
                    py-4

                    rounded-2xl

                    bg-white

                    text-blue-600

                    font-semibold

                    hover:scale-105

                    transition
                "
                >
                Start Tracking Free 🚀
                </button>

            </Link>

            <Link to="/login">

                <button
                className="
                    px-8
                    py-4

                    rounded-2xl

                    border
                    border-white

                    hover:bg-white/10

                    transition
                "
                >
                Login
                </button>

            </Link>

            </div>
          </div>
        </section>

        <footer
          className="
            relative
            bg-gray-50
            dark:bg-gray-950
            text-gray-600
            dark:text-gray-400
            border-t
            border-gray-200
            dark:border-gray-900
            py-16
            px-6
            md:px-12
            transition-colors
            duration-300
            overflow-hidden
          "
        >
          {/* Subtle glowing decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent dark:via-purple-500/50" />
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div
            className="
              max-w-7xl
              mx-auto
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-12
              relative
              z-10
            "
          >
            {/* Column 1: Brand & Social */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 group cursor-pointer w-fit">
                <span className="text-3xl transform group-hover:scale-125 group-hover:rotate-12 transition duration-300">🚀</span>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  PrepTrack
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Your ultimate companion for tracking DSA preparation, analyzing strengths, maintaining streaks, and cracking tech interviews! 💻🔥
              </p>
              
              {/* Badges container */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="inline-flex items-center gap-2.5 w-fit px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold text-blue-600 dark:text-blue-400 select-none hover:scale-105 transition duration-300">
                  <span>📱 Installable PWA Ready</span>
                </div>
                <div className="inline-flex items-center gap-2.5 w-fit px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-xs font-semibold text-orange-600 dark:text-orange-400 select-none hover:scale-105 transition duration-300">
                  <span>🔥 Live Streak Heatmap</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-5 pt-2">
                <a
                  href="https://github.com/nitishkpathak"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black dark:hover:text-white transition duration-300 text-sm flex items-center gap-2 group font-medium"
                >
                  <span className="text-lg group-hover:scale-125 transition duration-300">🐙</span> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/nitishkpathak/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-650 dark:hover:text-blue-400 transition duration-300 text-sm flex items-center gap-2 group font-medium"
                >
                  <span className="text-lg group-hover:scale-125 transition duration-300">💼</span> LinkedIn
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-6">
              <h3 className="text-black dark:text-white font-bold text-lg tracking-wider flex items-center gap-2">
                <span>🔗</span> Quick Navigation
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <a href="#home" className="hover:text-blue-650 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">🏠</span> Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-blue-650 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">ℹ️</span> About
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-blue-650 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">✨</span> Features
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-blue-650 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">⚙️</span> How It Works
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-650 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">✉️</span> Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Supported Platforms */}
            <div className="space-y-6">
              <h3 className="text-black dark:text-white font-bold text-lg tracking-wider flex items-center gap-2">
                <span>🎯</span> Coding Platforms
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:rotate-12 transition duration-200">🚀</span> LeetCode
                  </a>
                </li>
                <li>
                  <a href="https://www.geeksforgeeks.org" target="_blank" rel="noreferrer" className="hover:text-green-600 dark:hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:rotate-12 transition duration-200">🟢</span> GeeksforGeeks
                  </a>
                </li>
                <li>
                  <a href="https://codeforces.com" target="_blank" rel="noreferrer" className="hover:text-blue-650 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:rotate-12 transition duration-200">🔵</span> Codeforces
                  </a>
                </li>
                <li>
                  <a href="https://codechef.com" target="_blank" rel="noreferrer" className="hover:text-amber-700 dark:hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="group-hover:rotate-12 transition duration-200">🌶️</span> CodeChef
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Development / Stack */}
            <div className="space-y-6">
              <h3 className="text-black dark:text-white font-bold text-lg tracking-wider flex items-center gap-2">
                <span>🛠️</span> Tech Stack & Specs
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                PrepTrack is built on the robust MERN stack using React ⚛️, Node.js 🟢, Express.js 🚀, and MongoDB 🍃.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold select-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>🟢 All Systems Operational</span>
                </div>
                <div className="text-xs text-gray-450 dark:text-gray-500 font-medium">
                  ⚡ Version 2.2.0 (Stable)
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Section */}
          <div
            className="
              border-t
              border-gray-200
              dark:border-gray-900
              max-w-7xl
              mx-auto
              mt-12
              pt-6
              flex
              flex-col
              md:flex-row
              justify-between
              items-center
              gap-4
              text-sm
              text-gray-500
              dark:text-gray-500
              relative
              z-10
            "
          >
            <div>
              © {new Date().getFullYear()} PrepTrack. All rights reserved.
            </div>
            
            <div className="flex items-center gap-5 flex-wrap justify-center">
              <div className="flex items-center gap-1.5">
                Built with <span className="text-red-500 animate-pulse text-base">💖</span> in India by{" "}
                <a
                  href="https://github.com/nitishkpathak"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition"
                >
                  Nitish Kumar Pathak
                </a>
              </div>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-850 transition-all duration-300 cursor-pointer"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </footer>

        {/* Selected Sheet Overview Modal */}
        {selectedSheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl text-left transform scale-100 transition-all duration-300 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white">
                    {selectedSheet.name}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block font-semibold">
                    Curated by {selectedSheet.curator}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSheet(null)}
                  className="p-1 rounded-lg hover:bg-gray-105 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Sheet Description
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-150 dark:border-gray-800">
                    {selectedSheet.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Topics Covered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSheet.topics.map((topic, i) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-955/40 text-purple-650 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 select-none">
                        📚 {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Difficulty Distribution
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-2xl text-center">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">Easy</span>
                      <span className="text-lg font-extrabold text-black dark:text-white">{selectedSheet.difficulty.easy} Qs</span>
                    </div>
                    <div className="bg-yellow-50/50 dark:bg-yellow-950/10 border border-yellow-100 dark:border-yellow-900/30 p-3 rounded-2xl text-center">
                      <span className="text-xs text-yellow-600 dark:text-yellow-450 font-bold block">Medium</span>
                      <span className="text-lg font-extrabold text-black dark:text-white">{selectedSheet.difficulty.medium} Qs</span>
                    </div>
                    <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 p-3 rounded-2xl text-center">
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-bold block">Hard</span>
                      <span className="text-lg font-extrabold text-black dark:text-white">{selectedSheet.difficulty.hard} Qs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-150 dark:border-gray-800 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-semibold">
                    Sign up or log in to enable live tracking and check off problems for this sheet in your personal dashboard!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/register" onClick={() => setSelectedSheet(null)} className="flex-1">
                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-650 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm transition duration-200 cursor-pointer shadow-md">
                        Register Now
                      </button>
                    </Link>
                    <Link to="/login" onClick={() => setSelectedSheet(null)} className="flex-1">
                      <button className="w-full py-3 border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-bold rounded-xl text-sm transition duration-200 cursor-pointer">
                        Log In
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Custom Alert Modal Popup */}
        {alertMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center transform scale-100 transition-all duration-300">
              <div className="text-4xl mb-4">
                {alertMessage.type === "success" ? "🚀" : "❌"}
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                {alertMessage.type === "success" ? "Success" : "Error"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {alertMessage.text}
              </p>
              <button
                onClick={() => {
                  const action = alertMessage.onClose;
                  setAlertMessage(null);
                  if (action) action();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        )}

    </div>
  );
}

export default Home;