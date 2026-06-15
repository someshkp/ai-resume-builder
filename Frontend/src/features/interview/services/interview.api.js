import axios from "axios";

const api = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

/*
 * @description API to generate interview report
 * @access Private
 * @params {jobDescription: string, resumeFile: File, selfDescription: string}
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

export const generateInterviewReport = async ({
  jobDescription,
  resumeFile,
  selfDescription,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);
  formData.append("selfDescription", selfDescription);

  const response = await api.post(
    "/api/interview/generate-interview-report",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/*
 * @description API to get interview report by interviewId
 * @access Private
 * @params {interviewId: string}
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

/*
 * @description API to get all interview reports of logged in user
 * @access Private
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview");
  return response.data;
};

/*
 * @description API to generate resume pdf
 * @access Private
 * @params {interviewId: string}
 * @returns {pdfBuffer: Buffer}
 */

export const generateResumePdf = async (interviewId) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewId}`,
    {},
    {
      responseType: "blob",
    },
  );
  return response.data;
};
