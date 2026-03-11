# Frontend API Endpoints Documentation

## Overview
The frontend now includes a comprehensive API service layer with multiple endpoints for enhanced functionality.

## Available Endpoints

### 1. Career Analysis
**POST** `/api/analyze`
- Analyzes user questionnaire responses
- Returns career matches with skill gaps
- **Request Body:**
  ```json
  {
    "interests": ["Technology", "Science"],
    "strengths": ["Analytical Thinking", "Problem Solving"],
    "workStyle": "Independent work",
    "riskTolerance": "Moderate - I can handle some uncertainty",
    "subjectsLiked": ["Mathematics", "Computer Science"]
  }
  ```
- **Response:**
  ```json
  {
    "career_identity_summary": "Your profile analysis...",
    "top_careers": [...]
  }
  ```

### 2. Health Check
**GET** `/api/health`
- Checks backend server status
- Used for connection monitoring
- **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-03-10T12:00:00Z"
  }
  ```

### 3. Save Results
**POST** `/api/results/save`
- Saves career analysis results
- Returns unique ID for sharing
- **Request Body:**
  ```json
  {
    "career_identity_summary": "...",
    "top_careers": [...],
    "timestamp": "2026-03-10T12:00:00Z"
  }
  ```
- **Response:**
  ```json
  {
    "id": "abc123xyz",
    "message": "Results saved successfully"
  }
  ```

### 4. Get Results
**GET** `/api/results/:id`
- Retrieves saved results by ID
- Used for sharing results
- **Response:**
  ```json
  {
    "id": "abc123xyz",
    "career_identity_summary": "...",
    "top_careers": [...],
    "created_at": "2026-03-10T12:00:00Z"
  }
  ```

### 5. Submit Feedback
**POST** `/api/feedback`
- Submits user feedback
- Helps improve the service
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Great experience!",
    "resultId": "abc123xyz",
    "timestamp": "2026-03-10T12:00:00Z"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Feedback submitted successfully"
  }
  ```

### 6. Track Analytics
**POST** `/api/analytics/track`
- Tracks user events for analytics
- Fire-and-forget (no response needed)
- **Request Body:**
  ```json
  {
    "event": "questionnaire_submitted",
    "timestamp": "2026-03-10T12:00:00Z"
  }
  ```

## API Service Usage

### In Components

```javascript
import apiService from '../services/api';

// Analyze career
const result = await apiService.analyzeCareer(formData);
if (result.success) {
  // Handle success
} else {
  // Handle error: result.error
}

// Check health
const health = await apiService.checkHealth();

// Save results
const saved = await apiService.saveResults(results);

// Get results
const retrieved = await apiService.getResults('abc123');

// Submit feedback
const feedback = await apiService.submitFeedback({
  rating: 5,
  comment: "Great!"
});

// Track event
await apiService.trackEvent({
  event: 'button_clicked'
});
```

### Using Custom Hooks

```javascript
import { 
  useHealthCheck, 
  useSaveResults, 
  useSubmitFeedback,
  useAnalytics 
} from '../hooks/useApi';

// Health check
const { isHealthy, checkHealth } = useHealthCheck(true);

// Save results
const { saveResults, isSaving, savedId } = useSaveResults();

// Submit feedback
const { submitFeedback, isSubmitting, submitted } = useSubmitFeedback();

// Track events
const { trackEvent } = useAnalytics();
trackEvent('page_viewed');
```

## Features

### Error Handling
- Automatic retry for server errors (3 attempts)
- Detailed error messages
- Status code tracking

### Request Management
- Configurable timeout (default: 30s)
- Request/response interceptors
- Performance logging

### Analytics
- Automatic event tracking
- User journey monitoring
- Silent failure for non-critical events

## Configuration

Set environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

## Components Using API

1. **Loading.jsx** - Career analysis
2. **Results.jsx** - Save/share results, feedback
3. **HealthCheck.jsx** - Backend health monitoring
4. **FeedbackModal.jsx** - User feedback submission

## New Features

### Save & Share Results
- Save results to get shareable link
- Share on social media (Twitter, LinkedIn)
- Copy link to clipboard

### Feedback System
- 5-star rating
- Optional comments
- Linked to specific results

### Health Monitoring
- Real-time server status
- Auto-reconnect on failure
- Visual indicator in bottom-right

## Backend Requirements

Your backend should implement these endpoints. Example response formats are provided above.

### CORS Configuration
```javascript
// Allow frontend origin
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Error Responses
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Testing

Test endpoints individually:

```bash
# Health check
curl http://localhost:5000/api/health

# Analyze (requires POST data)
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"interests": ["Technology"], ...}'
```

## Troubleshooting

### "Server Disconnected"
- Ensure backend is running on correct port
- Check CORS configuration
- Verify firewall settings

### "Failed to save results"
- Check backend logging
- Verify database connection
- Ensure endpoint is implemented

### Analytics not working
- Analytics failures are silent by design
- Check browser console for errors
- Verify endpoint exists (optional)
