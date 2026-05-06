# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment

- **Local server:** MAMP (Apache + MySQL)
- **URL:** http://localhost/mjfontes/
- **Database:** `inovsite_mjfontes` — user `root`, password `root`
- **PHP config:** `/Applications/MAMP/htdocs/mjfontes/wp-config.php`

There are no build steps, package managers, or test suites — this is a standard WordPress installation with custom theme and plugin files edited directly.

## Custom Code — Where to Work

All custom development lives in two places:

### Child Theme: `wp-content/themes/mjdev-child/`
- **`functions.php`** — enqueue logic, Custom Post Type (`projeto`), taxonomy (`categoria-projeto`), theme activation hook
- **`style.css`** — global overrides on top of the parent theme (mjdev) and Elementor
- **`page-templates/template-portfolio.php`** — the main portfolio page; fully standalone HTML (calls `wp_head()`/`wp_footer()` but no `get_header()`/`get_footer()`)
- **`single-projeto.php`** — single project page template (split layout: title/meta left, hero image right)
- **`assets/js/`** — all custom JavaScript (no bundler; files enqueued via `wp_enqueue_script`)
- **`assets/css/`** — page-specific stylesheets loaded conditionally
- **`assets/fonts/`** — Neue Montreal self-hosted webfonts + `fonts.css`
- **`assets/images/`** — static images for the About section and the easter egg

### Plugin: `wp-content/plugins/mjf-easteregg/mjf-easteregg.php`
Single-file plugin. Injects a full-screen Bubble Bobble arcade game (canvas-based) via `wp_footer`, activated by the Konami Code (↑↑↓↓←→←→BA). Single-player only. Uses `assets/images/monitor.png` from the child theme as the game frame.

## Architecture & Script Loading

### Portfolio page (`template-portfolio.php`)
Loaded via `mjdev_portfolio_scripts()` → `wp_enqueue_scripts`:

| Script/Style | Notes |
|---|---|
| GSAP 3.12.5 + ScrollTrigger | CDN, deferred |
| SplitType 0.3.4 | CDN, deferred |
| `text-animations.js` | Depends on GSAP + SplitType |
| `fonts.css` | Neue Montreal |
| `splash-reveal.js` | In `<head>`, no defer — runs before render |
| `portfolio.js` | Depends on jQuery + GSAP |
| `about-composition.js` | Depends on jQuery + GSAP |
| `portfolio.css` | Depends on fonts.css |
| `about-composition.css` | Depends on portfolio.css |

### Single project page (`single-projeto.php`)
Loaded via `mjdev_single_projeto_scripts()` when `is_singular('projeto')`:

| Script/Style | Notes |
|---|---|
| GSAP 3.12.5 + ScrollTrigger | CDN, deferred |
| SplitType 0.3.4 | CDN, deferred |
| `fonts.css` | Neue Montreal |
| `single-projeto.css` | Depends on fonts.css |
| `single-projeto.js` | Depends on GSAP + SplitType |

`splash-reveal.js` is intentionally in `<head>` without defer — must run before the page renders.

## Page Transitions

Both the portfolio page and the single project page share a `#page-transition` overlay (full-screen black `div`):

- **Portfolio → Project:** `portfolio.js` intercepts `.project-link` clicks, animates overlay `scaleY: 0→1` from bottom, then navigates.
- **Project page load:** `single-projeto.js` animates overlay `scaleY: 1→0` from top, revealing the page.
- **Project → Portfolio:** links point to `$portfolio_url . '#projects'` so the browser scrolls to the projects section on return.

CSS default: `scaleY(0)` in `portfolio.css`, `scaleY(1)` in `single-projeto.css`.

## Single Project Page Layout

`single-projeto.php` is a standalone HTML template (same pattern as `template-portfolio.php`):
- Split hero: title + meta sticky on the left, full-height image on the right
- Image reveals with GSAP `clip-path: inset(100%→0%)`
- Title reveals line-by-line via SplitType
- Back button and "Ver todos" both link to `$portfolio_url . '#projects'`
- Prev/next project navigation via `get_previous_post()` / `get_next_post()`

## Custom Post Type

- **Slug:** `projeto` — registered in `functions.php`
- **Taxonomy:** `categoria-projeto` — hierarchical, linked to `projeto`
- Supports: title, editor, featured image (`thumbnail`)
- After changing slugs or CPT registration, flush via **WP Admin → Definições → Permalinks → Guardar**
- `.htaccess` exists at the project root with `RewriteBase /mjfontes/`

## Splash Screen Layout

O `#splash` tem um layout de 3 linhas inspirado no adcker.com:

```
Maria João
( [slideshow] ) *   Bring humanity
                    to web solutions
Fontes
```

### HTML estrutura (`template-portfolio.php`)
```html
<h1 class="splash-letters">
    <span class="splash-line">Maria João</span>
    <span class="splash-line splash-line-mid">
        <span class="splash-paren">(</span>
        <div class="splash-reel"><!-- 5 imagens .reel-img --></div>
        <span class="splash-paren">)</span>
        <span class="splash-star">*</span>
        <span class="splash-tagline">Bring humanity<br>to web solutions</span>
    </span>
    <span class="splash-line">Fontes</span>
</h1>
```

### Imagens do slideshow
- Pasta: `assets/images/splash/` — ficheiros `1a.jpg` a `6a.jpg` (5a.jpg removida)
- Cycling via `setInterval` em `portfolio.js` — intervalo 1200ms, crossfade 0.35s
- Imagens 220×220px square, JPG

### Animação de scroll (portfolio.js)
- `ScrollTrigger` em `#splash` — shrink do `.splash-letters` para logo no header
- Cor: branco → preto à medida que scroll avança (`1 - progress`)
- Crossfade entre `.splash-letters` (fade out) e `.logo` (fade in) a partir de `progress > 0.85`
- `.logo` no header tem `opacity: 0` por defeito; aparece via GSAP no scroll

### Tipografia & estilo do splash
- Fonte: **Kumbh Sans 800** carregada via Google Fonts no `<head>` do `template-portfolio.php`
- Nome em `text-transform: uppercase`
- Botão de scroll (rato animado) sem texto — `position: absolute; bottom: 40px; right: 40px` alinhado com o menu hamburguer

### Notas importantes
- `splash-reveal.js` procura `.reveal` (classe que não existe no HTML) — o mouse-reveal interativo está inativo; não alterar sem considerar o impacto no scroll animation do `portfolio.js`
- `.splash-letters` tem `transform: translate(-50%, -50%)` no CSS para centrar imediatamente antes do GSAP carregar
- `.splash-btns` está `position: absolute; bottom: 40px; right: 40px` dentro de `#splash`

## Visit Website — Página de Projeto

Cada `projeto` tem um campo personalizado **"Website do Projeto"** gerido pelo admin:

- **Meta box:** registada em `functions.php` → `mjdev_projeto_website_metabox()` — campo URL na sidebar do editor
- **Meta key:** `_projeto_website_url`
- **Exibição:** `single-projeto.php` — botão `a.sp-visit-website` com `target="_blank"` abaixo dos meta items (Ano/Área)
- **Estilo:** `single-projeto.css` — botão com borda preta, hover invertido (fundo preto / texto branco)
- **Nota:** `single-projeto.js` interceta todos os links para a transição de página — links com `target="_blank"` estão excluídos do interceptor para não bloquear a abertura em nova aba

## Key Design Decisions

- Both the portfolio and single project pages are fully standalone HTML — no `get_header()`/`get_footer()`.
- Elementor is active for non-portfolio pages. Do not break Elementor compatibility when editing `style.css`.
- The easter egg plugin reads `monitor.png` from the child theme (`get_stylesheet_directory_uri()`), not the parent theme.
- Easter egg is single-player only (2P mode was removed).
