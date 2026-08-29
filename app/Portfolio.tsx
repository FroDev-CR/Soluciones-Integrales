"use client";

/* Photos are pre-sized local WebP files; no remote image optimizer is needed. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import {
  filterPhotos, findPhoto, services, swipeDirection, wrapPhotoIndex,
  type Photo, type Service,
} from "./data/services";
import { WorkHighlights } from "./WorkHighlights";

type Selection = { service?: Service; photos: Photo[]; initialIndex: number };

function sourceSet(photo: Photo) {
  return photo.thumbnailWidth < photo.width
    ? `${photo.thumbnail} ${photo.thumbnailWidth}w, ${photo.src} ${photo.width}w`
    : undefined;
}

function PhotoCarousel({ photos, index, onSelect }: {
  photos: Photo[]; index: number; onSelect: (index: number) => void;
}) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const photo = photos[index];

  useEffect(() => {
    const strip = thumbnails.current;
    const active = strip?.children[index] as HTMLElement | undefined;
    if (strip && active) {
      strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2, behavior: "auto" });
    }
  }, [index]);

  useEffect(() => {
    // Warm up adjacent local files without downloading every full-size photo.
    if (photos.length < 2) return;
    for (const nextIndex of [wrapPhotoIndex(index - 1, photos.length), wrapPhotoIndex(index + 1, photos.length)]) {
      const nextImage = new window.Image();
      nextImage.src = photos[nextIndex].src;
    }
  }, [index, photos]);

  return (
    <div className="project-carousel" role="region" aria-roledescription="carrusel" aria-label="Fotografías del trabajo">
      <div
        className="carousel-frame"
        onTouchStart={(event) => {
          const onControl = event.target instanceof Element && Boolean(event.target.closest("button"));
          touchStart.current = event.touches.length === 1 && !onControl
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
            : null;
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current || event.changedTouches.length !== 1) return;
          const touch = event.changedTouches[0];
          const direction = swipeDirection(touch.clientX - touchStart.current.x, touch.clientY - touchStart.current.y);
          touchStart.current = null;
          if (direction) onSelect(wrapPhotoIndex(index + direction, photos.length));
        }}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <img key={photo.id} className="carousel-image" src={photo.src} alt={photo.alt}
          width={photo.width} height={photo.height} draggable={false} decoding="async" />
        {photos.length > 1 && (
          <>
            <button type="button" className="carousel-arrow previous" aria-label="Foto anterior"
              onClick={() => onSelect(wrapPhotoIndex(index - 1, photos.length))}>←</button>
            <button type="button" className="carousel-arrow next" aria-label="Foto siguiente"
              onClick={() => onSelect(wrapPhotoIndex(index + 1, photos.length))}>→</button>
          </>
        )}
        <span className="carousel-count" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
      </div>
      <div className="carousel-caption" aria-live="polite" aria-atomic="true">
        <div><strong>{photo.caption}</strong><span>{photo.owner}</span></div>
        <span className="sr-only">Foto {index + 1} de {photos.length}.</span>
        {photos.length > 1 && <span className="carousel-hint" aria-hidden="true">Deslice o use las flechas ↔</span>}
      </div>
      {photos.length > 1 && (
        <div className="carousel-thumbnails" ref={thumbnails} role="group" aria-label="Seleccionar una fotografía">
          {photos.map((item, photoIndex) => (
            <button type="button" key={item.id} className={photoIndex === index ? "is-selected" : ""}
              aria-label={`Ver foto ${photoIndex + 1}: ${item.caption}`} aria-pressed={photoIndex === index}
              onClick={() => onSelect(photoIndex)}>
              <img src={item.thumbnail} alt="" width={item.thumbnailWidth} height={item.thumbnailHeight} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectDialog({ selection, onClose, onGallery, onQuote }: {
  selection: Selection; onClose: () => void;
  onGallery: (serviceId: string) => void; onQuote: (service: Service) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const backdropPress = useRef(false);
  const [index, setIndex] = useState(selection.initialIndex);
  const { service, photos } = selection;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
    element.showModal();
    title.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    // Native dialog supports Escape/focus trapping; these listeners add backdrop closing and photo shortcuts.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog ref={dialog} className={`project-dialog ${service ? "service-dialog" : "gallery-dialog"}`}
      aria-labelledby="project-dialog-title" onClose={() => { if (dialog.current && !dialog.current.open) onClose(); }}
      onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget) dialog.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || photos.length < 2) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setIndex((current) => wrapPhotoIndex(current + (event.key === "ArrowRight" ? 1 : -1), photos.length));
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          setIndex(event.key === "Home" ? 0 : photos.length - 1);
        }
      }}>
      <header className="dialog-header">
        <div>
          <p className="dialog-eyebrow">{service ? `${service.number} / Nuestro servicio` : "El trabajo, de cerca"}</p>
          <h2 id="project-dialog-title" ref={title} tabIndex={-1}>{service?.title ?? "Galería de trabajos"}</h2>
        </div>
        <button type="button" className="dialog-close" aria-label="Cerrar ventana" onClick={() => dialog.current?.close()}>×</button>
      </header>

      <div className={service ? "service-detail-grid" : "gallery-detail-content"}>
        <div className="detail-visual">
          {photos.length > 0 ? (
            <>
              <PhotoCarousel photos={photos} index={index} onSelect={setIndex} />
              {service && (
                <button type="button" className="all-service-photos" onClick={() => onGallery(service.id)}>
                  Abrir álbum completo · {filterPhotos(service.id).length} fotos <span aria-hidden="true">↗</span>
                </button>
              )}
            </>
          ) : (
            <div className={`service-photo-note ${service?.tone}`}>
              <span className="photo-note-number" aria-hidden="true">{service?.number}</span>
              <p>Su espacio.<br /><em>En buenas manos.</em></p>
              <span>Estamos preparando las fotografías de este servicio.</span>
            </div>
          )}
        </div>

        {service && (
          <div className="detail-information">
            <div className="specialist-row">
              <span className="specialist-avatar" aria-hidden="true">{service.initials}</span>
              <div><span>Su especialista</span><strong>{service.owner}</strong></div>
            </div>
            <p className="service-introduction">{service.introduction}</p>
            <h3>¿En qué le podemos ayudar?</h3>
            <ul className="service-detail-list">
              {service.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            <div className="service-quote-note"><strong>Para empezar</strong><p>{service.note}</p></div>
            <button type="button" className="detail-quote" onClick={() => onQuote(service)}>
              Cotizar este servicio <span aria-hidden="true">↗</span>
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

export function Portfolio() {
  const [selection, setSelection] = useState<Selection | null>(null);

  function showGallery(serviceId: string) {
    setSelection({ photos: filterPhotos(serviceId), initialIndex: 0 });
  }

  function quoteService(service: Service) {
    setSelection(null);
    requestAnimationFrame(() => {
      const field = document.getElementById("quote-service") as HTMLSelectElement | null;
      if (field) {
        field.value = service.title;
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.focus({ preventScroll: true });
      }
      document.getElementById("contacto")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  return (
    <>
      <section className="services-section" id="servicios">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="section-kicker">Qué resolvemos</p><h2>Servicios para cada parte de su propiedad.</h2></div>
            <p>Conozca a su especialista, explore nuestros trabajos y descubra cómo podemos ayudarle.</p>
          </div>
          <div className="services-grid">
            {services.map((service) => {
              const cover = service.cover ? findPhoto(service.cover) : null;
              return (
                <article className={`service-card photo-service ${service.tone}`} key={service.id}>
                  <button type="button" className="service-open" aria-label={`Ver detalles de ${service.title}`}
                    aria-haspopup="dialog" onClick={() => setSelection({ service, photos: service.featured.map(findPhoto), initialIndex: 0 })} />
                  <div className={`service-cover ${cover ? "has-photo" : "typographic-cover"}`}>
                    {cover ? (
                      <img src={cover.thumbnail} srcSet={sourceSet(cover)} sizes="(max-width: 800px) 100vw, (max-width: 1280px) 50vw, 620px"
                        alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" style={{ objectPosition: service.coverPosition }} />
                    ) : (
                      <div className="service-cover-type" aria-hidden="true"><span>{service.number}</span><strong>{service.id === "jardineria" ? <>Espacios<br />que respiran.</> : <>Todo fluye.<br />Todo funciona.</>}</strong></div>
                    )}
                    <span className="cover-specialist">{service.owner}</span>
                    <span className="cover-expand" aria-hidden="true">↗</span>
                  </div>
                  <div className="service-card-copy">
                    <span className="service-card-eyebrow">{service.number} / {cover ? "Trabajos reales" : "Conozca el servicio"}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <ul aria-label={`Incluye ${service.title}`}>{service.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    <div className="service-card-action"><span>{cover ? "Ver servicio y trabajos" : "Ver todos los detalles"}</span><span aria-hidden="true">↗</span></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <WorkHighlights onOpen={(photos, initialIndex) => setSelection({ photos, initialIndex })} />

      {selection && <ProjectDialog key={selection.service?.id ?? "gallery"} selection={selection} onClose={() => setSelection(null)} onGallery={showGallery} onQuote={quoteService} />}
    </>
  );
}
