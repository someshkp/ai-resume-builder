const Groq = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Zod schema to validate the AI response matches the database model
const interviewReportSchema = z.object({
  matchScore: z.coerce
    .number()
    .describe(
      "The match score between 0 to 100 indicates how well the candidates profile matches the job description.",
    ),
  technicalQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe("The technical question can be asked in the interview."),
      answer: z
        .string()
        .describe(
          "How to answer the question, what point to cover, what approach to take etc.",
        ),
      intention: z
        .string()
        .describe("The intention of the technical question."),
    }),
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe("The behavioral question can be asked in the interview."),
      answer: z
        .string()
        .describe(
          "How to answer the question, what point to cover, what approach to take etc.",
        ),
      intention: z
        .string()
        .describe("The intention of the behavioral question."),
    }),
  ),
  skillGap: z.array(
    z.object({
      skill: z
        .string()
        .describe("The skill that is missing or needs improvement."),
      severity: z
        .enum(["high", "medium", "low"])
        .describe("The severity of the skill gap."),
    }),
  ),
  preparationPlan: z.array(
    z.object({
      day: z.coerce
        .number()
        .describe("The day number for the preparation plan."),
      focus: z
        .string()
        .describe(
          "The main focus of the days in the preparation plan, e.g. data structures and algorithms, system design, etc.",
        ),
      tasks: z.array(
        z
          .string()
          .describe(
            "The tasks to be done for the preparation plan for the day.",
          ),
      ),
    }),
  ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated.",
    ),
});

const fullJsonSchema = zodToJsonSchema(interviewReportSchema);
// Remove $schema and other metadata to prevent AI confusion
const { $schema, ...jsonSchema } = fullJsonSchema;

const generateInterviewReport = async (
  jobDescription,
  resumeText,
  selfDescription,
) => {
  const systemMessage = `
    You are a professional technical interviewer AI. 
    Analyze the job description and resume to generate a structured interview report.
    
    CRITICAL: You MUST return ONLY a JSON object. 
    The JSON must follow this exact structure, including the "title" field:
    {
      "matchScore": 85,
      "title": "Senior Frontend Engineer",
      "technicalQuestions": [{"question": "...", "answer": "...", "intention": "..."}],
      "behavioralQuestions": [{"question": "...", "answer": "...", "intention": "..."}],
      "skillGap": [{"skill": "...", "severity": "high"}],
      "preparationPlan": [{"day": 1, "focus": "...", "tasks": ["..."]}]
    }

    DO NOT include any metadata, "$schema", or wrapper keys. All fields in the schema are mandatory.
  `;

  const userPrompt = `
    Analyze this candidate:
    Job Description: ${jobDescription}
    Resume Text: ${resumeText}
    Candidate's Self Description: ${selfDescription}

    Use this JSON schema for field details:
    ${JSON.stringify(jsonSchema, null, 2)}
  `;

  let parsedData;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0].message.content;
    parsedData = JSON.parse(content);

    return interviewReportSchema.parse(parsedData);
  } catch (error) {
    if (error.name === "ZodError") {
      console.error(
        "Validation failed. Zod issues:",
        JSON.stringify(error.issues, null, 2),
      );
      console.error(
        "Data that failed validation:",
        JSON.stringify(parsedData, null, 2),
      );
    } else {
      console.error("Error generating interview report with Groq:", error);
    }
    throw error;
  }
};

const generatePdffromHtml = async (htmlContent) => {
  // launch puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });
  await browser.close();

  return pdfBuffer;
};

const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  try {
    const cleanedResume = (resume || "")
      .replace(/\\n/g, "\n")
      .replace(/\n\s*\n/g, "\n");

    const resumePdfSchema = z.object({
      html: z
        .string()
        .describe(
          "The HTMl content of the resume which can be converted to PDF using puppeteer",
        ),
    });

    const prompt = `Generate resume for a candidate with the following details:
    Resume Content 
    ${cleanedResume}
    Candidate's Self Description ${selfDescription}
    Job Description ${jobDescription}
    the response should be a JSON object with a single field 'html' containing the HTML content of the resume.
    The resume should be tailored for given job description and should highlight the candidate's strengths and relevant experience. The HTML well-formatted and structured, making it easy to read and visually appealing,
    the content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
    You can highlight the content using some colors or different font style but the overall design should be simple and professional. 
    The content should be ATS friendly, i.e. it should be easily parsable by ATS system without losing important information.
    The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting interview call for the given job description.
    `;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    const jsonContent = JSON.parse(content);
    const pdfBuffer = await generatePdffromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating resume PDF with Groq:", error);
    throw error;
  }
};

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};
