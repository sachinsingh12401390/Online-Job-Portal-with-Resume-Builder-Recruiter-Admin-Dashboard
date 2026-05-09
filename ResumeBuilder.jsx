import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: [{ name: '', level: 'Intermediate' }],
    experience: [{ title: '', company: '', date: '', description: '' }],
    education: [{ school: '', degree: '', startDate: '', endDate: '' }],
    projects: [{ title: '', link: '', startDate: '', endDate: '', description: '' }],
    certifications: [{ name: '', issuer: '', date: '', link: '' }],
    languages: [{ name: '', level: 'Professional Working Proficiency' }],
    awards: [{ title: '', issuer: '', date: '', rank: '', certificate: '' }],
    achievements: [{ title: '', description: '', date: '' }],
    interests: [{ name: '' }],
    references: [{ name: '', contact: '', relation: '' }]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleArrayChange = (index, field, value, type) => {
    const newArray = [...formData[type]];
    newArray[index][field] = value;
    setFormData({ ...formData, [type]: newArray });
  };

  const validateForm = () => {
    const newErrors = {};
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (formData.linkedin && !urlRegex.test(formData.linkedin)) newErrors.linkedin = 'Invalid LinkedIn URL';
    if (!formData.summary.trim()) newErrors.summary = 'Professional Summary is required';
    if (!formData.education[0].school.trim()) newErrors.education = 'Primary Education is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addField = (type) => {
    let newEntry;
    if (type === 'experience') newEntry = { title: '', company: '', date: '', description: '' };
    else if (type === 'education') newEntry = { school: '', degree: '', startDate: '', endDate: '' };
    else if (type === 'projects') newEntry = { title: '', link: '', startDate: '', endDate: '', description: '' };
    else if (type === 'skills') newEntry = { name: '', level: 'Intermediate' };
    else if (type === 'certifications') newEntry = { name: '', issuer: '', date: '', link: '' };
    else if (type === 'languages') newEntry = { name: '', level: 'Professional Working Proficiency' };
    else if (type === 'awards') newEntry = { title: '', issuer: '', date: '', rank: '', certificate: '' };
    else if (type === 'achievements') newEntry = { title: '', description: '', date: '' };
    else if (type === 'interests') newEntry = { name: '' };
    else if (type === 'references') newEntry = { name: '', contact: '', relation: '' };
    
    setFormData({ ...formData, [type]: [...formData[type], newEntry] });
  };

  const removeField = (index, type) => {
    const newArray = [...formData[type]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [type]: newArray });
  };

  const handleBuild = () => {
    if (validateForm()) {
      navigate('/resume-preview', { state: { resumeData: formData } });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ErrorSpan = ({ msg }) => msg ? <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: '500' }}>{msg}</div> : null;

  return (
    <div className="resume-builder-page" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '4rem' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '0.5rem', fontWeight: '800' }}>Ultimate CV Architect</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '4rem' }}>Comprehensive, industry-standard CV builder with all essential sections.</p>
        
        <form className="resume-form" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          
          {/* 1. Contact */}
          <section>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>📇 Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input type="text" name="name" placeholder="John Doe" className={`input-field ${errors.name ? 'error' : ''}`} onChange={handleChange} />
                <ErrorSpan msg={errors.name} />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input type="email" name="email" placeholder="john@example.com" className={`input-field ${errors.email ? 'error' : ''}`} onChange={handleChange} />
                <ErrorSpan msg={errors.email} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="text" name="phone" placeholder="+1 234 567 890" className="input-field" onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">LinkedIn URL</label>
                <input type="text" name="linkedin" className={`input-field ${errors.linkedin ? 'error' : ''}`} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* 2. Summary */}
          <section>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>📝 Professional Summary *</h3>
            <textarea name="summary" className={`input-field ${errors.summary ? 'error' : ''}`} style={{ minHeight: '100px' }} onChange={handleChange}></textarea>
            <ErrorSpan msg={errors.summary} />
          </section>

          {/* 3. Experience */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--color-accent)', margin: 0 }}>💼 Professional Experience</h3>
              <button type="button" className="btn-secondary" onClick={() => addField('experience')}>+ Add Experience</button>
            </div>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                {idx > 0 && <button type="button" onClick={() => removeField(idx, 'experience')} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#f87171', border: 'none', background: 'transparent' }}>✕</button>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" placeholder="Title" className="input-field" value={exp.title} onChange={(e) => handleArrayChange(idx, 'title', e.target.value, 'experience')} />
                  <input type="text" placeholder="Company" className="input-field" value={exp.company} onChange={(e) => handleArrayChange(idx, 'company', e.target.value, 'experience')} />
                </div>
                <input type="text" placeholder="Duration (e.g. 2021 - Present)" className="input-field" style={{ marginTop: '1rem' }} value={exp.date} onChange={(e) => handleArrayChange(idx, 'date', e.target.value, 'experience')} />
                <textarea placeholder="Description..." className="input-field" style={{ marginTop: '1rem' }} value={exp.description} onChange={(e) => handleArrayChange(idx, 'description', e.target.value, 'experience')}></textarea>
              </div>
            ))}
          </section>

          {/* 4. Projects (with Dates) */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--color-accent)', margin: 0 }}>🚀 Key Projects</h3>
              <button type="button" className="btn-secondary" onClick={() => addField('projects')}>+ Add Project</button>
            </div>
            {formData.projects.map((proj, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                {idx > 0 && <button type="button" onClick={() => removeField(idx, 'projects')} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#f87171', border: 'none', background: 'transparent' }}>✕</button>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <input type="text" placeholder="Project Name" className="input-field" value={proj.title} onChange={(e) => handleArrayChange(idx, 'title', e.target.value, 'projects')} />
                  <input type="text" placeholder="Start Date" className="input-field" value={proj.startDate} onChange={(e) => handleArrayChange(idx, 'startDate', e.target.value, 'projects')} />
                  <input type="text" placeholder="End Date" className="input-field" value={proj.endDate} onChange={(e) => handleArrayChange(idx, 'endDate', e.target.value, 'projects')} />
                </div>
                <textarea placeholder="Description..." className="input-field" style={{ marginTop: '1rem' }} value={proj.description} onChange={(e) => handleArrayChange(idx, 'description', e.target.value, 'projects')}></textarea>
              </div>
            ))}
          </section>

          {/* 5. Education */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--color-accent)', margin: 0 }}>🎓 Education History</h3>
              <button type="button" className="btn-secondary" onClick={() => addField('education')}>+ Add Education</button>
            </div>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" placeholder="School/University" className="input-field" value={edu.school} onChange={(e) => handleArrayChange(idx, 'school', e.target.value, 'education')} />
                  <input type="text" placeholder="Degree" className="input-field" value={edu.degree} onChange={(e) => handleArrayChange(idx, 'degree', e.target.value, 'education')} />
                </div>
                <input type="text" placeholder="Graduation Year" className="input-field" style={{ marginTop: '1rem' }} value={edu.endDate} onChange={(e) => handleArrayChange(idx, 'endDate', e.target.value, 'education')} />
              </div>
            ))}
          </section>

          {/* 6. Skills */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--color-accent)', margin: 0 }}>🛠️ Technical Skills</h3>
              <button type="button" className="btn-secondary" onClick={() => addField('skills')}>+ Add Skill</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {formData.skills.map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="e.g. React" className="input-field" value={skill.name} onChange={(e) => handleArrayChange(idx, 'name', e.target.value, 'skills')} />
                  {idx > 0 && <button type="button" onClick={() => removeField(idx, 'skills')} style={{ color: '#f87171', background: 'transparent', border: 'none' }}>✕</button>}
                </div>
              ))}
            </div>
          </section>

          {/* 7. Achievements, Awards, Certs, Languages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            <section className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h4>🏆 Achievements</h4>
                <button type="button" onClick={() => addField('achievements')} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>+ Add</button>
              </div>
              {formData.achievements.map((ach, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <input type="text" placeholder="Title" className="input-field" value={ach.title} onChange={(e) => handleArrayChange(idx, 'title', e.target.value, 'achievements')} />
                  {idx > 0 && <button type="button" onClick={() => removeField(idx, 'achievements')} style={{ fontSize: '0.7rem', color: '#f87171' }}>Remove</button>}
                </div>
              ))}
            </section>

            <section className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h4>📜 Certifications</h4>
                <button type="button" onClick={() => addField('certifications')} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>+ Add</button>
              </div>
              {formData.certifications.map((cert, idx) => (
                <input key={idx} type="text" placeholder="Certification Name" className="input-field" value={cert.name} onChange={(e) => handleArrayChange(idx, 'name', e.target.value, 'certifications')} />
              ))}
            </section>

            <section className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h4>🌐 Languages</h4>
                <button type="button" onClick={() => addField('languages')} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>+ Add</button>
              </div>
              {formData.languages.map((lang, idx) => (
                <input key={idx} type="text" placeholder="Language" className="input-field" value={lang.name} onChange={(e) => handleArrayChange(idx, 'name', e.target.value, 'languages')} />
              ))}
            </section>

            <section className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h4>📄 References</h4>
                <button type="button" onClick={() => addField('references')} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>+ Add</button>
              </div>
              {formData.references.map((ref, idx) => (
                <input key={idx} type="text" placeholder="Name/Contact" className="input-field" value={ref.name} onChange={(e) => handleArrayChange(idx, 'name', e.target.value, 'references')} />
              ))}
            </section>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', marginTop: '4rem', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>Back</button>
            <button type="button" className="btn-primary" style={{ padding: '1rem 4rem' }} onClick={handleBuild}>Architect Resume</button>
          </div>
        </form>
      </div>

      <style>
        {`
          .input-field.error { border-color: #f87171 !important; }
          .input-label { display: block; margin-bottom: 0.6rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; opacity: 0.6; }
        `}
      </style>
    </div>
  );
};

export default ResumeBuilder;
