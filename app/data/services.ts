import photoData from "./photos.json";

export type Photo = (typeof photoData)[number];
export type Service = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  owner: string;
  initials: string;
  description: string;
  introduction: string;
  details: string[];
  tags: string[];
  tone: string;
  cover?: string;
  coverPosition?: string;
  featured: string[];
  note: string;
};

export const services: Service[] = [
  {
    id: "gas", number: "01", title: "Gas LP", shortTitle: "Gas LP",
    owner: "Andrés Garita", initials: "AG", tone: "rust",
    description: "Venta, instalación y mantenimiento de sistemas de gas para hogares, comercios e industria.",
    introduction: "Desde el suministro de gas hasta la instalación que alimenta su cocina o negocio. Andrés reúne los servicios de gas LP para coordinar cada parte del sistema.",
    details: [
      "Venta de gas LP para cocinas, comercios e industria.",
      "Instalación de tuberías, conexiones y sistemas de gas.",
      "Instalación de cocinas y equipos que funcionan con gas LP.",
      "Mantenimiento y atención de necesidades relacionadas con el sistema de gas.",
      "Coordinación de los requisitos y certificaciones aplicables al trabajo.",
    ],
    tags: ["Gas LP", "Tuberías", "Cocinas", "Instalación"],
    cover: "andres-04", coverPosition: "50% 45%",
    featured: ["andres-04", "andres-02", "andres-07", "andres-08", "andres-05", "andres-09", "andres-03"],
    note: "Cuéntenos qué equipos utiliza, dónde están ubicados y si se trata de una instalación nueva o existente.",
  },
  {
    id: "agua", number: "02", title: "Agua y bombeo", shortTitle: "Agua y bombeo",
    owner: "Juan Pablo", initials: "JP", tone: "cream",
    description: "Tanques de captación, equipos de bombeo, calentadores, tubería PVC y acompañamiento técnico.",
    introduction: "Almacenamiento, presión y distribución de agua en una misma solución. Juan Pablo le acompaña desde la elección de los equipos hasta su instalación y reparación.",
    details: [
      "Venta e instalación de tanques para agua potable, captación pluvial y aguas negras o fosas sépticas.",
      "Venta, instalación y reparación de equipos de bombeo.",
      "Venta de tubería y accesorios de PVC.",
      "Venta e instalación de calentadores de paso eléctricos y a gas.",
      "Reparación y mantenimiento de calentadores de agua.",
      "Asesoría y acompañamiento técnico para definir la solución.",
    ],
    tags: ["Tanques", "Bombas", "PVC", "Calentadores"],
    cover: "juanpablo-44", coverPosition: "50% 65%",
    featured: ["juanpablo-44", "juanpablo-39", "juanpablo-16", "juanpablo-10", "juanpablo-45", "juanpablo-36", "juanpablo-11", "juanpablo-05", "juanpablo-31"],
    note: "Indíquenos el uso del agua, el espacio disponible y el problema o equipo que necesita revisar.",
  },
  {
    id: "fontaneria", number: "03", title: "Fontanería y saneamiento", shortTitle: "Fontanería",
    owner: "Alexis", initials: "A", tone: "dark",
    description: "Destape de tuberías, limpieza de tanques sépticos, trampas de grasa y fontanería general.",
    introduction: "Atención para los sistemas de agua y desagüe que necesitan mantenimiento. Alexis le ayuda a identificar el trabajo y coordinar la intervención.",
    details: [
      "Destaqueo y destape de tuberías obstruidas.",
      "Limpieza de tanques sépticos.",
      "Limpieza de trampas de grasa.",
      "Trabajos de fontanería general.",
    ],
    tags: ["Destape", "Sépticos", "Trampas de grasa", "Fontanería"],
    featured: [],
    note: "Cuéntenos dónde se presenta el problema, desde cuándo ocurre y cómo es el acceso al área.",
  },
  {
    id: "jardineria", number: "04", title: "Jardinería", shortTitle: "Jardinería",
    owner: "Alexis", initials: "A", tone: "paper",
    description: "Chapeo de terrenos, mantenimiento de áreas verdes y poda de arbustos y árboles.",
    introduction: "Un jardín cuidado y un terreno despejado empiezan con el mantenimiento adecuado. Alexis coordina las labores según las condiciones y el tamaño del espacio.",
    details: [
      "Chapeo y corte de pasto en terrenos.",
      "Mantenimiento de jardines y áreas verdes.",
      "Poda de arbustos.",
      "Poda de árboles según las condiciones del trabajo.",
    ],
    tags: ["Chapeo", "Poda", "Áreas verdes", "Terrenos"],
    featured: [],
    note: "Compártanos el tamaño aproximado del terreno, el tipo de vegetación y unas fotos del área.",
  },
  {
    id: "obra", number: "05", title: "Estructuras y obra", shortTitle: "Estructuras y obra",
    owner: "Marvin", initials: "M", tone: "orange",
    description: "Soldadura general, estructuras metálicas, remodelaciones y ejecución de obra gris.",
    introduction: "Fabricar, adaptar y mejorar los espacios de su propiedad. Marvin reúne experiencia en soldadura, estructuras metálicas y construcción para desarrollar su proyecto.",
    details: [
      "Soldadura general y trabajos en metal.",
      "Fabricación e instalación de estructuras metálicas.",
      "Portones, cerramientos, cubiertas y otros elementos metálicos según el proyecto.",
      "Remodelaciones de espacios.",
      "Ejecución de obra gris.",
    ],
    tags: ["Soldadura", "Metal", "Remodelación", "Obra gris"],
    cover: "marvin-07", coverPosition: "60% 50%",
    featured: ["marvin-07", "marvin-04", "marvin-06", "marvin-03", "marvin-08", "marvin-01"],
    note: "Cuéntenos qué quiere construir o renovar, sus medidas aproximadas y el estado actual del espacio.",
  },
];

export const photos: Photo[] = photoData;

const galleryOpening = [
  "andres-04", "juanpablo-44", "marvin-07", "juanpablo-39",
  "marvin-04", "andres-08", "juanpablo-16", "marvin-06",
  "juanpablo-45", "andres-02", "marvin-03", "juanpablo-10",
];

export function findPhoto(id: string): Photo {
  const photo = photos.find((item) => item.id === id);
  if (!photo) throw new Error(`Missing project photograph: ${id}`);
  return photo;
}

export const galleryPhotos = [
  ...galleryOpening.map(findPhoto),
  ...photos.filter((photo) => !galleryOpening.includes(photo.id)),
];

// A deliberately small homepage edit; full service albums remain available in dialogs.
export const HIGHLIGHT_LIMIT = 10;
export const highlightedPhotos = [
  "marvin-07", "juanpablo-44", "andres-04", "marvin-06", "juanpablo-39",
  "andres-02", "juanpablo-16", "marvin-04", "juanpablo-45", "andres-08",
].slice(0, HIGHLIGHT_LIMIT).map(findPhoto);

export function visibleHighlightIndex(positions: number[], scrollLeft: number, viewport: number, total: number) {
  if (positions.length < 2 || total <= viewport) return 0;
  if (scrollLeft + viewport >= total - 3) return positions.length - 1;
  return positions.reduce((closest, position, index) =>
    Math.abs(position - scrollLeft) < Math.abs(positions[closest] - scrollLeft) ? index : closest, 0);
}

export function filterPhotos(serviceId: string) {
  return serviceId === "all" ? galleryPhotos : galleryPhotos.filter((photo) => photo.serviceId === serviceId);
}

export function wrapPhotoIndex(index: number, length: number) {
  return length > 0 ? ((index % length) + length) % length : 0;
}

export function swipeDirection(dx: number, dy: number) {
  if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return 0;
  return dx < 0 ? 1 : -1;
}
