const Question = require("../models/Question");
const User = require("../models/User");

// Add Question
const addQuestion = async (req, res) => {
  try {

    const {
      title,
      topic,
      difficulty,
      status,
      notes,
      link,
    } = req.body;

    const question = await Question.create({
      title,
      topic,
      difficulty,
      status,
      notes,
      link,
      user: req.user._id,
    });

    res.status(201).json(question);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get All Questions
const getQuestions = async (req, res) => {
  try {

    const questions = await Question.find({
      user: req.user._id,
    });

    res.status(200).json(questions);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Update Question
const updateQuestion = async (req, res) => {
  try {

    const question = await Question.findById(
      req.params.id
    );

    // Check question exists
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Check ownership
    if (
      question.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // ============================
    // STREAK LOGIC
    // ============================

    const oldStatus =
      question.status;

    const newStatus =
      req.body.status;

    if (
      oldStatus !== "Solved" &&
      newStatus === "Solved"
    ) {

      const user =
        await User.findById(
          req.user._id
        );

      const today =
        new Date().toDateString();

      const lastSolved =
        user.lastSolvedDate
          ? new Date(
              user.lastSolvedDate
            ).toDateString()
          : null;

      // Same day par sirf 1 baar streak increase
      if (
        lastSolved !== today
      ) {

        user.streak += 1;

        user.lastSolvedDate =
          new Date();

        await user.save();
      }
    }

    // ============================
    // UPDATE QUESTION
    // ============================

    const updatedQuestion =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json(
      updatedQuestion
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete Question
const deleteQuestion = async (req, res) => {
  try {

    const question = await Question.findById(
      req.params.id
    );

    // Check question exists
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Check ownership
    if (
      question.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await question.deleteOne();

    res.status(200).json({
      message: "Question deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Helper to clean HTML
const cleanHtml = (html) => {
  if (!html) return "";
  
  let text = html;

  // Replace common block tags with newlines
  text = text.replace(/<(p|div|br|li|h1|h2|h3|h4|h5|h6)[^>]*>/gi, "\n");
  text = text.replace(/<\/p>|<\/div>|<\/li>/gi, "\n");
  
  // Format bold / italic/ code tags
  text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Remove all other HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Clean up HTML entities
  const entities = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&middot;": "·",
    "&ndash;": "–",
    "&mdash;": "—",
    "&#39;": "'",
    "&le;": "≤",
    "&ge;": "≥",
    "&lt;=": "≤",
    "&gt;=": "≥",
  };
  for (const [entity, value] of Object.entries(entities)) {
    text = text.replaceAll(entity, value);
  }

  // Remove multiple consecutive empty lines
  text = text.replace(/\n\s*\n\s*\n+/g, "\n\n");
  
  return text.trim();
};

// Scrape Description from Link
const scrapeDescription = async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }

    const url = new URL(link);
    let description = "";

    // LeetCode
    if (url.hostname.includes("leetcode.com")) {
      const match = url.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
      if (match && match[1]) {
        const slug = match[1];
        const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
          },
          body: JSON.stringify({
            query: `
              query questionContent($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  content
                }
              }
            `,
            variables: { titleSlug: slug }
          })
        });
        const data = await response.json();
        const content = data.data?.question?.content;
        if (content) {
          description = cleanHtml(content);
        }
      }
    }
    // GeeksforGeeks
    else if (url.hostname.includes("geeksforgeeks.org")) {
      const response = await fetch(link, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      });
      const html = await response.text();

      // Try parsing from NEXT_DATA first
      const scriptMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (scriptMatch) {
        try {
          const data = JSON.parse(scriptMatch[1]);
          const probData = data.props?.pageProps?.initialState?.problemData?.allData?.probData;
          if (probData && probData.problem_question) {
            description = cleanHtml(probData.problem_question);
          }
        } catch (e) {
          console.error("Error parsing __NEXT_DATA__ GFG script:", e);
        }
      }

      // Fallback: search for div class="problem-statement" in HTML
      if (!description) {
        const match = html.match(/<div class="problem-statement">([\s\S]*?)<\/div>/);
        if (match && match[1]) {
          description = cleanHtml(match[1]);
        }
      }
    }

    res.status(200).json({ description });
  } catch (error) {
    console.error("Scraping description failed:", error);
    // Return empty description on failure to prevent frontend crashing
    res.status(200).json({ description: "" });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  scrapeDescription,
};