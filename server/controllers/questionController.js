const Question = require("../models/Question");


// Add Question
const addQuestion = async (req, res) => {
  try {

    const {
      title,
      topic,
      difficulty,
      status,
      notes,
    } = req.body;

    const question = await Question.create({
      title,
      topic,
      difficulty,
      status,
      notes,
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

    // Update question
    const updatedQuestion =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json(updatedQuestion);

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