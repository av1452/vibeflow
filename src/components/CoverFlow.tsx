"use client";

import { useRef, useState } from "react";
import { searchAppleCatalog, type ITunesTrack } from "@/lib/itunes";

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  artworkUrl?: string;
  embedUrl?: string;
};

function makeEmbedUrl(trackUrl?: string) {
  if (!trackUrl) return undefined;

  try {
    const url = new URL(trackUrl);

    if (
      url.hostname !== "music.apple.com" &&
      url.hostname !== "itunes.apple.com"
    ) {
      return undefined;
    }

    url.hostname = "embed.music.apple.com";
    return url.toString();
  } catch {
    return undefined;
  }
}

export default function CoverFlow() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selected, setSelected] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastSwipeAt = useRef(0);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;

    setLoading(true);
    setError("");

    try {
      const results: ITunesTrack[] = await searchAppleCatalog(term);

      const formattedSongs: Song[] = results.map((track) => ({
        id: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        artworkUrl: track.artworkUrl100?.replace(
          "100x100bb",
          "600x600bb"
        ),
        embedUrl: makeEmbedUrl(track.trackViewUrl),
      }));

      if (!formattedSongs.length) {
        setError("No songs found. Try another search.");
        return;
      }

      setSongs(formattedSongs);
      setSelected(0);
      setPlayerOpen(false);
    } catch {
      setError("Couldn't load Apple's catalog. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function selectSong(index: number) {
    if (Date.now() - lastSwipeAt.current < 500) return;

    if (index === selected) {
      setPlayerOpen(true);
    } else {
      setSelected(index);
      setPlayerOpen(true);
    }
  }

  function move(direction: number) {
    if (!songs.length) return;

    setSelected(
      (current) => (current + direction + songs.length) % songs.length
    );
    setPlayerOpen(false);
  }


  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.target instanceof Element &&
      event.target.closest(".album-player-panel")
    ) {
      pointerStart.current = null;
      return;
    }

    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;

    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      lastSwipeAt.current = Date.now();
      move(deltaX < 0 ? 1 : -1);
    }
  }

  const currentSong = songs[selected];

  return (
    <section className="coverflow">
      <p className="eyebrow" style={{ textAlign: "center", marginBottom: 24 }}>
        YOUR MUSIC
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
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);

            if (!value.trim()) {
              setSongs([]);
              setSelected(0);
              setPlayerOpen(false);
              setError("");
            }
          }}
          placeholder="Search songs or artists..."
          aria-label="Search songs or artists"
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

      {currentSong ? (
        <>
          <div
            className={`coverflow-stage ${playerOpen ? "player-open" : ""}`}
            style={{ touchAction: "pan-y" }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            {songs.map((song, index) => {
              let offset = index - selected;
              if (offset > songs.length / 2) offset -= songs.length;
              if (offset < -songs.length / 2) offset += songs.length;

              const active = offset === 0;

              return (
                <div
                  key={song.id}
                  className={`album-card ${active ? "active" : ""} ${
                    active && playerOpen ? "player-active" : ""
                  }`}
                  style={{
                    width: "min(340px, 72vw)",
                    height: "min(340px, 72vw)",
                    position: "absolute",
                    transform: `translateX(${offset * 195}px) rotateY(${
                      offset === 0 ? 0 : offset > 0 ? -45 : 45
                    }deg) scale(${active ? 1 : 0.82})`,
                    transition:
                      "transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease",
                    zIndex: 20 - Math.abs(offset),
                    opacity: Math.abs(offset) > 2 ? 0 : 1,
                    pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
                  }}
                >
                  <div className="album-crossfade">
                    <button
                      type="button"
                      className="album-artwork-panel"
                      onClick={() => selectSong(index)}
                      aria-label={`Open player for ${song.title} by ${song.artist}`}
                      tabIndex={active && !playerOpen ? 0 : -1}
                    >
                      <span
                        className="album-art"
                        style={{
                          background: song.artworkUrl
                            ? `url("${song.artworkUrl}") center / cover`
                            : "linear-gradient(145deg, #396afc, #2948ff)",
                        }}
                      >
                        <span className="art-title">{song.title}</span>
                        <span className="art-artist">{song.artist}</span>
                      </span>
                    </button>

                    <div
                      className="album-player-panel"
                      aria-hidden={!active || !playerOpen}
                    >
                      <div className="player-card-heading">
                        <span className="player-card-label">NOW PLAYING</span>
                        <button
                          type="button"
                          className="cover-return"
                          onClick={() => setPlayerOpen(false)}
                          tabIndex={active && playerOpen ? 0 : -1}
                        >
                          ‹ Cover
                        </button>
                      </div>

                      <div className="player-card-song">
                        <strong>{song.title}</strong>
                        <span>{song.artist}</span>
                      </div>

                      {song.embedUrl ? (
                        <iframe
                          key={song.id}
                          src={song.embedUrl}
                          title={`Apple Music player: ${song.title}`}
                          width="100%"
                          height="175"
                          frameBorder="0"
                          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                          style={{
                            display: "block",
                            border: 0,
                            borderRadius: 10,
                            background: "transparent",
                          }}
                        />
                      ) : (
                        <p className="player-unavailable">
                          Apple Music player unavailable for this song.
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="album-reflection" />
                </div>
              );
            })}
          </div>

          <div className="album-details">
            <h1>{currentSong.title}</h1>
            <p>{currentSong.artist}</p>
            <p style={{ opacity: 0.7, fontSize: 14 }}>{currentSong.album}</p>
          </div>

          <div className="coverflow-controls">
            <button onClick={() => move(-1)} aria-label="Previous song">
              ‹
            </button>
            <span>
              {String(selected + 1).padStart(2, "0")} /{" "}
              {String(songs.length).padStart(2, "0")}
            </span>
            <button onClick={() => move(1)} aria-label="Next song">
              ›
            </button>
          </div>

          <p className="browse-hint">
            {playerOpen
              ? "NOW PLAYING · RETURN TO COVER TO BROWSE"
              : "SELECT AN ALBUM TO OPEN THE PLAYER"}
          </p>
        </>
      ) : (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          Search for a song to get started.
        </p>
      )}
    </section>
  );
}
