import Image from "next/image";
import { PlasmaCanvas } from "./PlasmaCanvas";

const services = [
  {
    number: "01",
    title: "Gas LP",
    description:
      "Venta, instalación y mantenimiento de sistemas de gas para hogares, comercios e industria.",
    tags: ["Gas LP", "Tuberías", "Cocinas", "Calentadores"],
    tone: "rust",
  },
  {
    number: "02",
    title: "Agua y bombeo",
    description:
      "Tanques de captación, equipos de bombeo, calentadores, tubería PVC y acompañamiento técnico.",
    tags: ["Tanques", "Bombas", "PVC", "Agua potable"],
    tone: "cream",
  },
  {
    number: "03",
    title: "Fontanería y saneamiento",
    description:
      "Destape de tuberías, limpieza de tanques sépticos, trampas de grasa y fontanería general.",
    tags: ["Destape", "Sépticos", "Trampas de grasa", "Fontanería"],
    tone: "dark",
  },
  {
    number: "04",
    title: "Jardinería",
    description:
      "Chapeo de terrenos, mantenimiento de áreas verdes y poda controlada de arbustos y árboles.",
    tags: ["Chapeo", "Poda", "Áreas verdes", "Terrenos"],
    tone: "paper",
  },
  {
    number: "05",
    title: "Estructuras y obra",
    description:
      "Soldadura general, estructuras metálicas, remodelaciones y ejecución de obra gris.",
    tags: ["Soldadura", "Metal", "Remodelación", "Obra gris"],
    tone: "orange",
  },
];

const process = [
  ["01", "Nos cuenta", "Escuchamos la necesidad y reunimos la información clave."],
  ["02", "Evaluamos", "El especialista indicado revisa el trabajo y define el alcance."],
  ["03", "Cotizamos", "Presentamos una propuesta clara, coordinada y sin sorpresas."],
  ["04", "Resolvemos", "Ejecutamos el trabajo y damos seguimiento hasta entregarlo."],
];

export default function Home() {
  const serviceLabels = ["Gas LP", "Agua y bombeo", "Fontanería", "Jardinería", "Construcción"];

  return (
    <main>
      <section className="hero" id="inicio">
        <PlasmaCanvas />
        <div className="hero-shade" />

        <header className="site-header">
          <a className="brand" href="#inicio" aria-label="Soluciones Integrales, inicio">
            <Image src="/logo.png" alt="Soluciones Integrales" width={1774} height={887} priority />
          </a>
          <nav aria-label="Navegación principal">
            <a href="#servicios">Servicios</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#proyectos">Proyectos</a>
          </nav>
          <a className="header-cta" href="#contacto">Cotizar proyecto</a>
        </header>

        <div className="hero-content">
          <p className="eyebrow"><span /> Soluciones técnicas en Costa Rica</p>
          <h1>Un solo equipo.<br /><em>Todo resuelto.</em></h1>
          <p className="hero-copy">
            Especialistas en gas, agua, mantenimiento, estructuras y obra.
            Coordinamos cada detalle para que usted no tenga que hacerlo.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#contacto">
              Solicitar cotización <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href="#servicios">Explorar servicios</a>
          </div>
        </div>

        <div className="service-marquee" aria-label="Áreas de servicio">
          {serviceLabels.map((service) => <span key={service}><i /> {service}</span>)}
        </div>
      </section>

      <section className="intro section-shell" id="nosotros">
        <p className="section-kicker">Una red, no un directorio</p>
        <div className="intro-grid">
          <h2>Cuatro especialistas que trabajan como <em>uno.</em></h2>
          <div className="intro-copy">
            <p>
              Reunimos experiencia técnica en los sistemas que mantienen una propiedad funcionando:
              energía, agua, saneamiento, áreas verdes y construcción.
            </p>
            <p>
              Usted habla con un solo equipo. Nosotros coordinamos a la persona correcta para resolverlo.
            </p>
          </div>
        </div>
        <div className="impact-row" aria-label="Alcance de Soluciones Integrales">
          <div><strong>4</strong><span>especialistas</span></div>
          <div><strong>5</strong><span>frentes de servicio</span></div>
          <div><strong>1</strong><span>equipo coordinado</span></div>
        </div>
      </section>

      <section className="services-section" id="servicios">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Qué resolvemos</p>
              <h2>Servicios para cada parte de su propiedad.</h2>
            </div>
            <p>Desde una reparación puntual hasta un proyecto técnico completo.</p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className={`service-card ${service.tone}`} key={service.title}>
                <span className="service-number">{service.number}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <ul aria-label={`Incluye ${service.title}`}>
                  {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <a href="#contacto" aria-label={`Cotizar ${service.title}`}>
                  Cotizar servicio <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="property-section" id="proyectos">
        <div className="section-shell property-shell">
          <div className="property-copy">
            <p className="section-kicker light">Trabajamos a su escala</p>
            <h2>Del hogar a la industria.</h2>
            <p>
              Adaptamos el equipo, la planificación y la solución al tamaño real del proyecto.
            </p>
          </div>
          <div className="property-list">
            <article>
              <span>01</span><h3>Residencial</h3><p>Reparaciones, instalaciones y mejoras para vivir con tranquilidad.</p>
            </article>
            <article>
              <span>02</span><h3>Comercial</h3><p>Mantenimiento coordinado para que su operación no se detenga.</p>
            </article>
            <article>
              <span>03</span><h3>Industrial</h3><p>Soluciones técnicas y de infraestructura con alcance definido.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="process-section section-shell">
        <div className="section-heading process-heading">
          <div>
            <p className="section-kicker">Así de simple</p>
            <h2>Un proceso claro de principio a fin.</h2>
          </div>
          <p>Menos vueltas. Mejor coordinación. Una respuesta concreta.</p>
        </div>
        <div className="process-grid">
          {process.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contacto">
        <div className="section-shell contact-grid">
          <div className="contact-copy">
            <p className="section-kicker light">Hablemos del proyecto</p>
            <h2>¿Qué necesita <em>resolver?</em></h2>
            <p>
              Cuéntenos brevemente qué sucede. Identificaremos el especialista y el siguiente paso.
            </p>
            <div className="contact-note">
              <span>Respuesta coordinada</span>
              <span>Cotización clara</span>
              <span>Atención en Costa Rica</span>
            </div>
          </div>

          <form className="quote-form">
            <label>
              Nombre
              <input name="name" autoComplete="name" placeholder="¿Cómo le llamamos?" />
            </label>
            <label>
              Teléfono
              <input name="phone" type="tel" autoComplete="tel" placeholder="Número de contacto" />
            </label>
            <label className="full-field">
              Servicio
              <select name="service" defaultValue="">
                <option value="" disabled>Seleccione un área</option>
                {services.map((service) => <option key={service.title}>{service.title}</option>)}
                <option>Necesito orientación</option>
              </select>
            </label>
            <label className="full-field">
              Cuéntenos qué necesita
              <textarea name="message" rows={4} placeholder="Ubicación, problema o tipo de proyecto..." />
            </label>
            <button className="form-button" type="submit">
              Solicitar contacto <span aria-hidden="true">↗</span>
            </button>
            <p className="form-disclaimer">Al enviar acepta que le contactemos para coordinar su solicitud.</p>
          </form>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-grid">
          <a className="footer-brand" href="#inicio">Soluciones <strong>Integrales</strong></a>
          <p>Un solo equipo para mantener, reparar y construir mejor.</p>
          <div className="footer-links">
            <a href="#servicios">Servicios</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
          </div>
        </div>
        <div className="section-shell footer-bottom">
          <span>© 2026 Soluciones Integrales</span>
          <span>Costa Rica</span>
        </div>
      </footer>

      <a className="mobile-contact" href="#contacto">Cotizar <span>↗</span></a>
    </main>
  );
}
