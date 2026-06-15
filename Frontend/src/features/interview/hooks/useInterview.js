import {
  getInterviewReportById,
  getAllInterviewReports,
  generateInterviewReport,
  generateResumePdf,
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../services/interview.context";

export const useInterview = () => {
  const { loading, setLoading, report, setReport, reports, setReports } =
    useContext(InterviewContext);

  const handleGenerateInterviewReport = async ({
    jobDescription,
    resumeFile,
    selfDescription,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        resumeFile,
        selfDescription,
      });
      setReport(response.data);

      return response;
    } catch (error) {
      console.error("Error generating interview report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetInterviewReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.data);
      return response;
    } catch (error) {
      console.error("Error getting interview report by ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllInterviewReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();

      setReports(response.data);
      return response;
    } catch (error) {
      console.error("Error getting all interview reports:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf(interviewReportId);
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error getting resume pdf:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    handleGenerateInterviewReport,
    handleGetInterviewReportById,
    handleGetAllInterviewReports,
    handleGetResumePdf,
  };
};
