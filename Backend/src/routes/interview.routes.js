const express = require("express");
const interviewRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} = require("../controller/interview.controller");
const upload = require("../middlewares/file.middleware");

/*
 * @route POST /api/interview/generate-interview-report
 * @desc Generate interview report on the basis of user self description and job description and resume text
 * @access Private
 * @body {jobDescription: string, resumeText: string, selfDescription: string}
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

interviewRouter.post(
  "/generate-interview-report",
  authMiddleware,
  upload.single("resume"),
  generateInterviewReportController,
);

/*
 * @route GET /api/interview/report/:interviewId
 * @desc Get interview report by interviewId
 * @access Private
 * @params {interviewId: string}
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware,
  getInterviewReportByIdController,
);

/*
 * @route GET /api/interview/reports
 * @desc Get all interview reports of logged in user
 * @access Private
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

interviewRouter.get("/", authMiddleware, getAllInterviewReportsController);

/*
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @desc Generate resume pdf on the basis of interview report
 * @access Private
 * @params {interviewReportId: string}
 * @returns {pdfBuffer: Buffer}
 */

interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware,
  generateResumePdfController,
);

module.exports = interviewRouter;
