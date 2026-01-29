import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  duration: string;
  durationCategory: 'short' | 'medium' | 'long';
  url: string;
}

interface SearchResponse {
  short: YouTubeVideo | null;
  medium: YouTubeVideo | null;
  long: YouTubeVideo | null;
}

// Parse ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Format duration for display
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Categorize duration
function categorizeDuration(seconds: number): 'short' | 'medium' | 'long' {
  if (seconds < 240) return 'short'; // Under 4 minutes
  if (seconds <= 1200) return 'medium'; // 4-20 minutes
  return 'long'; // Over 20 minutes
}

// Format view count
function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, subject } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    console.log('API Key present:', !!YOUTUBE_API_KEY, 'Length:', YOUTUBE_API_KEY?.length || 0);
    
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.trim() === '') {
      console.error('YOUTUBE_API_KEY is not configured or empty');
      return new Response(
        JSON.stringify({ error: 'YouTube API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query
    const searchQuery = `${query} ${subject || ''} tutorial explanation`.trim();
    console.log('Searching YouTube for:', searchQuery);

    // Search for videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', searchQuery);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '15');
    searchUrl.searchParams.set('order', 'viewCount');
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error('YouTube search error:', searchData);
      return new Response(
        JSON.stringify({ error: 'YouTube API error', details: searchData.error?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!searchData.items || searchData.items.length === 0) {
      console.log('No videos found');
      return new Response(
        JSON.stringify({ short: null, medium: null, long: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get video IDs
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // Get video details (duration, view count)
    const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    detailsUrl.searchParams.set('part', 'contentDetails,statistics,snippet');
    detailsUrl.searchParams.set('id', videoIds);
    detailsUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsData = await detailsResponse.json();

    if (!detailsResponse.ok) {
      console.error('YouTube details error:', detailsData);
      return new Response(
        JSON.stringify({ error: 'YouTube API error', details: detailsData.error?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process videos and categorize by duration
    const videos: YouTubeVideo[] = detailsData.items.map((item: any) => {
      const durationSeconds = parseDuration(item.contentDetails.duration);
      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        viewCount: formatViewCount(item.statistics.viewCount || '0'),
        duration: formatDuration(durationSeconds),
        durationCategory: categorizeDuration(durationSeconds),
        durationSeconds,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      };
    });

    // Sort each category by view count (already sorted from API, but ensure)
    // Pick the first video from each category
    const result: SearchResponse = {
      short: videos.find(v => v.durationCategory === 'short') || null,
      medium: videos.find(v => v.durationCategory === 'medium') || null,
      long: videos.find(v => v.durationCategory === 'long') || null,
    };

    console.log('Found videos:', {
      short: result.short?.title,
      medium: result.medium?.title,
      long: result.long?.title,
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in youtube-search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
