

# YouTube Video Recommendations Feature

## Overview
Add a video icon next to each question that, when clicked, displays 3 relevant YouTube videos based on the question's topic - categorized by duration (Short/YouTube Shorts, Medium, Long).

## User Experience Flow

```text
┌─────────────────────────────────────────────────────────┐
│  Question Card                                          │
│  ┌─────┐                                                │
│  │  1  │  Explain conservation of momentum...           │
│  └─────┘                                    [🎬 icon]   │
│                                                  │      │
│                                                  ▼      │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Related Videos                           │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐            │   │
│  │  │ SHORT  │  │ MEDIUM │  │  LONG  │            │   │
│  │  │ <1min  │  │ 5-10min│  │ 15min+ │            │   │
│  │  └────────┘  └────────┘  └────────┘            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Set Up YouTube API Integration
- Create a Supabase Edge Function `youtube-search` to securely call YouTube Data API v3
- User will need to provide a YouTube Data API key (free tier: 10,000 units/day)

### Step 2: Backend Edge Function
The edge function will:
- Accept a search query (derived from question topic/chapter)
- Call YouTube Data API with search parameters
- Filter results by duration:
  - **Short**: Under 4 minutes (includes YouTube Shorts)
  - **Medium**: 4-20 minutes  
  - **Long**: Over 20 minutes
- Sort by view count (popularity)
- Return top video from each category

### Step 3: Frontend UI Changes

**Add to QuestionCard component:**
- A video icon (Film/Video lucide icon) in the question header
- A Popover/Dialog that opens on click showing:
  - Loading state while fetching
  - 3 video cards with thumbnails, titles, and duration badges
  - Direct YouTube links that open in new tab

**Video Card Display:**
- Thumbnail image
- Video title (truncated)
- Channel name
- View count
- Duration badge (color-coded: blue for short, yellow for medium, purple for long)

### Step 4: Caching Strategy
- Cache video results in localStorage by topic to reduce API calls
- Cache expiry: 24 hours

## Technical Details

### New Files to Create:
1. `supabase/functions/youtube-search/index.ts` - Edge function for YouTube API
2. `src/lib/api/youtube.ts` - Frontend API client
3. `src/components/student/VideoRecommendations.tsx` - Video display component

### Files to Modify:
1. `src/components/student/StudentPractice.tsx` - Add video icon to QuestionCard

### Required Secret:
- `YOUTUBE_API_KEY` - YouTube Data API v3 key (free from Google Cloud Console)

### API Request Structure:
```
Search Query: "{chapter} {question keywords} physics/chemistry/etc tutorial"
Parameters:
- part: snippet
- type: video
- maxResults: 10
- order: viewCount
- videoDuration: short/medium/long
```

## Estimated Changes
- ~150 lines for edge function
- ~100 lines for API client
- ~150 lines for VideoRecommendations component
- ~30 lines modification to QuestionCard

