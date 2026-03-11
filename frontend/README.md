# AI Career Identity Finder - Frontend

A modern React-based web application that helps users discover their ideal career paths through AI-powered analysis.

## 🎯 Features

- **Landing Page**: Welcoming interface with project overview
- **Questionnaire**: Structured form collecting:
  - Interests (multi-select)
  - Strengths (multi-select)
  - Work style preferences
  - Risk tolerance
  - Subject preferences
- **Loading Screen**: Animated loading with AI analysis status
- **Results Dashboard**: Displays:
  - Career identity summary
  - Top 3 career recommendations
  - Match percentages
  - Skill requirements
  - Skill gaps
  - Next steps guidance

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP requests
- **Vite** - Build tool
- **CSS3** - Styling with modern gradients and animations

## 📦 Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🚀 Running the Application

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Open browser**: The app will automatically open at `http://localhost:3000`

## 🔧 Configuration

### Backend API Endpoint

Update the API endpoint in `src/components/Loading.jsx`:

```javascript
const API_URL = 'http://localhost:5000/api/analyze';
```

Change this to match your backend server URL.

### Expected Backend Response Format

The backend should return JSON in this format:

```json
{
  "career_identity_summary": "You are analytical and independent...",
  "top_careers": [
    {
      "career_name": "Data Scientist",
      "match_percentage": 87,
      "fit_reason": "Strong analytical alignment...",
      "required_skills": ["Python", "Statistics"],
      "skill_gap": ["Advanced ML", "SQL"]
    }
  ]
}
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Landing.jsx          # Landing page
│   │   ├── Landing.css
│   │   ├── Questionnaire.jsx    # Assessment form
│   │   ├── Questionnaire.css
│   │   ├── Loading.jsx          # Loading screen
│   │   ├── Loading.css
│   │   ├── Results.jsx          # Results dashboard
│   │   └── Results.css
│   ├── App.jsx                  # Main router
│   ├── App.css
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design Theme

- **Color Scheme**: Dark blue/purple gradient theme
- **Primary**: #667eea (Blue) → #764ba2 (Purple)
- **Background**: #1a1a2e (Dark) → #16213e (Blue-dark)
- **Cards**: Glassmorphism effect with backdrop blur
- **Animations**: Smooth transitions and hover effects

## 🌐 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Mock Data

The app includes mock data for development/testing when the backend is unavailable. See `src/components/Loading.jsx` for the mock response structure.

## 🔄 Integration with Backend

To connect with your backend:

1. Ensure your backend API is running
2. Update the `API_URL` in `Loading.jsx`
3. Ensure CORS is enabled on your backend
4. Backend should accept POST requests with form data
5. Backend should return the expected JSON format

## 🎯 User Flow

1. User lands on homepage → clicks "Start Assessment"
2. Fills out questionnaire → submits form
3. Loading screen shows while AI analyzes
4. Results page displays personalized career recommendations
5. User can print results or retake assessment

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🖨️ Print Functionality

Users can print their results directly from the results page. The print stylesheet hides navigation buttons for a clean printout.

## 🚀 Deployment

Build for production:

```bash
npm run build
```

The `dist/` folder will contain production-ready files that can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 📄 License

This project is part of a hackathon submission.

---

Made with ❤️ for AI Career Identity Finder
