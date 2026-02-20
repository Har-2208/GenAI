import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config';
import './Loading.css';

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    const submitToBackend = async () => {
      try {
        // Backend API endpoint - configure in src/config.js
        const API_URL = API_CONFIG.getAnalyzeUrl();
        
        const response = await axios.post(API_URL, formData);
        
        // Navigate to results with the response data
        setTimeout(() => {
          navigate('/results', { state: { results: response.data } });
        }, 2000); // Minimum 2 second loading for better UX
        
      } catch (error) {
        console.error('Error analyzing career identity:', error);
        
        // For development/demo: Use mock data if backend is not available
        setTimeout(() => {
          const mockResults = {
            career_identity_summary: "You are an analytical and creative individual with strong problem-solving abilities. Your interests in technology and science, combined with your preference for independent work, suggest careers that blend technical expertise with innovation.",
            top_careers: [
              {
                career_name: "Data Scientist",
                match_percentage: 87,
                fit_reason: "Your analytical thinking and technical skills align perfectly with data science. Your interest in mathematics and problem-solving makes you ideal for this role.",
                required_skills: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
                skill_gap: ["Advanced ML Algorithms", "Big Data Technologies", "SQL Optimization"]
              },
              {
                career_name: "Software Engineer",
                match_percentage: 82,
                fit_reason: "Your technical aptitude and creative problem-solving match well with software engineering. Your preference for independent work suits development roles.",
                required_skills: ["Programming", "Algorithms", "System Design", "Version Control"],
                skill_gap: ["Cloud Architecture", "DevOps", "Microservices"]
              },
              {
                career_name: "UX/UI Designer",
                match_percentage: 75,
                fit_reason: "Your creativity combined with analytical thinking makes UX/UI design a great fit. Your attention to detail and user-focused approach are valuable assets.",
                required_skills: ["Design Tools", "User Research", "Prototyping", "Visual Design"],
                skill_gap: ["Advanced Figma", "Design Systems", "A/B Testing"]
              }
            ]
          };
          navigate('/results', { state: { results: mockResults } });
        }, 3000);
      }
    };

    submitToBackend();
  }, [formData, navigate]);

  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-inner"></div>
        </div>
        
        <h2 className="loading-title">Analyzing Your Career Identity</h2>
        
        <div className="loading-steps">
          <div className="step">
            <span className="step-icon">🧠</span>
            <span>Processing your responses...</span>
          </div>
          <div className="step">
            <span className="step-icon">🤖</span>
            <span>AI matching careers to your profile...</span>
          </div>
          <div className="step">
            <span className="step-icon">📊</span>
            <span>Analyzing skill gaps...</span>
          </div>
        </div>
        
        <p className="loading-subtitle">This will take just a moment</p>
      </div>
    </div>
  );
};

export default Loading;
