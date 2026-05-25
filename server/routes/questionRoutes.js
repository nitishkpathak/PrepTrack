const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

router.post("/", protect, addQuestion);
router.get("/", protect, getQuestions);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

module.exports = router;