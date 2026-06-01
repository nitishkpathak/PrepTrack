const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  scrapeDescription,
  resetQuestions,
} = require("../controllers/questionController");

router.post("/", protect, addQuestion);
router.get("/", protect, getQuestions);
router.post("/scrape-description", protect, scrapeDescription);
router.delete("/reset/all", protect, resetQuestions);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

module.exports = router;