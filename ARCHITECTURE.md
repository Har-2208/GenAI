# 🏗️ Project Architecture

## Component Hierarchy

```
App (Router)
│
├── Landing Page (/)
│   └── Start Assessment Button → Navigate to Questionnaire
│
├── Questionnaire (/questionnaire)
│   ├── Interests Section (multi-select)
│   ├── Strengths Section (multi-select)
│   ├── Work Style Section (dropdown)
│   ├── Risk Tolerance Section (dropdown)
│   ├── Subjects Section (multi-select)
│   └── Submit Button → Navigate to Loading
│
├── Loading (/loading)
│   ├── Spinner Animation
│   ├── Status Messages
│   ├── API Call to Backend
│   └── Auto-navigate to Results
│
└── Results (/results)
    ├── Career Identity Summary
    ├── Top 3 Career Cards
    │   ├── Match Percentage
    │   ├── Fit Reason
    │   ├── Required Skills
    │   └── Skill Gaps
    ├── Action Buttons
    └── Next Steps Section
```

## Data Flow

```
1. User Input (Questionnaire)
   ↓
2. Form Data Collection (React State)
   ↓
3. Navigation to Loading (with state)
   ↓
4. API POST Request (Axios)
   ↓
5. Backend Processing (External)
   ↓
6. JSON Response
   ↓
7. Navigation to Results (with data)
   ↓
8. Dynamic Rendering (Results Dashboard)
```

## File Structure

```
frontend/
│
├── public/
│   └── (static assets)
│
├── src/
│   ├── components/
│   │   ├── Landing.jsx ────────── Landing page component
│   │   ├── Landing.css ────────── Landing page styles
│   │   ├── Questionnaire.jsx ──── Form component
│   │   ├── Questionnaire.css ──── Form styles
│   │   ├── Loading.jsx ────────── Loading animation component
│   │   ├── Loading.css ────────── Loading styles
│   │   ├── Results.jsx ────────── Results display component
│   │   └── Results.css ────────── Results styles
│   │
│   ├── App.jsx ─────────────────── Main app with routing
│   ├── App.css ─────────────────── App-level styles
│   ├── main.jsx ────────────────── Entry point
│   ├── index.css ───────────────── Global styles & theme
│   └── config.js ───────────────── API configuration
│
├── index.html ──────────────────── HTML template
├── vite.config.js ──────────────── Vite configuration
├── package.json ────────────────── Dependencies
├── .gitignore ──────────────────── Git ignore rules
├── README.md ───────────────────── Main documentation
├── QUICKSTART.md ───────────────── Quick start guide
└── ARCHITECTURE.md ─────────────── This file
```

## State Management

### Questionnaire State
```javascript
{
  interests: [],        // Array of selected interests
  strengths: [],        // Array of selected strengths
  workStyle: '',        // String: selected work style
  riskTolerance: '',    // String: selected risk level
  subjectsLiked: []     // Array of liked subjects
}
```

### Results State
```javascript
{
  career_identity_summary: 'string',
  top_careers: [
    {
      career_name: 'string',
      match_percentage: number,
      fit_reason: 'string',
      required_skills: ['string'],
      skill_gap: ['string']
    }
  ]
}
```

## Routing Configuration

| Route | Component | Protected | State Required |
|-------|-----------|-----------|----------------|
| `/` | Landing | ❌ | ❌ |
| `/questionnaire` | Questionnaire | ❌ | ❌ |
| `/loading` | Loading | ✅ | ✅ formData |
| `/results` | Results | ✅ | ✅ results |

*Protected routes redirect to home if required state is missing*

## API Integration

### Endpoint
```
POST /api/analyze
```

### Request Body
```json
{
  "interests": ["Technology", "Science"],
  "strengths": ["Analytical Thinking"],
  "workStyle": "Independent work",
  "riskTolerance": "Moderate",
  "subjectsLiked": ["Computer Science"]
}
```

### Response Format
```json
{
  "career_identity_summary": "string",
  "top_careers": [...]
}
```

## Styling Architecture

### Theme Variables (index.css)
```css
--primary-dark: #1a1a2e
--primary-blue: #16213e
--accent-purple: #7b2cbf
--accent-blue: #5a67d8
--text-light: #f8f9fa
--text-gray: #cbd5e0
--card-bg: #2d3748
--hover-bg: #4a5568
```

### Design Patterns
- **Glassmorphism**: Cards with backdrop-blur
- **Gradient Accents**: Purple-blue gradients for CTAs
- **Smooth Animations**: Fade-in, slide-up, bounce
- **Responsive Grid**: Auto-fit columns
- **Hover Effects**: Transform + shadow changes

## Dependencies

### Production
- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP requests

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite

## Build & Deployment

### Development
```bash
npm run dev
```
Starts dev server with hot reload at localhost:3000

### Production Build
```bash
npm run build
```
Creates optimized bundle in `dist/` folder

### Preview Production
```bash
npm run preview
```
Preview production build locally

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Optimizations

1. **Lazy Loading**: Components load as needed
2. **Code Splitting**: Vite automatic splitting
3. **CSS Modules**: Scoped styles per component
4. **Minimum Bundle**: Only required dependencies
5. **Optimized Images**: Use SVG where possible

## Security Considerations

- ✅ No sensitive data in frontend
- ✅ API calls through config file
- ✅ Form validation before submission
- ✅ Protected routes prevent unauthorized access
- ⚠️ Backend should validate all inputs
- ⚠️ Backend should implement rate limiting

## Future Enhancements

- [ ] Add user authentication
- [ ] Save results to database
- [ ] Email results to user
- [ ] Social sharing functionality
- [ ] Comparison feature for multiple assessments
- [ ] PDF export of results
- [ ] Multi-language support
- [ ] Accessibility improvements (ARIA labels)
- [ ] Analytics integration

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Framework**: React 18 + Vite 5
