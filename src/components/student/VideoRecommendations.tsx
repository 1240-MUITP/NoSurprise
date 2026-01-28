import { useState, useEffect } from 'react';
import { ExternalLink, Clock, Eye, Loader2, AlertCircle, Play } from 'lucide-react';
import { searchYouTubeVideos, VideoSearchResult, YouTubeVideo } from '@/lib/api/youtube';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoRecommendationsProps {
  query: string;
  chapter: string;
  isOpen: boolean;
}

const VideoCard = ({ video, category }: { video: YouTubeVideo; category: string }) => {
  const categoryColors = {
    short: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    long: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const categoryLabels = {
    short: 'Short',
    medium: 'Medium',
    long: 'Long',
  };

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        {/* Category Badge */}
        <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[video.durationCategory]}`}>
          {categoryLabels[video.durationCategory]}
        </span>

        {/* Title */}
        <h4 className="text-sm font-medium line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h4>

        {/* Channel & Views */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[60%]">{video.channelTitle}</span>
          <span className="flex items-center gap-1 shrink-0">
            <Eye className="w-3 h-3" />
            {video.viewCount}
          </span>
        </div>
      </div>
    </a>
  );
};

const VideoSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border/50">
    <AspectRatio ratio={16 / 9}>
      <Skeleton className="w-full h-full" />
    </AspectRatio>
    <div className="p-3 space-y-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export const VideoRecommendations = ({ query, chapter, isOpen }: VideoRecommendationsProps) => {
  const [videos, setVideos] = useState<VideoSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use chapter as subject context
        const result = await searchYouTubeVideos(chapter, query);
        setVideos(result);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, chapter, isOpen]);

  if (!isOpen) return null;

  // Loading state
  if (loading) {
    return (
      <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm font-medium">Finding related videos...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <VideoSkeleton />
          <VideoSkeleton />
          <VideoSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Couldn't load videos</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  // No videos found
  const hasVideos = videos && (videos.short || videos.medium || videos.long);
  if (!hasVideos) {
    return (
      <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/50">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No related videos found for this topic.</p>
        </div>
      </div>
    );
  }

  // Render videos
  const videoList = [
    videos.short,
    videos.medium,
    videos.long,
  ].filter(Boolean) as YouTubeVideo[];

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          Related Videos
        </h4>
        <span className="text-xs text-muted-foreground">
          {videoList.length} video{videoList.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {videos.short && <VideoCard video={videos.short} category="short" />}
        {videos.medium && <VideoCard video={videos.medium} category="medium" />}
        {videos.long && <VideoCard video={videos.long} category="long" />}
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Click any video to watch on YouTube
      </p>
    </div>
  );
};
