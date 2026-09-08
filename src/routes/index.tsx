import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import hero from "@/assets/hero-jac.jpg";
import pFiestas from "@/assets/p-fiestas.jpg";
import pMadera from "@/assets/p-madera.jpg";
import p3d from "@/assets/p-3d.jpg";
import pPostres from "@/assets/p-postres.jpg";
import pPocillo from "@/assets/p-pocillo.jpg";
import pIcopor from "@/assets/p-icopor.jpg";
import ModelViewer from "@/components/ModelViewer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jac Design — Impresión 3D, Fiestas, Láser y Postres Fit" },
      {
        name: "description",
        content:
          "Jac Design: fabricación digital e impresión 3D, decoración de fiestas, letreros en icopor y madera láser, y repostería saludable. Personaliza en vivo y cotiza al instante.",
      },
      { property: "og:title", content: "Jac Design — Diseño integral para tus ideas" },
      {
        property: "og:description",
        content:
          "Personalizador en vivo, cotizador 3D instantáneo y colecciones para fiestas, oficinas y repostería fit.",
      },
    ],
  }),
  component: JacDesign,
});

export const ModelRoute = createFileRoute("/modelo/:id")({
  component: import("./components/ModelViewer").then(mod => mod.ModelViewer),
  shouldLoad: () => true,
});

/* ── data ─────────────────────────────────────────────── */

type Cat = "fiestas" | "madera" | "3d" | "postres";

type Product = {
  id: string;
  name: string;
  cat: Cat;
  price: number;
  img: string;
  tag: string;
  desc: string;
};

const CATS: { id: "todos" | Cat; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "fiestas", label: "Fiestas & Eventos" },
  { id: "madera", label: "Madera & Láser" },
  { id: "3d", label: "Impresión 3D" },
  { id: "postres", label: "Postres Saludables" },
];

const PRODUCTS: Product[] = [
  {
    id: "backdrop",
    name: "Backdrop de globos personalizado",
    cat: "fiestas",
    price: 189,
    img: pFiestas,
    tag: "Montaje incluido",
    desc: "Arco orgánico de globos con panel impreso y nombre en tipografía script. Incluye diseño, montaje y desmontaje en tu evento.",
  },
  {
    id: "icopor",
    name: "Letras en icopor 3D (30 cm)",
    cat: "fiestas",
    price: 12,
    img: pIcopor,
    tag: "Precio por letra",
    desc: "Letras talladas en icopor de alta densidad, acabado sellado y pintado al color de tu fiesta. Ligeras y reutilizables.",
  },
  {
    id: "logo-madera",
    name: "Letrero corporativo en madera láser",
    cat: "madera",
    price: 240,
    img: pMadera,
    tag: "Corte de precisión",
    desc: "Logotipo cortado a láser en nogal o roble, con separadores ocultos para efecto flotante en recepción u oficina.",
  },
  {
    id: "pocillo",
    name: "Pocillo cerámico personalizado",
    cat: "madera",
    price: 16,
    img: pPocillo,
    tag: "Sublimación premium",
    desc: "Pocillo de 11 oz con tu nombre, frase o logotipo. Tinta apta para lavavajillas y microondas.",
  },
  {
    id: "soporte3d",
    name: "Soporte 3D para escritorio",
    cat: "3d",
    price: 34,
    img: p3d,
    tag: "PLA ecológico",
    desc: "Soporte modular impreso en 3D para celular, audífonos y lápices. Disponible en grafito, ámbar y rosa.",
  },
  {
    id: "postres",
    name: "Caja de postres fit (6 unidades)",
    cat: "postres",
    price: 28,
    img: pPostres,
    tag: "Sin azúcar añadida",
    desc: "Brownies de cacao y cupcakes proteicos con frutos rojos. Endulzados con stevia y empaque personalizado.",
  },
];

const FONTS = [
  { id: "sans", label: "Moderna Sans", css: "var(--font-sans)" },
  { id: "serif", label: "Elegante Serif", css: "var(--font-serif)" },
  { id: "mono", label: "Técnica Mono", css: "var(--font-mono)" },
];

const THEMES = [
  { id: "amber", label: "Ámbar Madera", token: "var(--amber)" },
  { id: "rose", label: "Rosa Fiesta", token: "var(--rose)" },
  { id: "healthy", label: "Verde Healthy", token: "var(--healthy)" },
  { id: "graphite", label: "Negro Grafito", token: "var(--graphite)" },
];

const BASES = [
  { id: "letrero", label: "Letrero Personalizado", price: 58 },
  { id: "pocillo", label: "Pocillo de Cerámica", price: 16 },
  { id: "caja", label: "Caja de Postres Fit", price: 28 },
];

const REVIEWS = [
  {
    name: "Daniela Ruiz",
    role: "Cumpleaños temático · Medellín",
    text: "El backdrop y las letras en icopor quedaron idénticos al boceto. Llegaron 3 horas antes y montaron todo sin que yo moviera un dedo.",
  },
  {
    name: "Andrés Villa",
    role: "Gerente de oficina · Bogotá",
    text: "Nuestro logo en madera cortado a láser cambió por completo la recepción. Los acabados y el empaque fueron impecables.",
  },
  {
    name: "Laura Mejía",
    role: "Entrenadora fitness",
    text: "Pido las cajas de postres fit cada semana para mis clientas. Sin azúcar, deliciosos y con etiqueta personalizada.",
  },
  {
    name: "Carlos Peña",
    role: "Ingeniero mecánico",
    text: "Subí un STEP y en minutos tenía presupuesto. Las piezas en PETG soportaron perfecto la prueba de carga.",
  },
  {
    name: "Sofía Cárdenas",
    role: "Wedding planner",
    text: "Los pocillos personalizados como recordatorio fueron el detalle más comentado de la boda.",
  },
  {
    name: "Julián Ortiz",
    role: "Startup de hardware",
    text: "Prototipos en resina con un nivel de detalle que no había conseguido con otros talleres de la ciudad.",
  },
];

/* ── icons ─────────────────────────────────────────────── */

const Icon = {
  cart: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={c}>
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.55L21 8H6" strokeLinecap="round" />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  heart: (c = "", filled = false) => (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      className={c}
    >
      <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20z" />
    </svg>
  ),
  search: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={c}>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  ),
  upload: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={c}>
      <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
    </svg>
  ),
  close: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={c}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  ),
  star: (c = "") => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={c}>
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />
    </svg>
  ),
};

/* ── page ─────────────────────────────────────────────── */

function JacDesign() {
  const [cat, setCat] = useState<"todos" | Cat>("todos");
  const [wish, setWish] = useState<string[]>([]);
  const [cart, setCart] = useState<{ id: string; name: string; price: number }[]>([]);
  const [quick, setQuick] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const toastId = useRef(0);

  // customizer
  const [base, setBase] = useState(BASES[0]!);
  const [text, setText] = useState("Familia Jaramillo");
  const [font, setFont] = useState(FONTS[0]!);
  const [theme, setTheme] = useState(THEMES[0]!);

  // 3D quoter
  const [file, setFile] = useState<string | null>(null);
  const [material, setMaterial] = useState("PLA Ecológico");
  const [infill, setInfill] = useState("40");
  const [dragging, setDragging] = useState(false);

  const toast = (text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const filtered = useMemo(
    () => (cat === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)),
    [cat],
  );
  const total = cart.reduce((s, i) => s + i.price, 0);

  const addToCart = (p: { id: string; name: string; price: number }) => {
    setCart((c) => [...c, { id: p.id, name: p.name, price: p.price }]);
    toast(`${p.name} añadido al carrito`);
  };

  const toggleWish = (p: Product) => {
    setWish((w) => (w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id]));
    toast(wish.includes(p.id) ? "Eliminado de favoritos" : "Guardado en favoritos");
  };

  const customPrice = useMemo(() => {
    const extra = Math.min(text.trim().length, 40) * 0.6 + (font.id === "serif" ? 4 : 0);
    return Math.round((base.price + extra) * 100) / 100;
  }, [base, text, font]);

  const quote = () => {
    const vol = 42 + infill.length * 7 + material.length * 3;
    const price = Math.round(vol * (material.startsWith("Resina") ? 1.9 : 1.1) * 0.9);
    toast(`Volumen ≈ ${vol} cm³ · Presupuesto USD ${price}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-dark text-dark">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-8">
          <a href="#inicio" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-warm text-base font-black tracking-tight text-rose-foreground shadow-soft dark:shadow-none">
              JD
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold tracking-tight">
                Jac Design
              </span>
              <span className="block truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                3D • Fiestas • Láser • Icopor • Postres
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <nav className="mr-2 hidden items-center gap-6 text-sm font-medium transition-colors dark:text-dark/60 xl:flex">
              {[
                ["#inicio", "Inicio"],
                ["#colecciones", "Servicios y Colecciones"],
                ["#personalizador", "Personalizador en Vivo"],
                ["#cotizador", "Cotizador 3D IA"],
                ["#galeria", "Galería de Clientes"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="transition-colors hover:text-foreground">
                  {label}
                </a>
              ))}
            </nav>
            <button
              onClick={() => toast(`${wish.length} artículo(s) en tu lista de deseos`)}
              className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card transition-colors hover:bg-muted"
              aria-label="Lista de deseos"
            >
              {Icon.heart("h-5 w-5 text-rose", wish.length > 0)}
              <Badge n={wish.length} />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card transition-colors hover:bg-muted"
              aria-label="Carrito de compras"
            >
              {Icon.cart("h-5 w-5")}
              <Badge n={cart.length} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-background to-dark dark:from-dark dark:to-secondary">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber/25 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose/20 blur-3xl animate-pulse" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Taller de fabricación digital
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Diseño integral para tus{" "}
              <span className="bg-gradient-warm bg-clip-text text-transparent">ideas</span> y tus{" "}
              <span className="bg-gradient-warm bg-clip-text text-transparent">celebraciones</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Impresión 3D, corte láser en madera, letreros en icopor, decoración de fiestas y
              repostería saludable. Un solo taller para imaginar, personalizar y recibir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#colecciones"
                className="rounded-2xl bg-gradient-warm px-6 py-3.5 text-sm font-bold text-rose-foreground shadow-soft transition-transform hover:scale-[1.03] dark:hover:bg-primary dark:hover:text-primary-foreground"
              >
                Explorar catálogo
              </a>
              <a
                href="#personalizador"
                className="rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-bold transition-colors dark:bg-dark dark:border-dark dark:hover:bg-muted dark:hover:text-foreground"
              >
                Abrir configurador
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["+1.200", "Proyectos"],
                ["48 h", "Prototipado"],
                ["4.9★", "Reseñas"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-border bg-card/70 p-4">
                  <dt className="text-xl font-black tracking-tight">{v}</dt>
                  <dd className="text-xs font-medium text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={hero}
              width={1200}
              height={1400}
              alt="Montaje de fiesta con arco de globos y letrero de madera personalizado de Jac Design"
              className="w-full rounded-[2rem] object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 left-4 right-4 rounded-3xl border border-white/50 bg-card/60 p-5 shadow-soft backdrop-blur-md sm:left-8 sm:right-auto sm:w-72">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Montaje del día
              </p>
              <p className="mt-1 text-lg font-extrabold tracking-tight">
                Arco orgánico + letrero grabado
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Diseño, armado y desmontaje.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="colecciones" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Servicios y colecciones
          </h2>
          <p className="mt-3 text-muted-foreground">
            Filtra por línea de trabajo y arma tu pedido: eventos, madera, impresión 3D o repostería
            fit.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                cat === c.id
                  ? "bg-gradient-warm text-rose-foreground shadow-soft dark:bg-primary dark:text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground dark:text-dark hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft dark:border-dark/50 dark:bg-dark"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  width={900}
                  height={700}
                  loading="lazy"
                  alt={p.name}
                  className="h-52 w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105 hover:brightness-110 group-hover:scale-105 group-hover:brightness-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-card/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {p.tag}
                </span>
                <div className="absolute right-3 top-3 flex flex-col gap-2">
<button
                    onClick={() => toggleWish(p)}
                    aria-label="Añadir a favoritos"
                    className="grid h-9 w-9 place-items-center rounded-full bg-card/85 text-rose backdrop-blur-md transition-transform hover:scale-110 dark:hover:text-rose"
>
                    {Icon.heart("h-4 w-4", wish.includes(p.id))}
                  </button>
                  <button
                    onClick={() => setQuick(p)}
                    aria-label="Vista rápida"
                    className="grid h-9 w-9 place-items-center rounded-full bg-card/85 backdrop-blur-md transition-transform hover:scale-110"
                  >
                    {Icon.search("h-4 w-4")}
                  </button>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug tracking-tight">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xl font-black tracking-tight">USD {p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.04]"
                  >
                    {Icon.cart("h-4 w-4")} Añadir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CUSTOMIZER */}
      <section id="personalizador" className="bg-muted/60 py-20 dark:bg-dark/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Personalizador en vivo
            </h2>
            <p className="mt-3 text-muted-foreground">
              Escribe, elige tipografía y acabado: el mockup y el precio se actualizan al instante.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
            <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <Field label="Producto base">
                <div className="grid gap-2 sm:grid-cols-3">
                  {BASES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBase(b)}
                      className={`rounded-2xl border px-3 py-3 text-xs font-bold leading-tight transition-colors ${
                        base.id === b.id
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Texto, dedicatoria o logotipo">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={40}
                  placeholder="Escribe aquí…"
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-amber"
                />
              </Field>

              <Field label="Tipografía">
                <div className="grid gap-2 sm:grid-cols-3">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFont(f)}
                      style={{ fontFamily: f.css }}
                      className={`rounded-2xl border px-3 py-3 text-xs font-bold transition-colors ${
                        font.id === f.id
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={`Acabado · ${theme.label}`}>
                <div className="flex gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      aria-label={t.label}
                      style={{ backgroundColor: t.token }}
                      className={`h-10 w-10 rounded-full transition-transform ${
                        theme.id === t.id
                          ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-card"
                          : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </Field>

              <button
                onClick={() =>
                  addToCart({
                    id: `custom-${Date.now()}`,
                    name: `${base.label} · "${text.trim() || "Sin texto"}"`,
                    price: customPrice,
                  })
                }
                className="w-full rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-rose-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Añadir personalización — USD {customPrice.toFixed(2)}
              </button>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Vista previa en vivo
              </p>
              <div
                className="mt-4 grid min-h-[320px] place-items-center rounded-[1.75rem] p-8 text-center"
                style={{
                  backgroundColor: `color-mix(in oklab, ${theme.token} 16%, white)`,
                  border: `2px solid color-mix(in oklab, ${theme.token} 45%, white)`,
                }}
              >
                <div
                  className={
                    base.id === "pocillo"
                      ? "relative grid h-44 w-56 place-items-center rounded-2xl bg-white shadow-soft"
                      : base.id === "caja"
                        ? "grid h-44 w-64 place-items-center rounded-xl bg-white shadow-soft"
                        : "grid h-40 w-72 place-items-center rounded-lg bg-white shadow-soft"
                  }
                  style={{ outline: `6px solid color-mix(in oklab, ${theme.token} 70%, white)` }}
                >
                  <span
                    className="max-w-full break-words px-4 text-2xl font-bold leading-tight"
                    style={{ fontFamily: font.css, color: theme.token }}
                  >
                    {text.trim() || "Tu texto aquí"}
                  </span>
                  {base.id === "pocillo" && (
                    <span
                      className="absolute -right-7 top-9 h-16 w-14 rounded-full border-8 border-white"
                      style={{ borderColor: "white" }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["Base", base.label],
                  ["Tipografía", font.label],
                  ["Precio", `USD ${customPrice.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-muted p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {k}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-tight">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D QUOTER */}
      <section id="cotizador" className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-muted/60 dark:bg-dark/60">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Maker Studio · Cotizador 3D instantáneo
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Sube tu modelo, elige material y densidad de relleno, y recibe el presupuesto estimado
              en segundos.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "Formatos STL, OBJ y STEP hasta 120 MB",
                "Revisión de geometría y espesores antes de imprimir",
                "Impresión FDM y resina UV en el mismo taller",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-warm" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
<label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files?.[0];
                setFile(f ? f.name : "modelo-demo.stl");
                toast("Archivo cargado y analizado");
              }}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-[1.5rem] border-2 border-dashed p-8 text-center transition-colors ${
                dragging ? "border-amber bg-amber/10" : `border-border bg-muted/50 dark:bg-muted/80 hover:bg-muted`}
              }`}
            >
              <ModelViewer id="preview-model" onSelect={(url) => toast(`Modelo cargado: ${url.split('/').pop()}`)} />
              
              <input
                type="file"
                accept=".stl,.obj,.step,.stp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f.name);
                    toast("Archivo cargado y analizado");
                  }
                }}
              />
              {Icon.upload("h-9 w-9 text-muted-foreground")}
              <span className="text-sm font-bold">
                {file ?? "Arrastra tu archivo STL, OBJ o STEP"}
              </span>
              <span className="text-xs text-muted-foreground">o haz clic para seleccionarlo</span>
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Material">
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber"
                >
                  <option>PLA Ecológico</option>
                  <option>PETG Alta Resistencia</option>
                  <option>Resina UV Detalle Fino</option>
                </select>
              </Field>
              <Field label="Densidad de relleno">
                <select
                  value={infill}
                  onChange={(e) => setInfill(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber"
                >
                  <option value="20">Infill 20%</option>
                  <option value="40">Infill 40%</option>
                  <option value="100">Infill 100%</option>
                </select>
              </Field>
            </div>

            <button
              onClick={quote}
              className="mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Calcular presupuesto al instante
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="galeria" className="bg-muted/60 py-20 dark:bg-dark/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Galería de clientes</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Eventos, oficinas, makers y repostería fit. Esto dicen quienes ya crearon con nosotros.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="rounded-3xl border border-border bg-card p-6 group-hover:shadow-lg group-hover:border-amber transition-all">
                <div className="flex gap-1 text-amber">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i}>{Icon.star("h-4 w-4")}</span>
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5">
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 bg-muted/60 dark:bg-dark/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-sm text-muted-foreground lg:px-8">
          <span className="font-bold text-foreground">Jac Design</span>
          <span>Impresión 3D · Fiestas · Corte láser · Icopor · Repostería saludable</span>
          <span className="text-xs">
            Datos de contacto pendientes: envíanos tu teléfono, correo y horario para publicarlos.
          </span>
        </div>
      </footer>

      {/* QUICK VIEW MODAL */}
      {quick && (
        <Modal onClose={() => setQuick(null)} title="Vista rápida">
          <div className="grid gap-6 sm:grid-cols-2">
            <img
              src={quick.img}
              width={900}
              height={700}
              loading="lazy"
              alt={quick.name}
              className="h-56 w-full rounded-2xl object-cover sm:h-full"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {quick.tag}
              </span>
              <h3 className="mt-2 text-2xl font-black tracking-tight">{quick.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {quick.desc}
              </p>
              <p className="mt-4 text-2xl font-black">USD {quick.price}</p>
              <button
                onClick={() => {
                  addToCart(quick);
                  setQuick(null);
                }}
                className="mt-4 rounded-2xl bg-gradient-warm py-3.5 text-sm font-bold text-rose-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CART MODAL */}
      {cartOpen && (
        <Modal onClose={() => setCartOpen(false)} title="Tu carrito">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Tu carrito está vacío. Explora las colecciones o crea una personalización.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border">
                {cart.map((item, i) => (
                  <li key={`${item.id}-${i}`} className="flex items-center gap-3 py-3">
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold">USD {item.price.toFixed(2)}</span>
                    <button
                      onClick={() => setCart((c) => c.filter((_, idx) => idx !== i))}
                      aria-label="Eliminar"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
                    >
                      {Icon.close("h-4 w-4")}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted p-4">
                <span className="text-sm font-semibold text-muted-foreground">Total</span>
                <span className="text-xl font-black">USD {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setCart([]);
                  setCartOpen(false);
                  toast("¡Pago exitoso! Te contactaremos con tu orden");
                }}
                className="mt-4 w-full rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-rose-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Proceder al pago seguro
              </button>
            </>
          )}
        </Modal>
      )}

      {/* TOASTS */}
      <div className="pointer-events-none fixed bottom-5 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-bounce rounded-2xl bg-slate-deep px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-warm px-1 text-[10px] font-black text-rose-foreground">
      {n}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-deep/80 dark:bg-dark/80 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-black tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            {Icon.close("h-4 w-4")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
