"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const API_KEY = "AIzaSyBguMOPjUFnVJwkZFmTs0PX-I4LJ7SvGLs"; // Replace with your actual API key

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
      setVideos([]); // Reset videos when search term changes
      setNextPageToken(null); // Reset pagination
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchVideos = async (loadMore = false) => {
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
          fetchVideos(true); // Load more videos when bottom is reached
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken]);

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      {/* YouTube Videos Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id.videoId} className="w-full p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.id.videoId}?modestbranding=1&rel=0&controls=1&showinfo=0`}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {video.snippet.title}
            </h3>
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
