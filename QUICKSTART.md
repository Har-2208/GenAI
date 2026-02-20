# 🚀 Quick Start Guide

## Setup & Run (3 Steps)

### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Configure Backend URL (Optional)
Edit `src/config.js` to set your backend API URL:
```javascript
BASE_URL: 'http://localhost:5000'
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

The app will open at **http://localhost:3000** 🎉

---

## 📋 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Welcome page with "Start Assessment" button |
| **Questionnaire** | `/questionnaire` | Multi-section form for user input |
| **Loading** | `/loading` | AI analysis animation |
| **Results** | `/results` | Career recommendations dashboard |

---

## 🎨 Color Theme

```css
Primary: #667eea → #764ba2 (Purple gradient)
Background: #1a1a2e → #16213e (Dark blue)
Cards: rgba(45, 55, 72, 0.6) with backdrop blur
```

---

## 🔗 Backend Integration

Your backend should:

1. **Accept POST** to `/api/analyze`
2. **Receive JSON**:
```json
{
  "interests": ["Technology", "Science"],
  "strengths": ["Analytical Thinking", "Problem Solving"],
  "workStyle": "Independent work",
  "riskTolerance": "Moderate",
  "subjectsLiked": ["Mathematics", "Computer Science"]
}
```

3. **Return JSON**:
```json
{
  "career_identity_summary": "Your profile description...",
  "top_careers": [
    {
      "career_name": "Data Scientist",
      "match_percentage": 87,
      "fit_reason": "Why this fits you...",
      "required_skills": ["Python", "Stats"],
      "skill_gap": ["ML", "SQL"]
    }
  ]
}
```

---

## 🛠️ Troubleshooting

**Port 3000 already in use?**
- Edit `vite.config.js` and change the port number

**CORS errors?**
- Enable CORS on your backend server
- For Express.js: `app.use(cors())`

**Mock data showing?**
- Backend not running → App uses fallback mock data
- Check backend URL in `src/config.js`

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

Deploy to: Vercel, Netlify, GitHub Pages, or any static host.

---

## ✨ Features

✅ Fully responsive design  
✅ Smooth animations & transitions  
✅ Modern glassmorphism UI  
✅ Print-friendly results page  
✅ Mock data for testing  
✅ Clean, maintainable code  

---

**Need help?** Check the main [README.md](README.md) for detailed documentation.
