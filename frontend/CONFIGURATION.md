# Frontend Configuration Guide

This document explains how to configure the AI Career Identity Finder frontend application.

## Overview

All hardcoded data has been externalized to configuration files for easy customization and maintenance.

## Configuration Files

### 1. Environment Variables (`.env`)

Create a `.env` file in the frontend directory with the following variables:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000

# API Request Timeout (milliseconds)
VITE_API_TIMEOUT=30000
```

**Setup Instructions:**
1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` with your backend server URL
3. Adjust `VITE_API_TIMEOUT` if needed (default: 30 seconds)

### 2. API Configuration (`src/config.js`)

Manages API endpoint configuration. Uses environment variables with fallback defaults.

**Configuration:**
- `BASE_URL`: Backend server URL (from `VITE_API_BASE_URL` env var)
- `TIMEOUT`: Request timeout in milliseconds (from `VITE_API_TIMEOUT` env var)
- `ENDPOINTS.ANALYZE`: Career analysis endpoint path

### 3. Application Constants (`src/constants/appConstants.js`)

Contains all UI text, labels, options, and static content. Organized by component:

#### Landing Page (`APP_CONSTANTS.LANDING`)
- `LOGO_ICON`: Landing page logo emoji
- `TITLE`: Application title
- `DESCRIPTION`: Application description text
- `FEATURES[]`: Array of feature objects with icon and text
- `START_BUTTON`: Start button text
- `TIME_ESTIMATE`: Estimated time text

#### Questionnaire (`APP_CONSTANTS.QUESTIONNAIRE`)
- `TITLE`: Page title
- `SUBTITLE`: Page subtitle
- `INTERESTS`: Interest options and labels
- `STRENGTHS`: Strength options and labels
- `WORK_STYLE`: Work style options and labels
- `RISK_TOLERANCE`: Risk tolerance options and labels
- `SUBJECTS`: Subject options and labels
- `BUTTONS`: Button text labels
- `VALIDATION_MESSAGE`: Form validation message

#### Loading Screen (`APP_CONSTANTS.LOADING`)
- `TITLE`: Loading screen title
- `SUBTITLE`: Loading screen subtitle
- `STEPS[]`: Array of loading step objects with icon and text
- `MIN_LOADING_TIME`: Minimum loading time in milliseconds

#### Results Page (`APP_CONSTANTS.RESULTS`)
- `TITLE`: Results page title
- `SUBTITLE`: Results page subtitle
- `PROFILE_HEADING`: Profile section heading
- `TOP_CAREERS_HEADING`: Careers section heading
- `CAREER_CARD`: Career card labels
- `BUTTONS`: Button text labels
- `NEXT_STEPS`: Next steps section content
- `MATCH_COLOR_THRESHOLDS`: Color coding for match percentages

## Customization Guide

### Changing UI Text

Edit `src/constants/appConstants.js` to modify any visible text:

```javascript
// Example: Change landing page title
LANDING: {
  TITLE: 'Your Custom Title Here',
  // ...
}
```

### Adding/Removing Options

Modify arrays in `APP_CONSTANTS.QUESTIONNAIRE`:

```javascript
// Example: Add new interest option
INTERESTS: {
  OPTIONS: [
    'Technology',
    'Healthcare',
    'Your New Option',  // Add here
    // ...
  ]
}
```

### Changing API Endpoint

Update your `.env` file:

```env
VITE_API_BASE_URL=https://your-production-api.com
```

### Customizing Colors

Match percentage colors can be adjusted in `APP_CONSTANTS.RESULTS.MATCH_COLOR_THRESHOLDS`:

```javascript
MATCH_COLOR_THRESHOLDS: {
  HIGH: { threshold: 80, color: '#10b981' },    // Green for 80%+
  MEDIUM: { threshold: 70, color: '#3b82f6' },  // Blue for 70-79%
  LOW: { threshold: 0, color: '#8b5cf6' }       // Purple for <70%
}
```

## Development vs Production

### Development
- Uses `.env` with local backend URL
- Localhost defaults are provided

### Production
- Set environment variables in your hosting platform
- Example for Vercel/Netlify:
  ```
  VITE_API_BASE_URL=https://api.yourproduction.com
  VITE_API_TIMEOUT=30000
  ```

## Important Notes

1. **Environment Variables**: Always prefix with `VITE_` for Vite to expose them
2. **Restart Dev Server**: After changing `.env`, restart the dev server
3. **No Secrets**: Never put secrets in frontend environment variables (they're public)
4. **Git Ignore**: `.env` is git-ignored; `.env.example` is tracked
5. **Build Time**: Environment variables are embedded at build time

## Migration from Hardcoded Values

All hardcoded data has been removed:
- ✅ UI text and labels → `appConstants.js`
- ✅ API URLs → `.env` + `config.js`
- ✅ Question options → `appConstants.js`
- ✅ Mock data → Removed (now requires backend)
- ✅ Static content → `appConstants.js`

## Troubleshooting

### "Failed to analyze career identity" Error
- Ensure backend server is running
- Check `VITE_API_BASE_URL` is correct
- Verify backend is accessible from frontend

### Changes Not Reflecting
- Restart dev server after `.env` changes
- Clear build cache: `rm -rf dist node_modules/.vite`
- Rebuild: `npm run build`

### Options Not Appearing
- Check `appConstants.js` for typos
- Ensure array structure is maintained
- Verify import statements in components

## Support

For questions or issues with configuration, refer to:
- [Main README](./README.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Quick Start Guide](./QUICKSTART.md)
