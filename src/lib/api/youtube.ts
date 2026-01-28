import { supabase } from "@/integrations/supabase/client";

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  duration: string;
  durationCategory: 'short' | 'medium' | 'long';
  url: string;
}

export interface VideoSearchResult {
  short: YouTubeVideo | null;
  medium: YouTubeVideo | null;
  long: YouTubeVideo | null;
}

interface CachedResult {
  data: VideoSearchResult;
  timestamp: number;
}

const CACHE_KEY_PREFIX = 'youtube_videos_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Generate cache key from query
function getCacheKey(query: string, subject?: string): string {
  const normalized = `${query}_${subject || ''}`.toLowerCase().replace(/\s+/g, '_');
  return `${CACHE_KEY_PREFIX}${normalized}`;
}

// Check if cached data is still valid
function getCachedResult(cacheKey: string): VideoSearchResult | null {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const parsed: CachedResult = JSON.parse(cached);
    const now = Date.now();

    if (now - parsed.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

// Save result to cache
function setCachedResult(cacheKey: string, data: VideoSearchResult): void {
  try {
    const cacheData: CachedResult = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache YouTube results:', error);
  }
}

// Search for YouTube videos related to a topic
export async function searchYouTubeVideos(
  query: string,
  subject?: string
): Promise<VideoSearchResult> {
  const cacheKey = getCacheKey(query, subject);

  // Check cache first
  const cached = getCachedResult(cacheKey);
  if (cached) {
    console.log('Using cached YouTube results for:', query);
    return cached;
  }

  console.log('Fetching YouTube videos for:', query);

  try {
    const { data, error } = await supabase.functions.invoke('youtube-search', {
      body: { query, subject },
    });

    if (error) {
      console.error('YouTube search error:', error);
      throw new Error(error.message || 'Failed to search YouTube');
    }

    const result: VideoSearchResult = {
      short: data?.short || null,
      medium: data?.medium || null,
      long: data?.long || null,
    };

    // Cache the result
    setCachedResult(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    throw error;
  }
}

// Clear all YouTube video cache
export function clearYouTubeCache(): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log('Cleared YouTube cache:', keysToRemove.length, 'entries');
}
