const Question = require("../models/Question");
const User = require("../models/User");
const { scrapeProblemDescription } = require("../utils/scraper");

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

// Scrape Description from Link (Delegated to scraper utility)
const scrapeDescription = async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }

    // Call external scraper service to parse description
    const description = await scrapeProblemDescription(link);

    res.status(200).json({ description });
  } catch (error) {
    console.error("Scraping description failed:", error);
    // Return empty description on failure to prevent frontend crashing
    res.status(200).json({ description: "" });
  }
};

// Reset all questions and streak for a user
const resetQuestions = async (req, res) => {
  try {
    await Question.deleteMany({ user: req.user._id });

    // Reset user streak and lastSolvedDate
    const user = await User.findById(req.user._id);
    if (user) {
      user.streak = 0;
      user.lastSolvedDate = null;
      await user.save();
    }

    res.status(200).json({
      message: "All questions and daily streak have been successfully reset.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic || "",
        createdAt: user.createdAt,
        streak: user.streak,
        lastSolvedDate: user.lastSolvedDate,
      }
    });
  } catch (error) {
    console.error("Reset questions failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  scrapeDescription,
  resetQuestions,
};