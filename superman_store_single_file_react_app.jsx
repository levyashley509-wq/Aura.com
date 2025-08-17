import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Filter, X, Trash2, Star, Shield, Truck, CreditCard, Sparkles, Menu } from "lucide-react";

// --- Utility UI bits (chips, badge, etc.) ---
const Chip = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full border text-sm transition-all ${
      active ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white/70 backdrop-blur border-gray-200 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
    <Sparkles className="h-3 w-3" /> {children}
  </span>
);

// --- Sample product data ---
const PRODUCTS = [
  {
    id: "cape-pro",
    name: "Krypton Cape PRO",
    price: 79.99,
    rating: 4.8,
    tag: "Best Seller",
    category: "Gear",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop",
    desc: "Wind‑tunnel tested, photo‑friendly drape. Cape clips included.",
  },
  {
    id: "tee-classic",
    name: "House of El Tee (Classic)",
    price: 24.0,
    rating: 4.6,
    tag: "Limited",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    desc: "Ultra‑soft cotton tee with the iconic crest. Unisex sizing.",
  },
  {
    id: "figure-premium",
    name: "Superman Premium Figure 1:6",
    price: 189.0,
    rating: 4.9,
    tag: "Collector",
    category: "Collectibles",
    image: "https://images.unsplash.com/photo-1546778316-dfda79f1c512?q=80&w=1200&auto=format&fit=crop",
    desc: "High‑detail figure with interchangeable poses and magnetic base.",
  },
  {
    id: "mug-steel",
    name: "Daily Planet Mug – Steel",
    price: 18.5,
    rating: 4.5,
    tag: "New",
    category: "Home",
    image: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b64?q=80&w=1200&auto=format&fit=crop",
    desc: "Double‑wall insulated. Holds 12oz of newsroom fuel.",
  },
  {
    id: "hoodie-winter",
    name: "Metropolis Hoodie (Winter Weight)",
    price: 64.0,
    rating: 4.7,
    tag: "Cozy",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1523380744952-b7d081ea0e09?q=80&w=1200&auto=format&fit=crop",
    desc: "Heavy fleece, kangaroo pocket, embroidered crest patch.",
  },
  {
    id: "poster-vintage",
    name: "Vintage Poster – Up, Up and Away!",
    price: 22.0,
    rating: 4.4,
    tag: "Retro",
    category: "Art",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    desc: "Matte finish A2 print with archival inks.",
  },
  {
    id: "ring-krypton",
    name: "Kryptonian Crest Ring",
    price: 49.0,
    rating: 4.3,
    tag: "Gift",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop",
    desc: "Stainless steel band with laser‑etched emblem.",
  },
  {
    id: "book-origin",
    name: "Origins of Superman – Artbook",
    price: 36.0,
    rating: 4.8,
    tag: "Reader Fav",
    category: "Books",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    desc: "Concept art, timelines, and lore for fans and creators.",
  },
];

// --- Currency util ---
const toUSD = (n) => `$${n.toFixed(2)}`;

// --- Main App ---
export default function SupermanStore() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))], []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      p.price <= maxPrice &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, category, maxPrice]);

  const add = (item) => {
    setCart(prev => {
      const g = prev.find(p => p.id === item.id);
      if (g) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const remove = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const inc = (id) => setCart(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  const dec = (id) => setCart(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p));

  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(v => !v)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-red-600 grid place-items-center font-extrabold">S</div>
            <div>
              <div className="font-black tracking-tight text-xl">Superman Shop</div>
              <div className="text-xs text-blue-200/90">Up, Up and Away Deals</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 min-w-[380px]">
            <div className="flex items-center gap-2 w-full bg-white/10 rounded-2xl px-3 py-2 ring-1 ring-white/10">
              <Search className="h-5 w-5 opacity-80" />
              <input
                placeholder="Search products…"
                className="bg-transparent outline-none w-full placeholder:text-slate-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-2xl px-3 py-2 bg-blue-600 hover:bg-blue-500 transition shadow-md"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 grid place-items-center rounded-full border border-white/20">
                  {cart.reduce((s, p) => s + p.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex gap-2">
            <div className="flex items-center gap-2 w-full bg-white/10 rounded-2xl px-3 py-2 ring-1 ring-white/10">
              <Search className="h-5 w-5 opacity-80" />
              <input
                placeholder="Search products…"
                className="bg-transparent outline-none w-full placeholder:text-slate-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-2xl px-3 py-2 bg-blue-600 hover:bg-blue-500 transition shadow-md"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 grid place-items-center rounded-full border border-white/20">
                  {cart.reduce((s, p) => s + p.qty, 0)}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 py-3">
                  <Filter className="h-4 w-4" />
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {categories.map(c => (
                      <Chip key={c} active={c === category} onClick={() => setCategory(c)}>{c}</Chip>
                    ))}
                  </div>
                </div>
                <div className="pb-3">
                  <label className="text-xs opacity-80">Max Price: {toUSD(maxPrice)}</label>
                  <input type="range" min={10} max={200} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} className="w-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_10%,rgba(59,130,246,0.25),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge>Official‑style Fan Store</Badge>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Suit up like the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-white">Man of Steel</span>
            </h1>
            <p className="mt-4 text-slate-300 max-w-prose">
              Discover apparel, collectibles, and everyday gear inspired by Metropolis's favorite hero.
              This demo store is ready for your products and payments.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#catalog" className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-md font-semibold">Shop Catalog</a>
              <a href="#how" className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 ring-1 ring-white/10">How to add real checkout</a>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2"> <Shield className="h-4 w-4"/> 30‑day returns</div>
              <div className="flex items-center gap-2"> <Truck className="h-4 w-4"/> Free US shipping $60+</div>
              <div className="flex items-center gap-2"> <CreditCard className="h-4 w-4"/> Secure checkout</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop"
              alt="Stylized city skyline"
              className="rounded-3xl shadow-2xl border border-white/10"
            />
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-xl ring-1 ring-white/20">
              <div className="text-xs uppercase tracking-wider opacity-80">Today only</div>
              <div className="font-bold">Save 15% on Capes</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <div id="catalog" className="flex items-center gap-3">
            <Filter className="h-5 w-5 opacity-80" />
            <div className="hidden md:flex gap-2 flex-wrap">
              {categories.map(c => (
                <Chip key={c} active={c === category} onClick={() => setCategory(c)}>{c}</Chip>
              ))}
            </div>
          </div>
          <div className="hidden md:block w-64">
            <label className="text-xs opacity-80">Max Price: {toUSD(maxPrice)}</label>
            <input type="range" min={10} max={200} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow hover:shadow-xl transition">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="h-56 w-full object-cover group-hover:scale-[1.02] transition"/>
                  <div className="absolute top-3 left-3"><Badge>{p.tag}</Badge></div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold leading-snug">{p.name}</h3>
                      <div className="text-sm text-slate-300">{p.category}</div>
                    </div>
                    <div className="font-bold">{toUSD(p.price)}</div>
                  </div>
                  <p className="text-sm mt-2 text-slate-300 line-clamp-2">{p.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(p.rating) ? "fill-current" : "opacity-30"}`} />
                    ))}
                    <span className="text-xs text-slate-300 ml-2">{p.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={()=>add(p)} className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium">
                      Add to cart
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 ring-1 ring-white/10">Details</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to add real checkout */}
      <section id="how" className="border-t border-white/10 bg-slate-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold">Add real payments in 3 steps</h2>
          <ol className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
            <li className="rounded-2xl p-4 bg-white/5 border border-white/10">
              1) Create a Stripe account and a Product for each item. Copy the Checkout link (or Price ID).
            </li>
            <li className="rounded-2xl p-4 bg-white/5 border border-white/10">
              2) Replace the <code>add(p)</code> action with redirect to your Stripe Checkout link, or integrate Stripe Elements.
            </li>
            <li className="rounded-2xl p-4 bg-white/5 border border-white/10">
              3) Deploy on Vercel/Netlify. Add a success & cancel page. Enable webhooks for fulfillment.
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold">Superman Shop</div>
            <p className="text-slate-300 mt-2">Demo storefront for a hero‑themed brand. Swap images, text, and products for your own collection.</p>
          </div>
          <div>
            <div className="font-semibold">Support</div>
            <ul className="mt-2 space-y-1 text-slate-300">
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Legal</div>
            <p className="text-slate-300 mt-2">All product names and imagery are placeholders. Replace with assets you own or have rights to.</p>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400 pb-10">© {new Date().getFullYear()} Your Brand</div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
            <motion.aside
              initial={{ x: 480 }}
              animate={{ x: 0 }}
              exit={{ x: 480 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-white/10 shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className="font-semibold">Your Cart</div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-200px)]">
                {cart.length === 0 && (
                  <div className="text-slate-300">Your cart is empty. Add something heroic!</div>
                )}
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-center border border-white/10 rounded-2xl p-3 bg-white/5">
                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <div className="font-medium leading-tight">{item.name}</div>
                      <div className="text-sm text-slate-300">{toUSD(item.price)} • {item.category}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={()=>dec(item.id)} className="px-2 rounded-lg bg-white/10">−</button>
                        <span>{item.qty}</span>
                        <button onClick={()=>inc(item.id)} className="px-2 rounded-lg bg-white/10">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-semibold">{toUSD(item.price * item.qty)}</div>
                      <button onClick={()=>remove(item.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm">
                        <Trash2 className="h-4 w-4"/> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-300">Subtotal</div>
                  <div className="font-semibold">{toUSD(subtotal)}</div>
                </div>
                <button
                  disabled={cart.length === 0}
                  className="mt-3 w-full px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  onClick={() => alert("Connect Stripe or your gateway here ✨")}
                >
                  <CreditCard className="h-5 w-5" /> Checkout
                </button>
                <p className="text-[11px] text-slate-400 mt-2">
                  Demo only. Replace with your payment provider and policies.
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
