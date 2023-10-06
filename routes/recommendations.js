const express = require("express");
const {
  getRecommendations,
} = require("../controllers/recommendationController");
const { authenticate } = require("../middlewares/authentication");

const recommendRouter = express.Router();
recommendRouter.get("/",authenticate, getRecommendations);

module.exports = { recommendRouter };
