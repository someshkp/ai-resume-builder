import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, User, Upload, Sparkles, Loader2 } from 'lucide-react';
import '../styles/home.scss';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router';

const Home = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const resumeInputRef = useRef(null);
    const navigate = useNavigate();

    const { loading, handleGenerateInterviewReport, handleGetAllInterviewReports, reports } = useInterview();

    useEffect(() => {
        handleGetAllInterviewReports();
    }, []);

    const handleGenerateReport = async () => {
        try {
            const response = await handleGenerateInterviewReport({
                jobDescription,
                resumeFile: resumeInputRef.current.files[0],
                selfDescription,
            });

            navigate(`/interview/${response.data._id}`);
        } catch (error) {
            console.error('Error generating interview report:', error);
        }
    };

    if (loading) {
        return (
            <main>
                <Loader2 className="spinner" size={48} />
                <p>Analyzing your profile and generating your interview plan...</p>
            </main>
        );
    }



    return (
        <main className='home'>
            <header className="home-header">
                <h1>Create Your Custom <span className="highlight-text">Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            <div className="interview-planner-card">
                <div className="card-main">
                    <section className="column left-column">
                        <div className="section-header">
                            <div className="title-with-icon">
                                <Briefcase className="icon briefcase-icon" size={20} />
                                <h2>Target Job Description</h2>
                            </div>
                            <span className="required-tag">Required</span>
                        </div>
                        <div className="textarea-wrapper">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                                maxLength={5000}
                            />
                            <div className="char-count">{jobDescription.length} / 5000 chars</div>
                        </div>
                    </section>

                    <section className="column right-column">
                        <div className="section-header">
                            <div className="title-with-icon">
                                <User className="icon user-icon" size={20} />
                                <h2>Your Profile</h2>
                            </div>
                        </div>

                        <div className="upload-group">
                            <label className="upload-label">
                                Upload Resume <span className="small-note">(Best Results)</span>
                            </label>
                            <label htmlFor="resume-upload" className="dropzone">
                                <div className="upload-content">
                                    <div className="upload-circle">
                                        <Upload className="icon upload-icon" size={24} />
                                    </div>
                                    <h3>Click to upload or drag & drop</h3>
                                    <p>PDF (Max 3MB)</p>
                                </div>
                                <input ref={resumeInputRef} hidden type="file" id="resume-upload" accept=".pdf" />
                            </label>
                        </div>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div className="self-desc-group">
                            <label className="input-label">Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        <div className="info-box">
                            <div className="info-dot"></div>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </section>
                </div>

                <footer className="card-footer">
                    <div className="footer-info">
                        AI-Powered Strategy Generation • Approx 30s
                    </div>
                    <button className="generate-button" onClick={handleGenerateReport} disabled={loading}>
                        <Sparkles className="icon sparkle-icon" size={18} />
                        Generate My Interview Strategy
                    </button>
                </footer>
            </div>

            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview plans</h2>
                    <ul className="reports-list">
                        {reports.map(report => (
                            <li key={report.id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'untitle position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
};

export default Home;
