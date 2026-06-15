import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Code2, MessageSquare, Send, AlertCircle, Loader2, Info, ChevronDown, Sparkles } from 'lucide-react';
import '../styles/interview.scss';
import { useInterview } from '../hooks/useInterview';

const QuestionCard = ({ q, idx, type }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const qPrefix = type === 'technical' ? 'Q' : 'B';
    const qColor = type === 'technical' ? '#ff4d94' : '#3b82f6';

    return (
        <div className={`qna-card ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
            <div className="qna-header">
                <div className="q-badge" style={{ backgroundColor: qColor }}>
                    {qPrefix}{idx + 1}
                </div>
                <div className="question-text">{q.question}</div>
                <ChevronDown
                    className={`chevron ${isExpanded ? 'rotated' : ''}`}
                    size={20}
                    color="#64748b"
                />
            </div>

            <div className={`qna-content ${isExpanded ? 'active' : ''}`}>
                <div className="qna-body">
                    <div className="info-block">
                        <span className="info-badge purple">INTENTION</span>
                        <p>{q.intention}</p>
                    </div>
                    <div className="info-block">
                        <span className="info-badge green">MODEL ANSWER</span>
                        <p>{q.answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Interview = () => {
    const { interviewId } = useParams();
    const [activeTab, setActiveTab] = useState('technical');
    const { report: interviewReport, loading, handleGetInterviewReportById, handleGetResumePdf } = useInterview();
    const [fetching, setFetching] = React.useState(true);

    React.useEffect(() => {
        const fetchReport = async () => {
            try {
                await handleGetInterviewReportById(interviewId);
            } catch (error) {
                console.error("Failed to fetch interview report:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchReport();
    }, [interviewId]);

    if (loading || fetching) {
        return (
            <main >
                <Loader2 className="spinner" size={48} />
                <p>Analyzing your profile and generating your interview plan...</p>
            </main>
        );
    }

    if (!interviewReport) {
        return (
            <main>
                <AlertCircle size={48} color="#ef4444" />
                <h2>Oops! Report Not Found</h2>
                <p>We couldn't find the interview report you're looking for.</p>
            </main>
        );
    }


    return (
        <main className="interview-page">
            <div className="interview-container">
                {/* Left Sidebar - Navigation */}
                <section className="sidebar">
                    <div className="sidebar-group-title">SECTIONS</div>
                    <div className='interview-nav'>
                        <div className="navigation-items">
                            <button
                                className={`nav-item ${activeTab === 'technical' ? 'active' : ''}`}
                                onClick={() => setActiveTab('technical')}
                            >
                                <Code2 size={18} style={{ marginRight: '12px' }} />
                                Technical Questions
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'behavioral' ? 'active' : ''}`}
                                onClick={() => setActiveTab('behavioral')}
                            >
                                <MessageSquare size={18} style={{ marginRight: '12px' }} />
                                Behavioral Questions
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
                                onClick={() => setActiveTab('roadmap')}
                            >
                                <Send size={18} style={{ marginRight: '12px' }} />
                                Road Map
                            </button>
                        </div>
                        <div className='download-resume-button'>
                            <button className='button primary-button' onClick={() => handleGetResumePdf(interviewId)}>
                                <Sparkles className="icon sparkle-icon" size={18} /> Download Resume
                            </button>
                        </div>
                    </div>
                </section>

                <section className="main-content">
                    <header className="report-header">
                        <div className="header-title-row">
                            <h1>
                                {activeTab === 'technical' && 'Technical '}
                                {activeTab === 'behavioral' && 'Behavioral '}
                                {activeTab === 'roadmap' && 'Preparation Road Map'}
                                {activeTab !== 'roadmap' && <span style={{ color: '#ff0066' }}>Questions</span>}
                            </h1>
                            <span className="day-badge">
                                {activeTab === 'technical' && `${interviewReport.technicalQuestions.length} questions`}
                                {activeTab === 'behavioral' && `${interviewReport.behavioralQuestions.length} questions`}
                                {activeTab === 'roadmap' && `${interviewReport.preparationPlan.length}-day plan`}
                            </span>
                        </div>
                        <div className="header-divider" />
                    </header>

                    {(activeTab === 'technical' || activeTab === 'behavioral') && (
                        <div className="qna-section">
                            {interviewReport[activeTab + 'Questions'].map((q, idx) => (
                                <QuestionCard key={idx} q={q} idx={idx} type={activeTab} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className="timeline-container">
                            {interviewReport.preparationPlan.map((day, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-line" />
                                    <div className="timeline-node" />
                                    <div className="timeline-content">
                                        <div className="day-header">
                                            <span className="day-label">Day {day.day}</span>
                                            <h3 className="day-title">{day.focus}</h3>
                                        </div>
                                        <ul className="task-list">
                                            {day.tasks.map((task, tIdx) => (
                                                <li key={tIdx}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Right Sidebar - Match Score & Skill Gaps */}
                <section className="right-sidebar">
                    <div className="match-score-container">
                        <div className="score-circle">
                            <svg viewBox="0 0 100 100">
                                <circle className="bg" cx="50" cy="50" r="45" />
                                <circle
                                    className="progress"
                                    cx="50" cy="50" r="45"
                                    style={{ '--percent': interviewReport.matchScore }}
                                />
                            </svg>
                            <div className="score-value">
                                {interviewReport.matchScore}
                                <span>%</span>
                            </div>
                        </div>
                        <div className="match-status">
                            {interviewReport.matchScore >= 80 ? 'Strong match for this role' :
                                interviewReport.matchScore >= 60 ? 'Good match for this role' :
                                    'Partial match for this role'}
                        </div>
                    </div>

                    <div className="section-title">
                        SKILL GAPS
                    </div>
                    <div className="skill-cards">
                        {interviewReport.skillGap.map((skill, idx) => (
                            <div
                                key={idx}
                                className={`skill-card severity-${skill.severity}`}
                            >
                                {skill.skill}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Interview;