# PalmVerse Design System

> *"Your destiny in the stars."* — A cosmic, mystical brand identity for an AI-powered palm + astrology reading platform.

---

## What is PalmVerse?

PalmVerse is an **AI-powered palm reading and astrology** web application. Users upload photos of their palms, share their birth details, and receive a personalized "Palm-Astro" reading that correlates palmistry with their astrological chart. The platform also has a spiritual e-commerce side selling crystal bracelets, gemstones, rudrakshas, yantras, and pooja essentials.

The product surfaces are:

| Surface | Audience | What it does |
|---|---|---|
| **Consumer Web App** | End users seeking palm/astrology readings | Hero landing → mobile-OTP / Google login → palm photo upload + birth details → simulated payment → AI-generated report viewable under "My Reading" |
| **Editor Console** | Expert reviewers | Dashboard, pending reviews queue, approve/reject reports, AI-suggestion-assisted refinement |
| **Admin Console** | Operators | E-commerce management (products, categories, orders, customers, subscribers, site settings) — most sections are placeholder/scaffold |

There are five reading categories: General Personality, Career & Finance, Health & Wellness, Marriage & Relationships, and a Comprehensive Analysis.

## Sources

This system was distilled from the company's own codebase:

- **Codebase:** `github.com/rajuperumalla/PlamVerse` (note: repo name is misspelled as "Plam"). Next.js 15 + Tailwind + Radix/shadcn UI + Firebase + Genkit (Google AI). The reader does not need access — assume copied excerpts below are canonical.
- **Process docs (in repo root):** `PROCESS_FLOW.md`, `NUMEROLOGY_PROCESS_FLOW.md`, `REVIEW_PROCESS_FLOW.md`
- **Design tokens:** `tailwind.config.ts` and `src/app/globals.css`
- **Component library:** shadcn/ui under `src/components/ui/*` (Radix primitives + cva), feature components under `src/components/{auth, palm-reading, numerology, shared}`

No Figma file or external brand book was provided.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file. Brand context + content + visual foundations + iconography |
| `SKILL.md` | Agent skill manifest (cross-compatible with Claude Code) |
| `colors_and_type.css` | All tokens — colors, typography, radii, shadows, semantic styles |
| `fonts/` | Self-hosted Playfair Display + PT Sans (Google Fonts originals) |
| `assets/` | Logos, brand SVGs, full-bleed nebula backgrounds, product placeholders |
| `preview/` | Small HTML cards that populate the Design System tab |
| `ui_kits/consumer/` | Click-thru recreation of the consumer web app (home → auth → palm input → payment → report → shop) |

---

## CONTENT FUNDAMENTALS

**Tone.** Mystical-warm with a modern twist. PalmVerse speaks like a knowing cosmic guide who's also an excellent UX writer — never airy-fairy, never clinical. There's awe ("Cosmic Artifacts", "neon-lit constellations") balanced with practical, scannable instructions ("Upload Front Palm Image", "Max 5MB, JPG/PNG").

**Voice.** Second-person, addressing "you" directly. "Your destiny in the stars." "Discover your life's cosmic path." Never "we" except in process disclosures ("Your information is used solely for…"). The brand is the oracle, the reader is the seeker.

**Casing.** **Title Case** for headings, buttons, and nav. ("My Reading", "Get Your Palm-Astro Reading", "Cosmic Palm Lines"). Sentence case for body copy and helper text. Buttons are short verb-led phrases — "Send OTP", "Verify OTP & Continue", "Generate Palm Reading", "Proceed to Payment".

**Vocabulary — the cosmic lexicon.**
- *Cosmic, celestial, nebula, constellation, galaxy, stars, aura, vibration, energy, divine* — these recur often
- *Palm-Astro* (compound) is the proprietary term for the integrated reading
- *Artifact* (vs. "product"): "Cosmic Artifacts" instead of "Spiritual Products"
- *Energized* / *Sacred* / *Authentic* qualify product names ("Sacred Gemstones", "Energized Yantras")

**Examples — verbatim from the codebase.**

> Hero: **"Your Destiny in the Stars"** / *"Discover your life's cosmic path through an immersive AI correlation of palmistry and astrology. Connect your palm with the constellations."*

> Section: **"Cosmic Palm Lines"** / *"Discover the galaxy hidden within the lines of your hand."*

> Section: **"Cosmic Artifacts"** / *"Enhance your aura with our curated energetic tools."*

> Helper: *"Your Date, Time, and Place of Birth are crucial for accurate astrological correlation."*

> Footer: *"Your journey to self-discovery starts here."*

> Toast: *"Request Received. Your report is being prepared and will be available under 'My Reading'."*

**Emoji.** ❌ Not used. Lucide icons fill that role.

**Punctuation.** Em-dashes for asides; colons before lists; sentence-ending periods on body copy, never on button labels or short hero kickers.

**Don'ts.**
- Don't use horoscope-app cliché ("Hey ♍ Virgo!"), no astrology shorthand symbols
- Don't use generic e-commerce voice ("Shop Now! Big Sale!")
- Don't promise certainty — every reading is *guidance*, not prophecy. The "A Note for Younger Users" disclaimer about lines maturing is a tonal benchmark.

---

## VISUAL FOUNDATIONS

PalmVerse is unapologetically **dark, cosmic, and luminous**. Think planetarium ceiling × spiritual app × neumorphic dashboard. Every screen feels like it's floating in deep space.

### Color

A **violet-to-cyan neon palette on near-black**, with magenta + orange nebula accents bleeding through the background.

- **Background:** `hsl(260 50% 5%)` — deep purple-black (`#050814` body fallback). Layered with four full-bleed radial gradients (deep magenta → glowing orange → bright cyan → deep purple) creating a nebula effect that's `background-attachment: fixed`. This is the brand's signature.
- **Primary (Neon Purple):** `hsl(280 80% 60%)` — used for primary actions, accents, sidebar highlights
- **Secondary (Neon Cyan):** `hsl(190 90% 50%)` — used for hover states, links, active nav items, glow shadows
- **Foreground:** `hsl(260 20% 90%)` — soft purple-gray, never pure white for body
- **Muted text:** `hsl(260 20% 70%)` — secondary copy, helper text
- **Borders:** `hsl(260 30% 20%)` — barely visible, plus white-at-low-opacity for glassmorphism
- **Charts:** five-color set spanning purple → cyan → pink → blue → light purple

There is no light theme. `.dark` exists in the CSS but is essentially the same dark palette, slightly punchier.

### Typography

Two-family system, both loaded via Google Fonts:

- **Headline — Playfair Display** (serif, 400/700). Used for `h1`–`h3`, hero text, card titles, brand wordmark. Always paired with the gradient-clip + `neon-text` text-shadow on hero/section titles.
- **Body — PT Sans** (sans, 400/700). Used for everything else — body, labels, helpers, button text.
- **Mono:** falls back to system `monospace` (rare; mostly chart axes and code).

The contrast — high-style serif over a clean humanist sans — gives PalmVerse its "ancient knowledge meets modern app" feel.

### The Neumorphic Cosmic Card

The signature surface treatment. From `globals.css`:

```css
.neumorphic {
  background: linear-gradient(145deg, #0a1128, #080f22);
  box-shadow: 10px 10px 20px #040711, -10px -10px 20px #0e1939;
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 1.5rem;
}
.neumorphic-pressed { /* inset version, for inputs/insets */ }
.neumorphic-glow { /* +cyan outer glow on hover/active */ }
```

Three states: raised (default card), pressed (inputs, image wells), glow (hover/active). Corners are big — **24px radius (`1.5rem`)** on cards, **12px (`0.75rem` = `--radius`)** on buttons/inputs.

### Glassmorphism

Used on header and floating chrome:

```css
.glassmorphism {
  bg-white/5 backdrop-blur-xl border border-white/10
  shadow-[0_0_15px_rgba(150,50,250,0.2)];
}
```

Header is `bg-black/40 backdrop-blur-md border-b border-white/10`.

### Backgrounds

- **Body** is the fixed nebula gradient described above
- **`<ParticlesBackground/>`** layered on key pages — 80 white/purple/cyan particles connected with thin purple lines, repulsing on hover (uses `@tsparticles/slim`)
- **`<SunAndPlanets/>`** — animated orbital decoration on the home hero
- **Subtle mandala pattern** at 3% opacity behind the palm input form (`absolute inset-0 z-0 opacity-[0.03]`)

### Animation

GSAP + Framer Motion + tailwindcss-animate, used purposefully:

- **`fade-in`** (0.5s ease-out) — page loads, cards mounting
- **`slide-in-up`** (0.5s ease-out) and **`slide-in-down`** (0.3s) — section entrances
- **`pulse-subtle`** (2.5s cubic-bezier, infinite) — call-to-attention on the Sparkles icon in the primary CTA
- **`shimmer`** (3s ease-in-out, infinite) — animated gradient backgroundPosition on hero text
- **Hover on cards:** `whileHover={{ y: -10 }}` (lift) or `{ scale: 1.02, y: -5 }`
- **Card transition:** `transition-all duration-300` from `neumorphic-pressed` → `neumorphic-glow`

Everything is smooth and reverent — no bouncy springs, no comedic timing. Easing is `ease-out` or `cubic-bezier(0.4, 0, 0.6, 1)`.

### Hover & press states

- **Buttons (primary):** `hover:bg-primary/90` (slight darken). Gradient buttons swap their gradient stops (`from-purple-600` → `from-purple-500`).
- **Outline / ghost buttons:** fill with the accent at 10–20% opacity (`hover:bg-primary/10`)
- **Cards:** lift `y: -5` to `-10`, swap from `neumorphic-pressed` to `neumorphic-glow` (cyan glow appears)
- **Nav links:** text color → `text-cyan-400`, plus a soft cyan `drop-shadow` when active
- **Press:** opacity dim isn't used; the neumorphic-pressed inset shadow IS the pressed look

### Borders, shadows, transparency

- **Borders** are extremely subtle — `rgba(255,255,255,0.03)` on cards, `border-white/10` on glass surfaces. Real visual separation comes from neumorphic shadows, not borders.
- **Shadow system** is dual-layer neumorphic (dark bottom-right + light top-left), plus optional **cyan glow ring** (`0 0 25px rgba(0, 168, 255, 0.3)`) for active/important elements. There's also a CTA-specific drop-shadow: `shadow-[0_0_20px_rgba(6,182,212,0.6)]`.
- **Transparency** is everywhere — header uses `bg-black/40`, CTAs sit on `bg-cyan-500/20`, even the auth card is `bg-card/95`. Combined with `backdrop-blur-xl/md` this gives a layered, atmospheric feel.

### Imagery vibe

Cool & cosmic — purple/cyan-tinted, often combined with `mix-blend-screen` or `mix-blend-lighten` so images merge into the dark background. The home hero hand image is described as *"glowing wireframe hand with galaxy background"*. Product photography is described as energetic, jewel-toned ("crystal bracelet", "gemstone collection", "sacred yantra"). There's no warm or sepia imagery anywhere.

### Layout rules

- **Container:** Tailwind's `container mx-auto px-4 py-8`
- **Sticky header** at `top-0 z-40`, glassmorphic
- **Fixed bottom mobile nav** (`md:pb-0` body padding implies `pb-20` mobile to clear it)
- Generous vertical rhythm — `space-y-12` between hero sections, `space-y-8` inside forms, `space-y-3` for tight stacks
- Forms cap at `max-w-2xl`; auth card at `max-w-md`; hero content at `max-w-5xl`

### Capsules vs gradients

Both, deliberately:
- **Capsules** (full pill `rounded-full`) for hero CTAs and secondary "Cosmic Artifact" buttons
- **Gradient fills** (`from-purple-600 to-cyan-600`) on every primary CTA, plus reversed (`from-cyan-500 to-purple-600`) for the hero button
- **Gradient text-clip** (`text-transparent bg-clip-text`) on every section title, animated with `shimmer` on the hero h1

### Spacing & radii

- **Radius scale:** `--radius: 0.75rem` (12px) base; `lg = 12px`, `md = 10px`, `sm = 8px`. Cards override to **24px** (`1.5rem`) via `.neumorphic`.
- **Padding scale (Tailwind defaults):** `p-2` (8px) → `p-4` (16px) → `p-5` (20px) → `p-6` (24px) → `p-8` (32px)
- **Gap scale:** `gap-2 / 4 / 6 / 8` are most common; `gap-10`/`gap-16` for hero sections

---

## ICONOGRAPHY

PalmVerse uses **[Lucide](https://lucide.dev/)** (`lucide-react@^0.475.0`) exclusively for UI iconography. Every icon in the codebase is Lucide.

**Style:** Lucide's default — outline, 1.5px stroke (rounded), 16–24px typical size, currentColor fill. This matches the cosmic-but-clean voice perfectly — outline icons feel light and constellation-like against the dark background.

**Sizing in code:**
- `[&_svg]:size-4` (16px) inside buttons by default
- `h-5 w-5` for inline label icons
- `h-6 w-6` to `h-10 w-10` for hero/feature icons
- `h-7 w-7 sm:h-8 sm:w-8` for the brand mark

**Common icons used (verbatim from the codebase):**
- Brand / hero: `Handshake` (logo), `Hand`, `Sparkles`, `Star`, `Heart`, `Brain`, `LifeBuoy`
- Auth: `Smartphone`, `Mail`, `UserPlus`, `LogIn`, `Edit`, `ShieldCheck`
- Nav: `HomeIcon`, `BookOpen`, `ShoppingBag`, `ShoppingCart`, `Zap`, `ChevronDown`, `LayoutDashboard`, `ListChecks`, `FileCheck2`
- Forms: `UploadCloud`, `CalendarDays`, `MapPin`, `Clock`, `Globe`, `Camera`, `Sun`, `Focus`, `Maximize`, `MoveHorizontal`, `Info`, `CheckSquare`, `CreditCard`, `Loader2`

**How icons are used in this design system:** Reference Lucide via the **CDN (`https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/<name>.svg`)** for static HTML cards, or `<i data-lucide="hand"></i>` + the lucide script for live pages. See `assets/icons/` for a small set we copied locally.

**Icon color rules:**
- Default: `text-gray-300` / muted-foreground
- Active/feature: `text-cyan-400` (most common accent for icons)
- Brand-primary actions: `text-purple-400` or gradient
- Themed (palm lines): `text-red-400` (Life), `text-blue-400` (Head), `text-pink-400` (Heart), `text-purple-400` (Fate)
- Helper-icon hue per row: amber-500, blue-500, green-500, purple-500 — used for Photo Guide tip rows

**Not used:** Emoji, unicode glyphs, custom SVGs, brand-specific icon sets.

**Logo / brand mark.** No raster logo file exists in the repo. The brand mark is composed in code as `<Handshake/>` Lucide icon + the word **"PalmVerse"** in Playfair Display bold, sometimes with the gradient-clip neon-text treatment. We've recreated this in `assets/logo/palmverse-logo.svg` — feel free to substitute when a real logo is supplied.

---

## Caveats

1. **Logo.** No actual logo asset exists; we composed one from the Lucide `Handshake` glyph + Playfair wordmark, matching how the live header renders. Please replace if/when a real mark is supplied.
2. **Fonts.** Self-hosted Playfair Display + PT Sans are pulled from Google Fonts CDN. If a custom-licensed font is required, swap the files in `fonts/`.
3. **Imagery.** Product/hero photography in the live app is sourced from `picsum.photos`. We've created visual placeholders matching the described vibe (cosmic-tinted, neon, blend-screen). Replace with real photography when available.
4. **Numerology** module exists in the codebase (`BabyNameNumerologyForm`, `BusinessNumerologyForm`, `PersonalLifePathReportForm`) — we did not separately recreate it; the patterns are identical to the palm-input form.
