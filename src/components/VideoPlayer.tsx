interface VideoPlayerProps {
  url: string;
  title: string;
}

function getEmbedUrl(url: string): { embedUrl: string; isVertical: boolean } {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`, isVertical: false };

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttMatch) return { embedUrl: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`, isVertical: true };

  return { embedUrl: url, isVertical: false };
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const { embedUrl, isVertical } = getEmbedUrl(url);

  return (
    <div className={`w-full rounded-lg overflow-hidden border border-border bg-card ${isVertical ? 'max-w-sm mx-auto aspect-[9/16]' : 'aspect-video'}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
