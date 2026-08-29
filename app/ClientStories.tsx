"use client";

import { useState } from "react";
import { clientInitials, clientStories, publishedClients, type ClientStory } from "./data/clients";
import { wrapPhotoIndex } from "./data/services";

export function ClientStories({ stories = clientStories }: { stories?: ClientStory[] }) {
  const clients = publishedClients(stories);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = clients.find((client) => client.id === selectedId) ?? clients[0];
  const selectedIndex = selected ? clients.indexOf(selected) : 0;

  return (
    <div className="client-stories" aria-labelledby="clients-title">
      <div className="client-directory">
        <p className="showcase-eyebrow">La otra parte de cada proyecto</p>
        <h3 id="clients-title">Clientes <em>destacados.</em></h3>
        <p className="client-directory-intro">Detrás de cada trabajo hay una historia. Y alguien que nos abrió las puertas.</p>
        {clients.length > 0 ? (
          <ul className="client-list" aria-label="Seleccionar cliente">
            {clients.map((client, index) => (
              <li key={client.id}>
                <button type="button" aria-pressed={selected?.id === client.id} aria-controls="client-story-panel"
                  onClick={() => setSelectedId(client.id)}>
                  <span className="client-monogram" aria-hidden="true">{clientInitials(client.name)}</span>
                  <span className="client-list-name"><strong>{client.name}</strong><span>{client.sector}</span></span>
                  <span className="client-list-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="client-list-arrow" aria-hidden="true">↗</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="client-awaiting" aria-label="Clientes pendientes de confirmar">
            <div className="client-awaiting-mark" aria-hidden="true">↗</div>
            <div><strong>Este espacio lleva nombres propios.</strong><p>Los clientes destacados se incorporarán aquí cuando tengamos sus referencias confirmadas.</p></div>
          </div>
        )}
        <div className="client-directory-footer"><span aria-hidden="true" />{clients.length > 0 ? "Seleccione un cliente para conocer su experiencia" : "Nombres y comentarios por confirmar"}</div>
      </div>

      <div className="client-story-panel" id="client-story-panel">
        <div className="story-panel-topline"><span>{selected ? "En palabras de nuestros clientes" : "Lo que más importa"}</span><span aria-hidden="true">↗</span></div>
        {selected ? (
          <div className="client-story-body" key={selected.id} aria-live="polite" aria-atomic="true">
            {selected.testimonial?.quote.trim() && selected.testimonial.author.trim() ? (
              <>
                <span className="story-quotation-mark" aria-hidden="true">“</span>
                <blockquote>{selected.testimonial.quote}</blockquote>
                <div className="story-author"><strong>{selected.testimonial.author}</strong><span>{[selected.testimonial.role, selected.name].filter(Boolean).join(" · ")}</span></div>
              </>
            ) : (
              <div className="story-without-quote"><h4>{selected.name}</h4><p>El comentario de este cliente se incorporará cuando esté confirmado.</p></div>
            )}
            <span className="story-service">{selected.service}</span>
          </div>
        ) : (
          <div className="story-preparation">
            <span className="story-preparation-label">Testimonios · en preparación</span>
            <h4>Un buen trabajo.<br /><em>Una buena experiencia.</em></h4>
            <p>Este espacio será para las opiniones reales de quienes han trabajado con nuestro equipo.</p>
            <div className="story-preparation-footer"><span aria-hidden="true">—</span>Historias reales, contadas por sus protagonistas.</div>
          </div>
        )}
        {clients.length > 1 && (
          <div className="story-navigation">
            <span>{String(selectedIndex + 1).padStart(2, "0")} <i>/ {String(clients.length).padStart(2, "0")}</i></span>
            <div>
              <button type="button" aria-label="Cliente anterior" onClick={() => setSelectedId(clients[wrapPhotoIndex(selectedIndex - 1, clients.length)].id)}>←</button>
              <button type="button" aria-label="Cliente siguiente" onClick={() => setSelectedId(clients[wrapPhotoIndex(selectedIndex + 1, clients.length)].id)}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
