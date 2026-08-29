import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);
function compileModule(source, dependencies) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: testModule, exports: testModule.exports,
    require: (name) => dependencies[name] ?? nodeRequire(name),
  });
  return testModule.exports;
}

const clientData = JSON.parse(await readFile(new URL("../app/data/clients.json", import.meta.url), "utf8"));
const clientsModule = compileModule(await readFile(new URL("../app/data/clients.ts", import.meta.url), "utf8"), {
  "./clients.json": { default: clientData },
});
const { ClientStories } = compileModule(await readFile(new URL("../app/ClientStories.tsx", import.meta.url), "utf8"), {
  "./data/clients": clientsModule,
  "./data/services": { wrapPhotoIndex: (index, length) => ((index % length) + length) % length },
});

// Synthetic fixtures are used only in tests, never in the public client data.
const fixture = {
  id: "test-client-a", name: "Cliente de prueba A", sector: "Sector de prueba",
  service: "Servicio de prueba", approvedForPublication: true,
  testimonial: { quote: "Comentario de prueba para verificar el componente.", author: "Autor de prueba", role: "Rol de prueba" },
};

test("an empty clients list displays a labeled preparation state, not invented endorsements", () => {
  const html = renderToStaticMarkup(createElement(ClientStories, { stories: [] }));
  assert.match(html, /Nombres y comentarios por confirmar/);
  assert.match(html, /Testimonios · en preparación/);
  assert.doesNotMatch(html, /<blockquote|Cliente de prueba|★/);
});

test("confirmed client information renders as a selectable entry and its own testimonial", () => {
  const html = renderToStaticMarkup(createElement(ClientStories, { stories: [fixture] }));
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-controls="client-story-panel"/);
  for (const text of [fixture.name, fixture.service, fixture.testimonial.quote, fixture.testimonial.author]) assert.ok(html.includes(text));
  assert.match(html, /<blockquote>/);
  assert.doesNotMatch(html, /en preparación|Cliente siguiente/);
});

test("multiple confirmed clients expose previous/next controls", () => {
  const html = renderToStaticMarkup(createElement(ClientStories, { stories: [fixture, { ...fixture, id: "test-client-b", name: "Cliente de prueba B" }] }));
  assert.equal((html.match(/aria-controls="client-story-panel"/g) ?? []).length, 2);
  assert.match(html, /aria-label="Cliente anterior"/);
  assert.match(html, /aria-label="Cliente siguiente"/);
});

test("unapproved clients and unconfirmed quotes are never presented as testimonials", () => {
  const hidden = renderToStaticMarkup(createElement(ClientStories, { stories: [{ ...fixture, approvedForPublication: false }] }));
  assert.ok(!hidden.includes(fixture.name));
  const noQuote = renderToStaticMarkup(createElement(ClientStories, { stories: [{ ...fixture, testimonial: undefined }] }));
  assert.doesNotMatch(noQuote, /<blockquote/);
  assert.match(noQuote, /cuando esté confirmado/);
});

test("client initials and publication filter handle whitespace and pending entries", () => {
  assert.equal(clientsModule.clientInitials("  Dos   Palabras Más  "), "DP");
  assert.equal(clientsModule.clientInitials(""), "");
  assert.equal(clientsModule.publishedClients([fixture, { ...fixture, approvedForPublication: false }, { ...fixture, name: " " }]).length, 1);
});
