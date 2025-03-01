"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
  };
}

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const [debouncedQuery, setDebouncedQuery] = useState(searchTerm);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      setVideos([]);
      setNextPageToken(null);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchVideos = async (loadMore = false) => {
    if (!API_KEY) {
      console.error("API key is missing.");
      return;
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedQuery}&type=video&key=${API_KEY}&maxResults=10${
        nextPageToken && loadMore ? `&pageToken=${nextPageToken}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();

      setVideos((prev) => (loadMore ? [...prev, ...data.items] : data.items));
      setNextPageToken(data.nextPageToken || null);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  useEffect(() => {
    if (debouncedQuery) fetchVideos(false);
  }, [debouncedQuery]);

  useEffect(() => {
    if (!loaderRef.current || !nextPageToken) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchVideos(true);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken]);

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 px-4 md:px-10 lg:px-16">
      {/* YouTube Videos Section */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {videos.map((video) => (
          <div key={video.id.videoId} className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.id.videoId}?modestbranding=1&rel=0&controls=1&showinfo=0`}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover"
            ></iframe>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {video.snippet.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Loader Element for Infinite Scroll */}
      <div ref={loaderRef} className="h-10 w-full flex justify-center items-center">
        {nextPageToken && <p className="text-gray-500 dark:text-gray-400">Loading more videos...</p>}
      </div>
    </section>
  );
}