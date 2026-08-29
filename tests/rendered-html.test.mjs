import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the local landing with all five interactive service cards", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Soluciones Integrales \| Costa Rica<\/title>/);
  assert.match(html, /lang="es"/);
  assert.equal((html.match(/class="service-card photo-service/g) ?? []).length, 5);
  for (const service of ["Gas LP", "Agua y bombeo", "Fontanería y saneamiento", "Jardinería", "Estructuras y obra"]) {
    assert.ok(html.includes(`aria-label="Ver detalles de ${service}"`));
  }
  assert.match(html, /id="quote-service"/);
  assert.doesNotMatch(html, /<dialog[\s>]/);
});

test("renders exactly ten highlights and an honest clients/testimonials preparation state", async () => {
  const html = await (await render()).text();
  assert.equal((html.match(/class="work-highlight"/g) ?? []).length, 10);
  assert.equal((html.match(/id="proyectos"/g) ?? []).length, 1);
  for (const id of ["andres-04", "juanpablo-44", "marvin-07"]) assert.ok(html.includes(`/trabajos/${id}`));
  assert.doesNotMatch(html, /Mostrar más fotos|gallery-filter-|class="gallery-grid"/);
  assert.match(html, /id="clients-title"/);
  assert.match(html, /id="client-story-panel"/);
  assert.match(html, /Testimonios · en preparación/);
  assert.match(html, /Nombres y comentarios por confirmar/);
  assert.doesNotMatch(html, /<blockquote[\s>]/);
  assert.doesNotMatch(html, /\/trabajos\/andres-01|\/trabajos\/andres-06/);
  assert.doesNotMatch(html, /Building your site|react-loading-skeleton/);
});
