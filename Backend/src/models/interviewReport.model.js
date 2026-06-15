const mongoose = require("mongoose");

/*
 * - job description schema : string
 * - resume text : string
 * - Self description : string
 *
 * - matchScore: Number
 *
 * - Tchnical questions : [{question: "", answer: "", intent: ""}]
 * - Behavioral questions : [{question: "", answer: "", intent: ""}]
 * - Skill gap : [{skill: "", severity: {
 *   type: string,
 *   enum: ["high", "medium", "low"]
 *   }}]
 * - Preperation plan : [{
 *   day : Number,
 * focus: String,
 * tasks : [String]
 * }]
 *
 */

const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["high", "medium", "low"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"],
  },
  focus: {
    type: String,
    required: [true, "Focus is required"],
  },
  tasks: [
    {
      type: String,
      required: [true, "Task is required"],
    },
  ],
});

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resumeText: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
