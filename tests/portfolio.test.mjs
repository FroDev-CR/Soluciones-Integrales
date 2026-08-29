import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Test the same data/helpers used by the client, without a browser or a server.
const photoJson = await readFile(new URL("../app/data/photos.json", import.meta.url), "utf8");
const source = await readFile(new URL("../app/data/services.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source.replace('import photoData from "./photos.json";', `const photoData = ${photoJson};`), {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { photos, services, galleryPhotos, filterPhotos, wrapPhotoIndex, swipeDirection, highlightedPhotos, HIGHLIGHT_LIMIT, visibleHighlightIndex } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const sources = JSON.parse(await readFile(new URL("../scripts/photo-sources.json", import.meta.url), "utf8"));

test("the gallery contains every selected photo exactly once", () => {
  assert.equal(sources.length, 63);
  assert.equal(photos.length, 61);
  assert.equal(new Set(galleryPhotos.map((p) => p.id)).size, 61);
  assert.deepEqual(new Set(galleryPhotos.map((p) => p.id)), new Set(photos.map((p) => p.id)));
  assert.equal(filterPhotos("gas").length, 7);
  assert.equal(filterPhotos("agua").length, 46);
  assert.equal(filterPhotos("obra").length, 8);
  assert.equal(filterPhotos("all").length, 61);
  assert.equal(filterPhotos("fontaneria").length, 0);
  assert.equal(filterPhotos("jardineria").length, 0);
  assert.ok(!photos.some((p) => ["andres-01", "andres-06"].includes(p.id)));
});

test("the homepage selection is capped at ten unique photos and covers all three specialists", () => {
  assert.equal(HIGHLIGHT_LIMIT, 10);
  assert.equal(highlightedPhotos.length, 10);
  assert.equal(new Set(highlightedPhotos.map((photo) => photo.id)).size, 10);
  assert.deepEqual(new Set(highlightedPhotos.map((photo) => photo.serviceId)), new Set(["gas", "agua", "obra"]));
  assert.ok(highlightedPhotos.every((photo) => photos.some((item) => item.id === photo.id)));
});

test("filmstrip navigation recognizes the last card even when two cards share the viewport", () => {
  const positions = [0, 300, 600, 900];
  assert.equal(visibleHighlightIndex(positions, 0, 600, 1200), 0);
  assert.equal(visibleHighlightIndex(positions, 300, 600, 1200), 1);
  assert.equal(visibleHighlightIndex(positions, 600, 600, 1200), 3);
  assert.equal(visibleHighlightIndex([], 0, 600, 600), 0);
  assert.equal(visibleHighlightIndex([0], 0, 600, 300), 0);
});

test("covers and featured slides belong to the correct specialist", () => {
  assert.equal(services.length, 5);
  assert.equal(new Set(services.map((s) => s.id)).size, 5);
  for (const service of services) {
    assert.ok(service.details.length >= 4);
    assert.equal(new Set(service.featured).size, service.featured.length);
    if (service.cover) assert.equal(service.featured[0], service.cover);
    for (const photoId of service.featured) {
      const photo = photos.find((p) => p.id === photoId);
      assert.ok(photo, `Missing ${photoId}`);
      assert.equal(photo.serviceId, service.id);
      assert.equal(photo.owner, service.owner);
    }
  }
});

test("carousel wraps at both ends and safely handles empty or single-item lists", () => {
  assert.equal(wrapPhotoIndex(-1, 7), 6);
  assert.equal(wrapPhotoIndex(7, 7), 0);
  assert.equal(wrapPhotoIndex(15, 7), 1);
  assert.equal(wrapPhotoIndex(-9, 7), 5);
  assert.equal(wrapPhotoIndex(1, 1), 0);
  assert.equal(wrapPhotoIndex(-1, 0), 0);
});

test("swipe gestures ignore vertical scrolling and short movements", () => {
  assert.equal(swipeDirection(-90, 12), 1);
  assert.equal(swipeDirection(90, 12), -1);
  assert.equal(swipeDirection(-30, 2), 0);
  assert.equal(swipeDirection(55, 95), 0);
  assert.equal(swipeDirection(-50, 45), 0);
  assert.equal(swipeDirection(0, 0), 0);
});

test("all gallery files exist, are WebP, and carry dimensions and captions", async () => {
  for (const photo of photos) {
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.ok(photo.thumbnailWidth <= photo.width);
    assert.ok(photo.thumbnailHeight <= photo.height);
    assert.ok(photo.caption.length > 10 && photo.alt.includes(photo.owner));
    for (const path of [photo.src, photo.thumbnail]) {
      assert.match(path, /^\/trabajos\/[a-z0-9-]+\.webp$/);
      const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
  }
});

test("all 63 original files are unchanged", async () => {
  for (const photo of sources) {
    const bytes = await readFile(new URL(`../../${photo.source.replaceAll("\\", "/")}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), photo.sha256, photo.source);
  }
});
