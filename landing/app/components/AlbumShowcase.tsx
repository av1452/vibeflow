"use client";

import { useEffect, useRef, useState } from "react";

type Album = {
  title: string;
  artist: string;
  artwork: string;
  url: string;
};

const searches = [
  { title: "After Hours", artist: "The Weeknd", term: "The Weeknd After Hours" },
  { title: "Random Access Memories", artist: "Daft Punk", term: "Daft Punk Random Access Memories" },
  { title: "Midnights", artist: "Taylor Swift", term: "Taylor Swift Midnights" },
];

export default function AlbumShowcase() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);


  useEffect(() => {
    let cancelled = false;

    async function loadAlbums() {
      const results = await Promise.all(
        searches.map(async (search) => {
          try {
            const response = await fetch(
              `https://itunes.apple.com/search?term=${encodeURIComponent(search.term)}&entity=album&limit=15&country=us`
            );

            if (!response.ok) return null;

            const data = await response.json();
            const match = data.results?.find(
              (item: { collectionName?: string; artistName?: string }) =>
                item.collectionName?.toLowerCase() === search.title.toLowerCase() &&
                item.artistName?.toLowerCase().includes(search.artist.toLowerCase())
            ) ?? data.results?.[0];

            if (!match?.artworkUrl100) return null;

            return {
              title: match.collectionName || search.title,
              artist: match.artistName || search.artist,
              artwork: match.artworkUrl100.replace(
                /\/100x100bb\.jpg$/,
                "/600x600bb.jpg"
              ),
              url: match.collectionViewUrl || "https://music.apple.com/",
            } as Album;
          } catch {
            return null;
          }
        })
      );

      if (!cancelled) {
        const validAlbums = results.filter((album): album is Album => album !== null);
        setAlbums(validAlbums);
        setActiveIndex(validAlbums.length > 1 ? 1 : 0);
      }
    }

    loadAlbums();

    return () => {
      cancelled = true;
    };
  }, []);

  function move(direction: number) {
    if (albums.length < 2) return;
    setActiveIndex((current) => (current + direction + albums.length) % albums.length);
  }

  function getPosition(index: number) {
    if (index === activeIndex) return "album-front";
    if (index === (activeIndex - 1 + albums.length) % albums.length) {
      return "album-back album-left";
    }
    if (index === (activeIndex + 1) % albums.length) {
      return "album-back album-right";
    }
    return "album-hidden";
  }

  const activeAlbum = albums[activeIndex];

  return (
    <div className="visual">
      <div className="visual-label">
        <span>THE COVER FLOW EXPERIENCE</span>
        <span>
          {String(albums.length ? activeIndex + 1 : 1).padStart(2, "0")} /{" "}
          {String(albums.length || 3).padStart(2, "0")}
        </span>
      </div>

      <div
        className="album-scene"
        aria-label="Album cover carousel"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0].clientX;
          didSwipe.current = false;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;

          const distance = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;

          if (Math.abs(distance) >= 40) {
            didSwipe.current = true;
            move(distance > 0 ? -1 : 1);
          }
        }}
        onClickCapture={(event) => {
          if (didSwipe.current) {
            event.preventDefault();
            event.stopPropagation();
            didSwipe.current = false;
          }
        }}
      >
        {albums.length === 0 ? (
          <p className="album-loading">Loading album artwork…</p>
        ) : (
          albums.map((album, index) => (
            <button
              key={`${album.artist}-${album.title}`}
              type="button"
              className={`album ${getPosition(index)}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Select ${album.title} by ${album.artist}`}
              aria-pressed={index === activeIndex}
              title={`${album.title} — ${album.artist}`}
            >
              <img
                className="album-cover-image"
                src={album.artwork}
                alt={`${album.title} album cover`}
                draggable={false}
              />
            </button>
          ))
        )}
      </div>

      <div className="visual-caption">
        <div>
          <span className="caption-label">NOW IN FOCUS</span>
          <p>
            {activeAlbum
              ? `${activeAlbum.title} — ${activeAlbum.artist}`
              : "Discover your next favorite album."}
          </p>
          {activeAlbum && (
            <a
              className="album-store-link"
              href={activeAlbum.url}
              target="_blank"
              rel="noreferrer"
            >
              View on Apple Music ↗
            </a>
          )}
        </div>

        <div className="visual-arrows">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous album"
            disabled={albums.length < 2}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next album"
            disabled={albums.length < 2}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
