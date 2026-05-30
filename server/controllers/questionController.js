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

module.exports = {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
};