"use client";

/* Pre-sized local photographs do not need a remote optimizer. */
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { highlightedPhotos, services, visibleHighlightIndex, type Photo } from "./data/services";
import { ClientStories } from "./ClientStories";

export function WorkHighlights({ onOpen }: { onOpen: (photos: Photo[], index: number) => void }) {
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  function moveHighlights(direction: number) {
    const element = track.current;
    const first = element?.children[0] as HTMLElement | undefined;
    const second = element?.children[1] as HTMLElement | undefined;
    if (!element || !first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    // Move from the real scroll offset: at the end, two cards can share a viewport.
    element.scrollTo({ left: element.scrollLeft + direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <section className="work-showcase" id="proyectos" aria-labelledby="work-title">
      <div className="section-shell">
        <header className="work-heading">
          <div><p className="showcase-eyebrow">Una selección de lo que hacemos</p><h2 id="work-title">Hecho con oficio.<br /><em>Hecho para durar.</em></h2></div>
          <div className="work-heading-aside"><span className="work-edit-number">{String(highlightedPhotos.length).padStart(2, "0")}</span><p>Miradas a nuestro trabajo.<br />Personas detrás de cada solución.</p></div>
        </header>

        <div className="work-collection-toolbar">
          <p><span aria-hidden="true" />Trabajos destacados</p>
          <div className="work-controls" role="group" aria-label="Recorrer trabajos destacados">
            <button type="button" aria-label="Trabajo anterior" disabled={active === 0} onClick={() => moveHighlights(-1)}>←</button>
            <button type="button" aria-label="Trabajo siguiente" disabled={active === highlightedPhotos.length - 1} onClick={() => moveHighlights(1)}>→</button>
          </div>
        </div>

        <ol className="work-filmstrip" ref={track} aria-label={`Selección de ${highlightedPhotos.length} fotografías de trabajos`}
          onScroll={() => {
            const element = track.current;
            if (!element) return;
            const positions = Array.from(element.children, (item) => (item as HTMLElement).offsetLeft);
            setActive(visibleHighlightIndex(positions, element.scrollLeft, element.clientWidth, element.scrollWidth));
          }}>
          {highlightedPhotos.map((photo, index) => {
            const service = services.find((item) => item.id === photo.serviceId);
            return (
              <li className="work-highlight" key={photo.id}>
                <button type="button" className="work-photo-button" aria-haspopup="dialog"
                  aria-label={`Ampliar: ${photo.caption}. ${photo.owner}.`}
                  onClick={() => onOpen(highlightedPhotos, index)}>
                  <img src={photo.thumbnail} srcSet={`${photo.thumbnail} ${photo.thumbnailWidth}w, ${photo.src} ${photo.width}w`}
                    sizes="(max-width: 700px) 84vw, (max-width: 1100px) 55vw, 620px"
                    alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async"
                    style={{ objectPosition: service?.cover === photo.id ? service.coverPosition : "center" }} />
                  <span className="work-photo-topline"><span>{service?.shortTitle}</span><span>{String(index + 1).padStart(2, "0")}</span></span>
                  <span className="work-photo-caption"><span>{photo.owner}</span><strong>{photo.caption}</strong></span>
                  <span className="work-photo-expand" aria-hidden="true">↗</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="work-collection-footer">
          <p>Fotos reales. Trabajo de nuestro equipo.</p>
          <div className="work-position"><span aria-live="polite" aria-atomic="true"><span className="sr-only">Trabajo </span>{String(active + 1).padStart(2, "0")}<i> / {String(highlightedPhotos.length).padStart(2, "0")}</i></span><div className="work-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / highlightedPhotos.length) * 100}%` }} /></div></div>
          <span className="work-swipe-hint" aria-hidden="true">Deslice para explorar ↔</span>
        </div>

        <ClientStories />
      </div>
    </section>
  );
}
