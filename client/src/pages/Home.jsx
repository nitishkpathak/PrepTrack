import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
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

        alert("Message sent successfully 🚀");

        setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        });

    } catch (error) {
        console.error(error);
        alert("Failed to send message");
    }
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
                md:flex

                items-center

                gap-8
            "
            >
            <a href="#home">
                Home
            </a>
            
            <a href="#about">
                About
            </a>            

            <a href="#features">
                Features
            </a>

            <a href="#how">
                How It Works
            </a>

            <a href="#contact">
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

                <a href="#home" onClick={() => setMenuOpen(false)}>
                    Home
                </a>

                <a href="#about" onClick={() => setMenuOpen(false)}>
                    About
                </a>

                <a href="#features" onClick={() => setMenuOpen(false)}>
                    Features
                </a>

                <a href="#how" onClick={() => setMenuOpen(false)}>
                    How It Works
                </a>

                <a href="#contact" onClick={() => setMenuOpen(false)}>
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

    </div>
  );
}

export default Home;