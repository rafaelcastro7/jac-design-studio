import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Quoter3D } from "@/components/Quoter3D";

import hero from "@/assets/hero-jac.jpg";


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
      { name: "format-detection", content: "telephone=no" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],
  }),
  component: JacDesign,
});


import { CATS, PRODUCTS, type Cat, type Product } from "@/data/products";

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
  truck: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={c}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" strokeLinecap="round" />
      <path d="M14 9h4.5a2 2 0 0 1 1.8 1.1l1.6 3.1a2 2 0 0 1 .1.8V17a1 1 0 0 1-1 1h-2" strokeLinecap="round" />
      <circle cx="7.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  ),
  filter: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={c}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkles: (c = "") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={c}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ── page ─────────────────────────────────────────────── */

function JacDesign() {
  const [cat, setCat] = useState<"todos" | Cat>("todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [onlyPopular, setOnlyPopular] = useState(false);
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

  const toast = (text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const categoryTabs = useMemo(() => {
    return CATS.map((c) => ({
      ...c,
      count: c.id === "todos" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === c.id).length,
    }));
  }, []);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (cat !== "todos") {
      list = list.filter((p) => p.cat === cat);
    }
    if (onlyPopular) {
      list = list.filter((p) => p.popular);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sort === "rating") {
      return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    return list;
  }, [cat, onlyPopular, search, sort]);
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
      <section id="inicio" className="relative min-h-[700px] bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-dark dark:via-dark dark:to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-transparent dark:from-amber-600/30 dark:via-transparent dark:to-transparent" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-100 blur-3xl dark:bg-amber-900/20" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose-100 blur-3xl dark:bg-rose-900/20" />
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-warm px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-foreground shadow-soft mb-6">
                Taller de fabricación digital
              </span>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl mb-6">
                Diseño integral para tus
              <span className="bg-gradient-warm bg-clip-text text-transparent">ideas</span>
              y
              <span className="bg-gradient-warm bg-clip-text text-transparent">celebraciones</span>
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground text-lg max-w-xl mb-8">
                Impresión 3D, corte láser en madera, letreros en icopor, decoración de fiestas y repostería saludable. Un solo taller para imaginar, personalizar y recibir tu pedido en tiempo récord.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <a
                  href="#colecciones"
                  className="rounded-2xl bg-gradient-warm px-6 py-3 text-sm font-bold text-rose-foreground shadow-soft transition-all hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
                >
                  Explorar catálogo
                </a>
                <a
                  href="#personalizador"
                  className="rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold transition-colors dark:border-dark hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
                >
                  Iniciar configurador
                </a>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-card p-3 flex items-center gap-2">
                  <span className="text-amber-500">🚀</span> +1.200 proyectos
                </div>
                <div className="rounded-xl bg-card p-3 flex items-center gap-2">
                  <span className="text-amber-500">⚡</span> 48h prototipado
                </div>
                <div className="rounded-xl bg-card p-3 flex items-center gap-2">
                  <span className="text-amber-500">★4.9</span> Reseñas verificadas
                </div>
              </div>
            </div>
            <div className="relative lg:order-2">
              <img
                src={hero}
                alt="Montaje de fiesta con arco de globos y letrero de madera personalizado de Jac Design"
                className="w-full rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] dark:shadow-none"
                loading="lazy"
              />
              <div className="absolute -inset-4 rounded-3xl border border-amber/20 blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

{/* CATALOG */}
      <section id="colecciones" className="py-24 lg:py-32 bg-muted/60 dark:bg-dark/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">
              Catálogo Exclusivo 2026
            </span>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl mb-4">
              Servicios y colecciones premium
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              50 productos de alta demanda organizados en nuestras 5 líneas especializadas: eventos, madera láser, impresión 3D, repostería fit y juguetes sensoriales.
            </p>
          </div>

          {/* Categorías con contadores */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categoryTabs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`
                    inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all
                    ${
                      cat === c.id
                        ? "bg-gradient-warm text-rose-foreground shadow-soft scale-105"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground dark:text-dark hover:border-amber/50"
                    }
                  `}
                >
                  <span>{c.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                      cat === c.id
                        ? "bg-black/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toolbar de búsqueda, filtros y ordenamiento */}
          <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft">
            <div className="relative w-full md:w-80">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                {Icon.search("h-4 w-4")}
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, material..."
                className="w-full rounded-2xl border border-input bg-background pl-10 pr-10 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-amber"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {Icon.close("h-4 w-4")}
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => setOnlyPopular(!onlyPopular)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-colors ${
                  onlyPopular
                    ? "bg-amber-500 text-white shadow-soft"
                    : "border border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon.sparkles("h-3.5 w-3.5")}
                <span>Solo Más Vendidos</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                  Ordenar:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="rounded-2xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="rating">Mejor valorados (★)</option>
                </select>
              </div>

              <span className="text-xs font-bold text-muted-foreground px-2">
                {filtered.length} {filtered.length === 1 ? "resultado" : "productos"}
              </span>
            </div>
          </div>

          {/* Grid de Productos */}
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
                {Icon.search("h-7 w-7")}
              </div>
              <h3 className="text-xl font-bold">No se encontraron productos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Intenta con otro término de búsqueda o restablece los filtros.
              </p>
              <button
                onClick={() => {
                  setCat("todos");
                  setSearch("");
                  setOnlyPopular(false);
                  setSort("featured");
                }}
                className="mt-6 rounded-2xl bg-gradient-warm px-6 py-2.5 text-sm font-bold text-rose-foreground shadow-soft"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col rounded-3xl border border-border bg-card shadow-soft dark:border-dark/50 dark:bg-dark overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-amber hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={p.img}
                      width={800}
                      height={600}
                      loading="lazy"
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Tag badge */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5 items-start">
                      <span className="rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                        {p.tag}
                      </span>
                      {p.popular && (
                        <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                          {Icon.sparkles("h-2.5 w-2.5")} Bestseller
                        </span>
                      )}
                    </div>

                    {/* Actions on top-right */}
                    <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
                      <button
                        onClick={() => toggleWish(p)}
                        aria-label="Añadir a favoritos"
                        className="grid h-9 w-9 place-items-center rounded-full bg-card/90 text-rose backdrop-blur-md transition-transform hover:scale-115 shadow-sm"
                      >
                        {Icon.heart("h-4 w-4", wish.includes(p.id))}
                      </button>
                      <button
                        onClick={() => setQuick(p)}
                        aria-label="Vista rápida"
                        className="grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur-md transition-transform hover:scale-115 shadow-sm hover:text-primary"
                      >
                        {Icon.search("h-4 w-4")}
                      </button>
                    </div>

                    {/* Rating badge bottom right */}
                    <div className="absolute right-3 bottom-3 rounded-full bg-black/60 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-md flex items-center gap-1">
                      <span className="text-amber-400">{Icon.star("h-3 w-3")}</span>
                      <span>{p.rating.toFixed(1)}</span>
                      <span className="text-white/70 text-[10px]">({p.reviewCount})</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 mb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="text-primary font-bold">
                        {CATS.find((c) => c.id === p.cat)?.label}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {Icon.truck("h-3 w-3")} {p.leadTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {p.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-1">
                      {p.desc}
                    </p>

                    <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Precio
                        </span>
                        <span className="text-xl font-black tracking-tight">
                          USD {p.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(p)}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.04] shadow-sm"
                        >
                          {Icon.cart("h-3.5 w-3.5")} Añadir
                        </button>
                        <button
                          onClick={() => setQuick(p)}
                          className="inline-flex items-center gap-1 rounded-2xl bg-muted px-3 py-2 text-xs font-bold transition-colors hover:bg-muted/80"
                          title="Vista rápida"
                        >
                          {Icon.search("h-3.5 w-3.5")} Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

{/* CUSTOMIZER */}
      <section id="personalizador" className="py-24 lg:py-32 bg-muted/60 dark:bg-dark/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl mb-4">
              Personalizador en vivo
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Escribe, elige tipografía y acabado: el mockup y el precio se actualizan al instante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
            <div className="space-y-6">
              <Field label="Producto base">
                <div className="grid gap-2 sm:grid-cols-3">
                  {BASES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBase(b)}
                      className={`
                        rounded-2xl border px-3 py-3 text-xs font-bold leading-tight transition-colors
                        ${base.id === b.id ? 'border-transparent bg-primary text-primary-foreground' : 'border-border hover:bg-muted dark:hover:bg-dark'}
                      `}
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
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-amber dark:text-dark dark:bg-dark dark:focus:ring-amber"
                />
              </Field>

              <Field label="Tipografía">
                <div className="grid gap-2 sm:grid-cols-3">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFont(f)}
                      style={{ fontFamily: f.css }}
                      className={`
                        rounded-2xl border px-3 py-3 text-xs font-bold transition-colors
                        ${font.id === f.id ? 'border-transparent bg-primary text-primary-foreground' : 'border-border hover:bg-muted dark:hover:bg-dark'}
                      `}
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
                      className={`
                        h-10 w-10 rounded-full transition-transform
                        ${theme.id === t.id ? 'scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-card' : 'hover:scale-105 dark:hover:scale-105'}
                      `}
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
                className="w-full rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-rose-foreground shadow-soft transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 mt-4"
              >
                Añadir personalización — USD {customPrice.toFixed(2)}
              </button>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
                Vista previa en vivo
              </p>
              <div
                className="mt-4 grid min-h-[300px] place-items-center rounded-[1.5rem] p-6 text-center"
                style={{
                  backgroundColor: `color-mix(in oklab, ${theme.token} 15%, white)`,
                  border: `2px solid color-mix(in oklab, ${theme.token} 40%, white)`,
                }}
              >
                <div
                  className={
                    base.id === "pocillo"
                      ? "relative grid h-40 w-52 place-items-center rounded-2xl bg-white shadow-soft"
                      : base.id === "caja"
                        ? "grid h-40 w-60 place-items-center rounded-xl bg-white shadow-soft"
                        : "grid h-38 w-68 place-items-center rounded-lg bg-white shadow-soft"
                  }
                  style={{ outline: `6px solid color-mix(in oklab, ${theme.token} 65%, white)` }}
                >
                  <span
                    className="max-w-full break-words px-4 text-2xl font-bold leading-tight"
                    style={{ fontFamily: font.css, color: theme.token }}
                  >
                    {text.trim() || "Tu texto aquí"}
                  </span>
                  {base.id === "pocillo" && (
                    <span
                      className="absolute -right-6 top-8 h-14 w-12 rounded-full border-8 border-white"
                      style={{ borderColor: "white" }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                {[
                  ["Base", base.label],
                  ["Tipografía", font.label],
                  ["Precio", `USD ${customPrice.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-muted p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</p>
                    <p className="mt-1 font-bold leading-tight">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

{/* 3D QUOTER */}
      <section id="cotizador" className="py-24 lg:py-32 bg-muted/40 dark:bg-dark/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              Studio 3D en Tiempo Real
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl mb-4">
              Maker Studio · Cotizador 3D Interactivo
            </h2>
            <p className="text-muted-foreground text-lg">
              Visualiza geometrías en 3D con shaders en vivo, sube tus archivos STL con cálculo automático de volumen, ajusta materiales de ingeniería e infill, y obtén presupuestos precisos al instante.
            </p>
          </div>

          <Quoter3D
            onAddToCart={(item) => {
              addToCart(item);
              setCartOpen(true);
            }}
          />
        </div>
      </section>

      {/* REVIEWS */}
      <section id="galeria" className="py-24 lg:py-32 bg-muted/60 dark:bg-dark/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl mb-4">
              Galería de clientes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Eventos, oficinas, makers y repostería fit. Esto dicen quienes ya crearon con nosotros.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <article
                key={r.name}
                className="group rounded-xl bg-card p-6 border border-border shadow-soft dark:border-dark/50 dark:bg-dark transition-all hover:shadow-lg hover:border-amber"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{r.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{r.name}</p>
                    <p className="text-sm text-muted-foreground">{r.role}</p>
                  </div>
                </div>
                <blockquote className="mb-4 leading-relaxed text-muted-foreground line-clamp-3">
                  “{r.text}”
                </blockquote>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="text-amber-500 text-xs">
                      {Icon.star("h-3 w-3")}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 lg:py-16 bg-dark border-t border-dark/50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="text-2xl font-black tracking-wider text-rose-foreground mb-4 block">Jac Design</span>
              <p className="text-muted-foreground text-sm">
                Impresión 3D · Fiestas · Corte láser · Icopor · Repostería saludable
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Enlaces rápidos</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#inicio" className="transition-colors hover:text-foreground">Inicio</a></li>
                <li><a href="#colecciones" className="transition-colors hover:text-foreground">Catálogo</a></li>
                <li><a href="#personalizador" className="transition-colors hover:text-foreground">Configurador</a></li>
                <li><a href="#cotizador" className="transition-colors hover:text-foreground">Cotizador 3D</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Servicios</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Impresión 3D en PLA, PETG y Resina</li>
                <li>Corte láser en madera y icopor</li>
                <li>Decoración de fiestas personalizada</li>
                <li>Repostería saludable y fit</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Contacto</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Responde en hasta 48 horas
              </p>
              <a
                href="mailto:contacto@jac-design.com"
                className="text-rose-foreground hover:text-rose-foreground transition-colors"
              >
                contacto@jac-design.com
              </a>
              <p className="text-xs text-muted-foreground">
                Lunes a Viernes: 9:00 - 18:00
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-dark/20 flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              2026 Jac Design. Todos los derechos reservados.
            </p>
            <div className="flex gap-3">
              {/* Social links would go here */}
            </div>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW MODAL */}
      {quick && (
        <Modal onClose={() => setQuick(null)} title="Detalle de producto">
          <div className="grid gap-6 sm:grid-cols-2 items-start">
            <div className="relative overflow-hidden rounded-2xl bg-muted">
              <img
                src={quick.img}
                width={900}
                height={700}
                loading="lazy"
                alt={quick.name}
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
              />
              <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                {quick.tag}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                  {CATS.find((c) => c.id === quick.cat)?.label}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  {Icon.star("h-3.5 w-3.5")}
                  <span>{quick.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground font-normal text-[11px]">
                    ({quick.reviewCount} opiniones verificadas)
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-black tracking-tight">{quick.name}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {quick.desc}
              </p>

              {/* Ficha técnica */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-2xl bg-muted/50 p-3.5 border border-border/70 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Material / Base
                  </span>
                  <span className="font-semibold text-foreground">{quick.material}</span>
                </div>
                {quick.dimensions && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Dimensiones
                    </span>
                    <span className="font-semibold text-foreground">{quick.dimensions}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Tiempo de producción
                  </span>
                  <span className="font-semibold text-foreground">{quick.leadTime}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Disponibilidad
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Bajo demanda / Inmediata
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Precio total
                  </span>
                  <p className="text-3xl font-black tracking-tight">USD {quick.price}</p>
                </div>
                <button
                  onClick={() => {
                    addToCart(quick);
                    setQuick(null);
                  }}
                  className="rounded-2xl bg-gradient-warm px-6 py-3.5 text-sm font-bold text-rose-foreground shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  {Icon.cart("h-4 w-4 inline mr-2")} Añadir al carrito
                </button>
              </div>
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
