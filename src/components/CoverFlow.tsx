"use client";

import { useState } from "react";
import { searchAppleAlbums, type ITunesAlbum } from "@/lib/itunes";

type Album = {
  id: number | string;
  title: string;
  artist: string;
  colors: [string, string];
  artworkUrl?: string;
  appleMusicUrl?: string;
};

const demoAlbums: Album[] = [
  { id: "demo-1", title: "Midnight Drive", artist: "Demo Artist", colors: ["#ff512f", "#7b2ff7"] },
  { id: "demo-2", title: "Electric Dreams", artist: "Demo Artist", colors: ["#00c6ff", "#0072ff"] },
  { id: "demo-3", title: "After Hours", artist: "Demo Artist", colors: ["#f953c6", "#b91d73"] },
  { id: "demo-4", title: "Summer Nights", artist: "Demo Artist", colors: ["#f7971e", "#ffd200"] },
  { id: "demo-5", title: "Neon City", artist: "Demo Artist", colors: ["#11998e", "#38ef7d"] },
  { id: "demo-6", title: "Blue Horizon", artist: "Demo Artist", colors: ["#396afc", "#2948ff"] },
];

const colors: [string, string][] = [
  ["#ff512f", "#7b2ff7"],
  ["#00c6ff", "#0072ff"],
  ["#f953c6", "#b91d73"],
  ["#f7971e", "#ffd200"],
  ["#11998e", "#38ef7d"],
  ["#396afc", "#2948ff"],
];

export default function CoverFlow() {
  const [albums, setAlbums] = useState<Album[]>(demoAlbums);
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const term = query.trim();
    if (!term) return;

    setLoading(true);
    setError("");

    try {
      const results: ITunesAlbum[] = await searchAppleAlbums(term);

      const uniqueAlbums = Array.from(
        new Map(
          results.map((album) => [album.collectionId, album])
        ).values()
      );

      const formattedAlbums: Album[] = uniqueAlbums.map((album, index) => ({
        id: album.collectionId,
        title: album.collectionName,
        artist: album.artistName,
        colors: colors[index % colors.length],
        artworkUrl: album.artworkUrl100?.replace(
          "100x100bb",
          "600x600bb"
        ),
        appleMusicUrl: album.collectionViewUrl,
      }));

      if (formattedAlbums.length === 0) {
        setError("No albums found. Try another artist or search.");
        return;
      }

      setAlbums(formattedAlbums);
      setSelected(0);
    } catch {
      setError("Couldn't load Apple's catalog. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function move(direction: number) {
    setSelected(
      (current) => (current + direction + albums.length) % albums.length
    );
  }

  const currentAlbum = albums[selected];

  return (
    <section className="coverflow">
      <p
        className="eyebrow"
        style={{ marginBottom: 24, textAlign: "center" }}
      >
        YOUR COLLECTION
      </p>

      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: 10,
          maxWidth: 520,
          margin: "24px auto 44px",
          padding: "0 16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search albums or artists..."
          aria-label="Search Apple's album catalog"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px 16px",
            borderRadius: 999,
            border: "1px solid #ffffff30",
            background: "#ffffff0c",
            color: "inherit",
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p role="status" style={{ textAlign: "center", marginBottom: 20 }}>
          {error}
        </p>
      )}

      <div className="coverflow-stage">
        {albums.map((album, index) => {
          let offset = index - selected;

          if (offset > albums.length / 2) offset -= albums.length;
          if (offset < -albums.length / 2) offset += albums.length;

          const active = offset === 0;

          return (
            <button
              key={album.id}
              className={`album-card ${active ? "active" : ""}`}
              style={{
                transform: `translateX(${offset * 145}px) rotateY(${
                  offset === 0 ? 0 : offset > 0 ? -55 : 55
                }deg) scale(${active ? 1 : 0.8})`,
                zIndex: 20 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
              }}
              onClick={() => {
                if (!active) setSelected(index);
              }}
              aria-label={`Select album ${album.title}`}
              aria-pressed={active}
            >
              <span
                className="album-art"
                style={{
                  background: album.artworkUrl
                    ? `url("${album.artworkUrl}") center / cover`
                    : `linear-gradient(145deg, ${album.colors[0]}, ${album.colors[1]})`,
                }}
              >
                {!album.artworkUrl && <span className="art-orb" />}
                <span className="art-title">{album.title}</span>
                <span className="art-artist">{album.artist}</span>
              </span>

              <span className="album-reflection" />
            </button>
          );
        })}
      </div>

      <div className="album-details">
        <h1>{currentAlbum.title}</h1>
        <p>{currentAlbum.artist}</p>
      </div>

      {currentAlbum.appleMusicUrl && (
        <p style={{ textAlign: "center", marginTop: 16 }}>
          <a
            href={currentAlbum.appleMusicUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Open in Apple Music ↗
          </a>
        </p>
      )}

      <div className="coverflow-controls">
        <button onClick={() => move(-1)} aria-label="Previous album">
          ‹
        </button>

        <span>
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(albums.length).padStart(2, "0")}
        </span>

        <button onClick={() => move(1)} aria-label="Next album">
          ›
        </button>
      </div>

      <p className="browse-hint">SELECT AN ALBUM TO EXPLORE</p>
    </section>
  );
}
