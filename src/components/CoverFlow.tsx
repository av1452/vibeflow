"use client";

import { useState } from "react";

const albums = [
  { title: "Midnight Drive", artist: "Demo Artist", colors: ["#ff512f", "#7b2ff7"] },
  { title: "Electric Dreams", artist: "Demo Artist", colors: ["#00c6ff", "#0072ff"] },
  { title: "After Hours", artist: "Demo Artist", colors: ["#f953c6", "#b91d73"] },
  { title: "Summer Nights", artist: "Demo Artist", colors: ["#f7971e", "#ffd200"] },
  { title: "Neon City", artist: "Demo Artist", colors: ["#11998e", "#38ef7d"] },
  { title: "Blue Horizon", artist: "Demo Artist", colors: ["#396afc", "#2948ff"] },
];

export default function CoverFlow() {
  const [selected, setSelected] = useState(0);

  function move(direction: number) {
    setSelected((current) =>
      (current + direction + albums.length) % albums.length
    );
  }

  return (
    <section className="coverflow">
      <p className="eyebrow">YOUR COLLECTION</p>

      <div className="coverflow-stage">
        {albums.map((album, index) => {
          let offset = index - selected;

          if (offset > albums.length / 2) offset -= albums.length;
          if (offset < -albums.length / 2) offset += albums.length;

          const active = offset === 0;

          return (
            <button
              key={album.title}
              className={`album-card ${active ? "active" : ""}`}
              style={{
                transform: `translateX(${offset * 145}px) rotateY(${
                  offset === 0 ? 0 : offset > 0 ? -55 : 55
                }deg) scale(${active ? 1 : 0.8})`,
                zIndex: 20 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
              }}
              onClick={() =>
                offset === 0
                  ? undefined
                  : setSelected(index)
              }
              aria-label={`Select ${album.title}`}
              aria-pressed={active}
            >
              <span
                className="album-art"
                style={{
                  background: `linear-gradient(145deg, ${album.colors[0]}, ${album.colors[1]})`,
                }}
              >
                <span className="art-orb" />
                <span className="art-title">{album.title}</span>
                <span className="art-artist">{album.artist}</span>
              </span>
              <span className="album-reflection" />
            </button>
          );
        })}
      </div>

      <div className="album-details">
        <h1>{albums[selected].title}</h1>
        <p>{albums[selected].artist}</p>
      </div>

      <div className="coverflow-controls">
        <button onClick={() => move(-1)} aria-label="Previous album">
          ‹
        </button>
        <span>{String(selected + 1).padStart(2, "0")} / {String(albums.length).padStart(2, "0")}</span>
        <button onClick={() => move(1)} aria-label="Next album">
          ›
        </button>
      </div>

      <p className="browse-hint">SELECT AN ALBUM TO EXPLORE</p>
    </section>
  );
}
