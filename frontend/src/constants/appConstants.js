// Application Constants and Static Content
// All UI text, options, and static data should be configured here

export const APP_CONSTANTS = {
  // Landing Page Content
  LANDING: {
    LOGO_ICON: '🎯',
    TITLE: 'AI Career Identity Finder',
    DESCRIPTION: 'Discover your perfect career path through AI-powered analysis of your personality traits, interests, and strengths. Get personalized career recommendations with detailed skill gap analysis.',
    FEATURES: [
      {
        icon: '📊',
        text: 'Comprehensive Personality Assessment'
      },
      {
        icon: '🤖',
        text: 'AI-Powered Career Matching'
      },
      {
        icon: '📈',
        text: 'Skill Gap Analysis'
      }
    ],
    START_BUTTON: 'Start Assessment',
    TIME_ESTIMATE: '⏱️ Takes 5-7 minutes'
  },

  // Questionnaire Options
  QUESTIONNAIRE: {
    TITLE: '🎯 Career Identity Assessment',
    SUBTITLE: 'Answer these questions to discover your ideal career path',
    
    INTERESTS: {
      LABEL: 'What are your main interests?',
      HELPER_TEXT: 'Select at least 2-3',
      OPTIONS: [
        'Technology', 'Healthcare', 'Business', 'Arts & Design', 
        'Science', 'Education', 'Finance', 'Marketing', 
        'Engineering', 'Social Work', 'Law', 'Media'
      ]
    },
    
    STRENGTHS: {
      LABEL: 'What are your key strengths?',
      HELPER_TEXT: 'Select at least 2-3',
      OPTIONS: [
        'Analytical Thinking', 'Creativity', 'Leadership', 'Communication',
        'Problem Solving', 'Teamwork', 'Technical Skills', 'Attention to Detail',
        'Adaptability', 'Time Management', 'Critical Thinking', 'Empathy'
      ]
    },
    
    WORK_STYLE: {
      LABEL: 'Preferred work style?',
      PLACEHOLDER: 'Select your preference',
      OPTIONS: [
        'Independent work', 'Team collaboration', 'Mix of both', 
        'Remote work', 'Office environment', 'Field work'
      ]
    },
    
    RISK_TOLERANCE: {
      LABEL: 'Risk tolerance level?',
      PLACEHOLDER: 'Select your risk tolerance',
      OPTIONS: [
        'Very Low - I prefer stability and security',
        'Low - I prefer predictability with minimal risk',
        'Moderate - I can handle some uncertainty',
        'High - I embrace challenges and change',
        'Very High - I thrive in unpredictable environments'
      ]
    },
    
    SUBJECTS: {
      LABEL: 'Which subjects do you enjoy?',
      HELPER_TEXT: 'Select at least 2-3',
      OPTIONS: [
        'Mathematics', 'Science', 'Literature', 'History',
        'Computer Science', 'Psychology', 'Economics', 'Art',
        'Biology', 'Physics', 'Chemistry', 'Philosophy'
      ]
    },
    
    BUTTONS: {
      BACK: '← Back',
      SUBMIT: 'Analyze My Career Identity →'
    },
    
    VALIDATION_MESSAGE: 'Please complete all fields before submitting'
  },

  // Loading Page Content
  LOADING: {
    TITLE: 'Analyzing Your Career Identity',
    SUBTITLE: 'This will take just a moment',
    STEPS: [
      {
        icon: '🧠',
        text: 'Processing your responses...'
      },
      {
        icon: '🤖',
        text: 'AI matching careers to your profile...'
      },
      {
        icon: '📊',
        text: 'Analyzing skill gaps...'
      }
    ],
    MIN_LOADING_TIME: 2000 // milliseconds
  },

  // Results Page Content
  RESULTS: {
    TITLE: '🎯 Your Career Identity Profile',
    SUBTITLE: 'Based on your responses, here are your personalized career recommendations',
    PROFILE_HEADING: 'Your Profile',
    TOP_CAREERS_HEADING: 'Top Career Matches',
    
    CAREER_CARD: {
      WHY_IT_FITS: 'Why It Fits',
      REQUIRED_SKILLS: 'Required Skills',
      SKILLS_TO_DEVELOP: 'Skills to Develop'
    },
    
    BUTTONS: {
      BACK_HOME: '← Back to Home',
      RETAKE: 'Take Assessment Again',
      PRINT: 'Print Results 🖨️'
    },
    
    NEXT_STEPS: {
      TITLE: '📚 Next Steps',
      STEPS: [
        {
          number: '1',
          title: 'Research Careers',
          description: 'Explore job descriptions, salary ranges, and growth prospects for your matched careers'
        },
        {
          number: '2',
          title: 'Develop Skills',
          description: 'Focus on closing the skill gaps identified in your results through courses or projects'
        },
        {
          number: '3',
          title: 'Network & Connect',
          description: 'Reach out to professionals in these fields to learn about their experiences'
        }
      ]
    },
    
    MATCH_COLOR_THRESHOLDS: {
      HIGH: { threshold: 80, color: '#10b981' },
      MEDIUM: { threshold: 70, color: '#3b82f6' },
      LOW: { threshold: 0, color: '#8b5cf6' }
    }
  }
};

export default APP_CONSTANTS;
