const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");

const generateInterviewReportController = async (req, res) => {
  try {
    const resumeFile = req.file;
    const { jobDescription, selfDescription } = req.body;

    let resumeText = "";

    if (resumeFile) {
      const resumeContent = await new pdfParse.PDFParse(
        Uint8Array.from(resumeFile.buffer),
      ).getText();
      resumeText = (resumeContent.text || "")
        .replace(/\\n/g, "\n")
        .replace(/\n\s*\n/g, "\n");
    }
    const interviewReport = await generateInterviewReport(
      jobDescription,
      resumeText,
      selfDescription,
    );

    const interviewReportData = await interviewReportModel.create({
      jobDescription,
      resumeText,
      selfDescription,
      title: interviewReport.title,
      matchScore: interviewReport.matchScore,
      technicalQuestions: interviewReport.technicalQuestions,
      behavioralQuestions: interviewReport.behavioralQuestions,
      skillGap: interviewReport.skillGap,
      preparationPlan: interviewReport.preparationPlan,
      user: req.user.id,
    });

    await interviewReportData.save();

    res.status(200).json({
      success: true,
      message: "Interview report generated successfully",
      data: interviewReportData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
};

/*
 * @description Controller to get interview report by interviewId
 * @access Private
 * @params {interviewId: string}
 * @returns {matchScore: number, technicalQuestions: array, behavioralQuestions: array, skillGap: array, preparationPlan: array}
 */

const getInterviewReportByIdController = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findById({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview report fetched successfully",
      data: interviewReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview report",
      error: error.message,
    });
  }
};

/*
 * @description controller to get interview reports of logged in user.
 */

const getAllInterviewReportsController = async (req, res) => {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan",
      );

    if (!interviewReports) {
      return res.status(404).json({
        success: false,
        message: "Interview reports not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully",
      data: interviewReports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview reports",
      error: error.message,
    });
  }
};

/*
 * @description controller to generate resume pdf
 * @access Private
 * @params {resume: string, selfDescription: string, jobDescription: string}
 * @returns {pdfBuffer: Buffer}
 */

const generateResumePdfController = async (req, res) => {
  try {
    const { interviewReportId } = req.params;
    const interviewReport =
      await interviewReportModel.findById(interviewReportId);
    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }
    const { resume, selfDescription, jobDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
    });

    res.send(pdfBuffer);

    // res.status(200).json({
    //   success: true,
    //   message: "Resume PDF generated successfully",
    //   data: pdfBuffer,
    // });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate resume PDF",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
