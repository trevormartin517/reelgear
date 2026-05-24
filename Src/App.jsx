import { useState, useEffect } from "react";

const FontLoader = () => {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&display=swap');`;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
};

const P = {
  navy: "#061827",
  navyMid: "#0D2E47",
  gold: "#C9933A",
  goldLt: "#E8B45C",
  teal: "#1AAFA0",
  white: "#F4F1EC",
  cream: "#EDE9E0",
  txt: "#1A1A2E",
  muted: "#7A8A96",
};

const COLORS = [
  { name: "Black", hex: "#1C1C1E", shade: "#2E2E30", text: "#fff" },
  { name: "Blue", hex: "#174B8A", shade: "#2060B8", text: "#fff" },
  { name: "Green", hex: "#254D22", shade: "#3A7031", text: "#fff" },
  { name: "White", hex: "#C8C8C0", shade: "#A8A8A0", text: "#222" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Garmin Striker 4",
    price: 19.99,
    category: "Fish Finder Covers",
    colors: ["Black", "Blue", "Green", "White"],
    shortDesc: "Anti-glare sun shade",
    description: "Precision-fit 3D printed sun shade for Garmin Striker 4.",
    specs: ["Fits Garmin Striker 4", "Tool-free friction fit", "UV-resistant PETG", "Free shipping"],
  },
  {
    id: 2,
    name: "Garmin Striker 4 Plus",
    price: 21.99,
    category: "Fish Finder Covers",
    colors: ["Black", "Blue", "Green", "White"],
    shortDesc: "Larger sun shade",
    description: "Scaled up for the Striker 4 Plus.",
    specs: ["Fits Garmin Striker 4 Plus", "Tool-free friction fit", "UV-resistant PETG", "Free shipping"],
  },
  {
    id: 3,
    name: "Garmin Echomap 93SV",
    price: 24.99,
    category: "Fish Finder Covers",
    colors: ["Black", "Blue", "Green", "White"],
    shortDesc: "Sun shade for Echomap",
    description: "Purpose-built sun shade for the Echomap 93SV.",
    specs: ["Fits Garmin Echomap 93SV", "Tool-free friction fit", "UV-resistant PETG", "Free shipping"],
  },
];

function ShadeSVG({ c }) {
  return (
    <svg viewBox="0 0 220 160" width="75%" style={{ maxWidth: "160px" }}>
      <rect x="30" y="30" width="160" height="110" rx="10" fill={c.shade} />
      <rect x="42" y="42" width="136" height="82" rx="6" fill="#0a1a28" />
      <rect x="24" y="16" width="172" height="22" rx="6" fill={c.hex} />
      <rect x="24" y="16" width="16" height="60" rx="4" fill={c.hex} />
      <rect x="180" y="16" width="16" height="60" rx="4" fill={c.hex} />
      <rect x="48" y="48" width="124" height="70" rx="4" fill="#1AAFA020" />
      <line x1="55" y1="68" x2="160" y2="68" stroke="#1AAFA060" strokeWidth="1.5" />
      <line x1="55" y1="82" x2="140" y2="82" stroke="#1AAFA040" strokeWidth="1" />
      <line x1="55" y1="96" x2="150" y2="96" stroke="#1AAFA040" strokeWidth="1" />
      <path d="M 80 90 Q 95 72 110 90" fill="none" stroke="#C9933A" strokeWidth="2.5" />
      <rect x="95" y="140" width="30" height="10" rx="4" fill={c.shade} />
      <rect x="80" y="148" width="60" height="6" rx="3" fill={c.hex} />
    </svg>
  );
}

function ProductVisual({ colorName, large }) {
  const c = COLORS.find((x) => x.name === colorName) || COLORS[0];
  const h = large ? 340 : 200;
  return (
    <div
      style={{
        width: "100%",
        height: h,
        background: `linear-gradient(140deg, ${c.hex}EE 0%, ${c.shade}CC 100%)`,
        borderRadius: large ? 20 : 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 8px 32px ${c.hex}60`,
      }}
    >
      <ShadeSVG c={c} />
      {large && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            background: `${c.hex}CC`,
            border: `1px solid ${c.shade}`,
            borderRadius: 6,
            padding: "3px 10px",
            color: c.text,
            fontFamily: "Barlow, sans-serif",
            fontWeight: 700,
            fontSize: "11px",
          }}
        >
          {colorName}
        </div>
      )}
    </div>
  );
}

function Header({ page, navigate, cartCount }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: `${P.navy}F2`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${P.navyMid}`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        <button
          onClick={() => navigate("home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "28px" }}>🎣</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: P.gold }}>
              REELFISHIGAN
            </div>
            <div style={{ fontFamily: "Barlow, sans-serif", fontSize: "9px", color: P.teal }}>
              3D PRINTED GEAR
            </div>
          </div>
        </button>
        <nav style={{ display: "flex", gap: "12px", alignItems: "center", marginLeft: "80px" }}>
          {["home", "products", "community"].map((key) => (
            <button
              key={key}
              onClick={() => navigate(key)}
              style={{
                background: page === key ? `${P.gold}22` : "none",
                border: "none",
                color: page === key ? P.gold : "rgba(255,255,255,0.75)",
                fontFamily: "Barlow, sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
          <button
            onClick={() => navigate("cart")}
            style={{
              background: P.gold,
              border: "none",
              color: P.navy,
              fontFamily: "Barlow, sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {cartCount > 0 ? `🛒 (${cartCount})` : "🛒 Cart"}
          </button>
        </nav>
      </div>
    </header>
  );
}

function ProductCard({ product, navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("detail", product)}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.16)" : "0 4px 16px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.3s ease",
        border: "1px solid #e8e4dc",
      }}
    >
      <div style={{ padding: "16px" }}>
        <ProductVisual colorName={product.colors[0]} large={false} />
      </div>
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontSize: "11px", color: P.teal, letterSpacing: 1, textTransform: "uppercase" }}>
          {product.category}
        </div>
        <h3 style={{ fontSize: "20px", color: P.txt, margin: "0 0 8px 0", fontFamily: "'Bebas Neue', sans-serif" }}>
          {product.name}
        </h3>
        <p style={{ fontSize: "13px", color: P.muted, margin: "0 0 12px 0" }}>{product.shortDesc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "24px", color: P.navy, fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700 }}>
            ${product.price.toFixed(2)}
          </span>
          <span style={{ background: `${P.gold}18`, border: `1px solid ${P.gold}44`, color: P.gold, padding: "4px 10px", borderRadius: 4, fontSize: "11px", fontWeight: 600 }}>
            {product.colors.length} Colors
          </span>
        </div>
      </div>
    </div>
  );
}

function HomePage({ navigate }) {
  return (
    <div>
      <section
        style={{
          background: `linear-gradient(160deg, ${P.navy} 0%, ${P.navyMid} 60%, #0A3040 100%)`,
          minHeight: "90vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          padding: "60px 24px 80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(26,175,160,0.1) 0%, transparent 50%)" }} />
        <div style={{ maxWidth: "700px", position: "relative", zIndex: 2 }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "72px", color: P.gold, margin: "0 0 8px 0" }}>
            REEL
          </h1>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "72px", color: P.white, margin: "0 0 24px 0" }}>
            FISHIGAN
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: "24px 0 32px 0" }}>
            Premium 3D printed fish finder sun shades for Michigan waters. Free shipping, custom colors, built to last.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("products")}
              style={{
                background: `linear-gradient(135deg, ${P.gold}, ${P.goldLt})`,
                border: "none",
                color: P.navy,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                padding: "14px 28px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Shop Now →
            </button>
            <button
              onClick={() => navigate("community")}
              style={{
                background: "transparent",
                border: `2px solid ${P.white}`,
                color: P.white,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                padding: "12px 26px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Community Catches
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
          <div style={{ display: "inline-block", background: `${P.teal}22`, border: `1px solid ${P.teal}44`, borderRadius: 6, padding: "6px 12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: P.teal }}>🎯 ENGINEERED FOR FISHING</span>
          </div>
          {[["🖨️", "3D Printed"], ["💧", "Lake Tested"]].map(([icon, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: `${P.navyMid}CC`,
                border: `1px solid ${P.navyMid}`,
                borderRadius: 12,
                padding: "14px 18px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "28px" }}>{icon}</span>
              <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: "14px" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: P.cream, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.txt, marginBottom: "48px" }}>
            Featured Products
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: P.navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.white, marginBottom: "48px" }}>
            Why Choose Us
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              ["🎯", "Designed by Anglers", "Built around real problems from Michigan lakes."],
              ["☀️", "UV-Resistant PETG", "Handles August sun through icy mornings."],
              ["🎨", "8 Color Options", "Match your boat. Stand out on the water."],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                style={{
                  background: `${P.navyMid}CC`,
                  border: `1px solid ${P.navyMid}`,
                  borderRadius: 16,
                  padding: "32px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "14px" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: P.white, margin: "0 0 8px 0" }}>
                  {title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: "#040E18", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: P.gold }}>
          REELFISHIGAN
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
          Premium 3D Printed Fishing Gear
        </div>
      </footer>
    </div>
  );
}

function ProductsPage({ navigate }) {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
  return (
    <div style={{ background: P.cream, minHeight: "100vh" }}>
      <div style={{ background: P.navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.white, margin: 0 }}>
            All Products
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: "8px 0 0 0" }}>
            {PRODUCTS.length} items available
          </p>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
          {["All", "Fish Finder Covers"].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              style={{
                background: active === c ? P.navy : "#fff",
                border: active === c ? "none" : "1px solid #ddd",
                color: active === c ? "#fff" : P.txt,
                padding: "8px 18px",
                borderRadius: 20,
                cursor: "pointer",
                fontFamily: "Barlow, sans-serif",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductDetailPage({ product, navigate, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedColor(product.colors[0]);
  }, [product.id]);

  return (
    <div style={{ background: P.cream, minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          <div>
            <ProductVisual colorName={selectedColor} large={true} />
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "center" }}>
              {product.colors.map((cn) => {
                const co = COLORS.find((x) => x.name === cn);
                return (
                  <div
                    key={cn}
                    onClick={() => setSelectedColor(cn)}
                    title={cn}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: co?.hex,
                      cursor: "pointer",
                      border: selectedColor === cn ? `3px solid ${P.gold}` : "3px solid transparent",
                      transition: "all 0.2s",
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px", color: P.txt, margin: "0 0 20px 0" }}>
              {product.name}
            </h1>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px", color: P.gold, fontWeight: 700 }}>
                ${product.price.toFixed(2)}
              </span>
            </div>
            <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, marginBottom: "32px" }}>
              {product.description}
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", marginBottom: "10px" }}>
                Color:{" "}
                <span style={{ color: COLORS.find((c) => c.name === selectedColor)?.hex }}>
                  {selectedColor}
                </span>
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.colors.map((cn) => {
                  const co = COLORS.find((x) => x.name === cn);
                  const sel = selectedColor === cn;
                  return (
                    <button
                      key={cn}
                      onClick={() => setSelectedColor(cn)}
                      style={{
                        background: sel ? co?.hex : "#fff",
                        border: sel ? `2px solid ${P.gold}` : "2px solid #ddd",
                        color: sel ? co?.text || "#fff" : P.txt,
                        padding: "8px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {cn}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", marginBottom: "10px" }}>
                Quantity
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0px", width: "fit-content" }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ background: "transparent", border: "none", padding: "6px 10px", cursor: "pointer", fontSize: "16px" }}
                >
                  −
                </button>
                <span
                  style={{
                    width: "40px",
                    textAlign: "center",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "16px",
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{ background: "transparent", border: "none", padding: "6px 10px", cursor: "pointer", fontSize: "16px" }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product.id, selectedColor, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              style={{
                width: "100%",
                background: added ? P.teal : `linear-gradient(135deg, ${P.gold}, ${P.goldLt})`,
                border: "none",
                color: added ? "#fff" : P.navy,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                padding: "16px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              {added ? "✓ Added to Cart!" : `Add to Cart — $${(product.price * qty).toFixed(2)}`}
            </button>

            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, padding: "20px" }}>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", color: P.txt, margin: "0 0 12px 0" }}>
                Specs
              </h4>
              {product.specs.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: i < product.specs.length - 1 ? "10px" : 0,
                  }}
                >
                  <span style={{ color: P.teal, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "13px", color: "#555" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, navigate, onUpdateQty, onRemove }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div style={{ background: P.cream, minHeight: "100vh" }}>
      <div style={{ background: P.navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.white, margin: 0 }}>
            Shopping Cart
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px", color: P.txt, margin: "0 0 16px 0" }}>
              Your cart is empty
            </h2>
            <p style={{ color: P.muted, marginBottom: "32px" }}>
              Add some premium fish finder shades to get started.
            </p>
            <button
              onClick={() => navigate("products")}
              style={{
                background: `linear-gradient(135deg, ${P.gold}, ${P.goldLt})`,
                border: "none",
                color: P.navy,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                padding: "14px 28px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px" }}>
            <div>
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                return (
                  <div
                    key={`${item.id}-${item.color}`}
                    style={{
                      background: "#fff",
                      border: "1px solid #e8e4dc",
                      borderRadius: 12,
                      padding: "20px",
                      display: "grid",
                      gridTemplateColumns: "120px 1fr auto",
                      gap: "20px",
                      alignItems: "start",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ borderRadius: 8, overflow: "hidden" }}>
                      <ProductVisual colorName={item.color} large={false} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", color: P.txt, margin: "0 0 4px 0" }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: "13px", color: P.muted, margin: "0 0 8px 0" }}>
                        Color: <span style={{ color: COLORS.find((c) => c.name === item.color)?.hex }}>{item.color}</span>
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => onUpdateQty(item.id, item.color, Math.max(1, item.qty - 1))}
                          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }}
                        >
                          −
                        </button>
                        <span style={{ width: "30px", textAlign: "center", fontWeight: 600 }}>{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.color, item.qty + 1)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", color: P.navy, fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, marginBottom: "12px" }}>
                        ${(product.price * item.qty).toFixed(2)}
                      </div>
                      <button
                        onClick={() => onRemove(item.id, item.color)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#999",
                          cursor: "pointer",
                          fontSize: "13px",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ height: "fit-content", position: "sticky", top: "100px" }}>
              <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, padding: "24px" }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: P.txt, margin: "0 0 16px 0" }}>
                  Order Summary
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px", paddingBottom: "16px", borderBottom: "1px solid #e8e4dc" }}>
                  <span>Shipping</span>
                  <span style={{ color: P.teal, fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "18px", fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: P.gold }}>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate("checkout")}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${P.gold}, ${P.goldLt})`,
                    border: "none",
                    color: P.navy,
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "16px",
                    padding: "14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("products")}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: `2px solid ${P.navy}`,
                    color: P.navy,
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "14px",
                    padding: "12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    marginTop: "12px",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutPage({ cart, navigate, onCheckout }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !name || !address || !city || !state || !zip) {
      setError("Please fill in all address fields");
      return;
    }

    if (!cardNumber || !cardExpiry || !cardCvc) {
      setError("Please fill in all card fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer: { email, name, address, city, state, zip },
          card: { cardNumber, cardExpiry, cardCvc },
          amount: Math.round(total * 100),
        }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const data = await response.json();

      if (data.success) {
        onCheckout();
        navigate("confirmation", { orderId: data.orderId });
      } else {
        setError(data.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: P.cream, minHeight: "100vh" }}>
      <div style={{ background: P.navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.white, margin: 0 }}>
            Checkout
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "40px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", color: P.txt, margin: "0 0 24px 0" }}>
                Shipping Address
              </h2>

              {error && (
                <div style={{ background: "#fee", border: "1px solid #fcc", color: "#c33", padding: "12px 16px", borderRadius: 6, marginBottom: "20px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontFamily: "Barlow, sans-serif",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder="John Doe"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontFamily: "Barlow, sans-serif",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder="john@example.com"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontFamily: "Barlow, sans-serif",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder="123 Main St"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontFamily: "Barlow, sans-serif",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Ann Arbor"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontFamily: "Barlow, sans-serif",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                    placeholder="MI"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontFamily: "Barlow, sans-serif",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                    placeholder="48103"
                  />
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", color: P.txt, margin: "0 0 24px 0" }}>
                Payment Method
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                  maxLength="16"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontFamily: "Barlow, sans-serif",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    placeholder="12/25"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength="5"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontFamily: "Barlow, sans-serif",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: P.txt }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    maxLength="4"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontFamily: "Barlow, sans-serif",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <p style={{ fontSize: "12px", color: P.muted, margin: 0 }}>
                🔒 Test card: 4242 4242 4242 4242 · Any future date · Any 3 digits
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#ccc" : `linear-gradient(135deg, ${P.gold}, ${P.goldLt})`,
                border: "none",
                color: P.navy,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                padding: "16px",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>
          </form>

          <div style={{ height: "fit-content", position: "sticky", top: "100px" }}>
            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, padding: "24px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", color: P.txt, margin: "0 0 16px 0" }}>
                Order Review
              </h3>
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                return (
                  <div
                    key={`${item.id}-${item.color}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "13px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: P.txt }}>{product.name}</div>
                      <div style={{ color: P.muted, fontSize: "12px" }}>
                        {item.color} × {item.qty}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: P.navy }}>
                      ${(product.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: `2px solid ${P.gold}`,
                  fontSize: "16px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span style={{ color: P.gold }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationPage({ navigate }) {
  return (
    <div style={{ background: P.cream, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>✓</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.teal, margin: "0 0 16px 0" }}>
          Order Confirmed!
        </h1>
        <p style={{ color: P.muted, fontSize: "16px", marginBottom: "32px" }}>
          Thank you for your purchase. Check your email for order details and tracking info.
        </p>
        <button
          onClick={() => navigate("home")}
          style={{
            background: `linear-gradient(135deg, ${P.gold}, ${P.goldLt})`,
            border: "none",
            color: P.navy,
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "16px",
            padding: "14px 28px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

function CommunityPage() {
  const [posts] = useState([
    { id: 1, author: "Mike D.", likes: 14, caption: "First walleye of the season!" },
    { id: 2, author: "Sarah K.", likes: 9, caption: "Shade fits like a glove." },
    { id: 3, author: "Tom R.", likes: 22, caption: "The Striker 4 Plus shade is legit." },
  ]);
  const [likedIds, setLikedIds] = useState([]);

  return (
    <div style={{ background: P.cream, minHeight: "100vh" }}>
      <div style={{ background: P.navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", color: P.white, margin: 0 }}>
            Community Catches
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: "8px 0 0 0" }}>
            Real anglers. Real results.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  height: "200px",
                  background: `linear-gradient(135deg, ${P.navyMid}, ${P.navy})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                🎣
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ fontWeight: 700, color: P.txt, marginBottom: "8px" }}>
                  {post.author}
                </div>
                <p style={{ fontSize: "13px", color: "#555", margin: "0 0 10px 0" }}>
                  {post.caption}
                </p>
                <button
                  onClick={() =>
                    setLikedIds((l) =>
                      l.includes(post.id) ? l.filter((x) => x !== post.id) : [...l, post.id]
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "12px",
                  }}
                >
                  {likedIds.includes(post.id) ? " ❤️" : " 🤍"} {post.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const navigate = (p, product = null) => {
    setPage(p);
    if (product) setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const addToCart = (productId, color, qty) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId && item.color === color);
      if (existing) {
        return prev.map((item) =>
          item.id === productId && item.color === color
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      const product = PRODUCTS.find((p) => p.id === productId);
      return [...prev, { id: productId, color, qty, price: product.price }];
    });
  };

  const updateQty = (productId, color, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.color === color ? { ...item, qty } : item
      )
    );
  };

  const removeFromCart = (productId, color) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.color === color))
    );
  };

  const checkout = () => {
    setCart([]);
  };

  return (
    <div style={{ fontFamily: "Barlow, sans-serif", background: P.cream, minHeight: "100vh" }}>
      <FontLoader />
      <Header page={page} navigate={navigate} cartCount={cart.length} />

      {page === "home" && <HomePage navigate={navigate} />}
      {page === "products" && <ProductsPage navigate={navigate} />}
      {page === "detail" && selectedProduct && (
        <ProductDetailPage product={selectedProduct} navigate={navigate} onAddToCart={addToCart} />
      )}
      {page === "cart" && <CartPage cart={cart} navigate={navigate} onUpdateQty={updateQty} onRemove={removeFromCart} />}
      {page === "checkout" && <CheckoutPage cart={cart} navigate={navigate} onCheckout={checkout} />}
      {page === "confirmation" && <ConfirmationPage navigate={navigate} />}
      {page === "community" && <CommunityPage />}
    </div>
  );
}
