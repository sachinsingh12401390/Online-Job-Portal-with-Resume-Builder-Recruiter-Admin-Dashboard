import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeData } = location.state || {};

  if (!resumeData) return <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>No data found.</div>;

  const handlePrint = () => window.print();

  const SectionHeader = ({ title }) => (
    <div style={{ borderBottom: '1px solid #000', marginBottom: '0.6rem', marginTop: '1.2rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>{title}</h2>
    </div>
  );

  const DualRow = ({ left, right }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.1rem' }}>
      <div style={{ fontWeight: 'bold' }}>{left}</div>
      <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{right}</div>
    </div>
  );

  return (
    <div className="resume-preview-container" style={{ padding: '4rem 2rem', background: '#1a1a1a', minHeight: '100vh' }}>
      <div className="preview-actions" style={{ maxWidth: '850px', margin: '0 auto 2rem auto', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/resume-builder')} className="btn-secondary">Edit</button>
        <button onClick={handlePrint} className="btn-primary">Download PDF</button>
      </div>

      <div id="resume-document" className="resume-paper" style={{ 
        width: '210mm', minHeight: '297mm', background: 'white', color: 'black', 
        padding: '15mm', margin: '0 auto', fontFamily: '"Times New Roman", Times, serif',
        lineHeight: '1.3', fontSize: '10pt', boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '22pt', fontWeight: 'bold', margin: '0 0 0.3rem 0', textTransform: 'uppercase' }}>{resumeData.name}</h1>
          <div style={{ fontSize: '9pt', display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <span>{resumeData.email}</span>
            {resumeData.phone && <span>• {resumeData.phone}</span>}
            {resumeData.linkedin && <span>• LinkedIn</span>}
            {resumeData.github && <span>• GitHub</span>}
            {resumeData.website && <span>• Portfolio</span>}
          </div>
        </div>

        {/* Summary */}
        <p style={{ margin: '0 0 1rem 0', textAlign: 'justify' }}>{resumeData.summary}</p>

        {/* Experience */}
        {resumeData.experience && resumeData.experience[0].title && (
          <>
            <SectionHeader title="Professional Experience" />
            {resumeData.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '0.8rem' }}>
                <DualRow left={exp.company} right={exp.date} />
                <div style={{ fontStyle: 'italic' }}>{exp.title}</div>
                <ul style={{ margin: '0.2rem 0 0 1.2rem', padding: 0 }}>
                  {exp.description.split('\n').map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects[0].title && (
          <>
            <SectionHeader title="Key Projects" />
            {resumeData.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '0.6rem' }}>
                <DualRow left={proj.title} right={`${proj.startDate} – ${proj.endDate}`} />
                <p style={{ margin: '0.1rem 0 0 0' }}>{proj.description}</p>
              </div>
            ))}
          </>
        )}

        {/* Achievements & Awards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            {resumeData.achievements && resumeData.achievements[0].title && (
              <>
                <SectionHeader title="Achievements" />
                {resumeData.achievements.map((ach, i) => (
                  <div key={i} style={{ marginBottom: '0.3rem' }}>• {ach.title}</div>
                ))}
              </>
            )}
          </div>
          <div>
            {resumeData.awards && resumeData.awards[0].title && (
              <>
                <SectionHeader title="Awards" />
                {resumeData.awards.map((awd, i) => (
                  <div key={i} style={{ marginBottom: '0.3rem' }}>• {awd.title}</div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Skills & Certifications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <SectionHeader title="Technical Skills" />
            <p style={{ margin: 0 }}>{resumeData.skills.map(s => s.name).join(', ')}</p>
          </div>
          <div>
            {resumeData.certifications && resumeData.certifications[0].name && (
              <>
                <SectionHeader title="Certifications" />
                {resumeData.certifications.map((cert, i) => (
                  <div key={i} style={{ marginBottom: '0.2rem' }}>• {cert.name}</div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Education */}
        <SectionHeader title="Education" />
        {resumeData.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <DualRow left={edu.school} right={edu.endDate} />
            <div style={{ fontStyle: 'italic' }}>{edu.degree}</div>
          </div>
        ))}

        {/* Languages & References */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            {resumeData.languages && resumeData.languages[0].name && (
              <>
                <SectionHeader title="Languages" />
                <p style={{ margin: 0 }}>{resumeData.languages.map(l => l.name).join(', ')}</p>
              </>
            )}
          </div>
          <div>
            {resumeData.references && resumeData.references[0].name && (
              <>
                <SectionHeader title="References" />
                {resumeData.references.map((ref, i) => (
                  <div key={i} style={{ marginBottom: '0.2rem' }}>• {ref.name}</div>
                ))}
              </>
            )}
          </div>
        </div>

      </div>

      <style>
        {`
          @media print {
            body { background: white !important; }
            .resume-preview-container { padding: 0 !important; background: white !important; }
            .preview-actions { display: none !important; }
            .resume-paper { box-shadow: none !important; margin: 0 !important; width: 100% !important; padding: 10mm !important; }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
