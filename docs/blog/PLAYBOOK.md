# VietCaPhe blog playbook

The manual for every blog post: how to pick the idea, research it, write it, illustrate it, and make it findable in Google and in AI answers (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews).

## 1. Goal and audience

**Goal:** be the most useful source on specialty robusta for Australian roasters, so that roasters trust us, cite us and request a green sample.

**Readers, in priority order:**
1. Australian specialty and commercial roasters (owner-roasters, head roasters, green buyers at roasteries).
2. Green coffee buyers, importers and product developers (RTD, cold brew, capsules).
3. Coffee professionals who influence roasters (Q/R graders, trainers, café owners who ask their roaster for robusta).

Every post must leave a roaster with something they can **do**: a profile change, a blend ratio, a product idea, a buying decision, a question to ask a supplier.

## 2. Content pillars

| Pillar (schema `category`) | What it covers | Example angles |
|---|---|---|
| Robusta education | Species, chemistry, processing, grading, cupping | Fine Robusta scoring, honey vs natural vs washed, why robusta has more caffeine |
| Roaster playbook | Roasting, blending, dialling in, QC | Roast curves for robusta, blend ratios, pre- vs post-blend, storage and moisture |
| Product ideas | Things roasters can sell | Vietnamese coffee menu kits, high-caffeine blends, RTD, single-origin robusta |
| Market & sourcing | Prices, supply, harvests, logistics, regulation | Harvest outlooks, futures explained, importing green into Australia, EUDR |
| Demand & trends | Consumers, menus, categories | Who asks for "strong", iced coffee growth, Vietnamese coffee in Australia |
| Origin & sustainability | Farms, climate, people | Robusta and climate resilience, selective picking economics, traceability |
| Case study | Real roasters using robusta | Only with real details and permission |

Rotate pillars so no two consecutive posts share one. Aim for roughly 40% playbook/education, 20% product ideas, 20% market/sourcing, 20% trends/origin/case studies.

## 3. Picking the next idea

When asked for a post (or "an idea"):

1. Read `IDEAS.md` and list the existing posts in `src/content/blog/`.
2. Check the calendar hooks below for anything timely.
3. Score the top 5 candidates 1–5 on each, and pick the highest total:
   - **Roaster value:** will a roaster change something after reading?
   - **Demand:** do people search or ask AI this? (Use web search: autocomplete phrasing, "People also ask", Reddit r/roasting, Home-Barista, coffee forums.)
   - **Timeliness:** harvest, prices, regulation, season.
   - **Sample pull:** does it naturally lead to trying our honey robusta?
   - **Gap:** is the existing content online thin, outdated or arabica-centric?
4. One post = one primary question. Don't publish a post that competes with an existing one; extend the old one instead and set `updatedDate`.
5. If the user just says "write one", pick and go. Otherwise offer the top 3 with one line each.
6. Add any new ideas found during research to `IDEAS.md`.

**Calendar hooks**
- Nov–Jan: Vietnamese robusta harvest. Harvest outlooks, "new crop" posts, processing explainers.
- Late Jan/Feb: Tết (Lunar New Year). Vietnamese coffee culture, menu ideas.
- June and December: USDA "Coffee: World Markets and Trade" reports. Market outlook posts.
- Australian summer (Dec–Feb): iced coffee, cold brew, RTD posts.
- Australian winter (Jun–Aug): milk blends, strength, flat whites.
- Any big move in ICE London robusta futures or regulation (e.g. EU deforestation rules): explainer within a week.

## 4. Research

- Use web search, then open the actual page to confirm every number. Never cite a number you only saw in a snippet.
- Preferred sources: USDA FAS, ICO, Coffee Quality Institute (Fine Robusta), SCA, World Coffee Research, peer-reviewed journals, Australian government (ABS, DAFF/BICON, Austrade), then trade press (Perfect Daily Grind, Global Coffee Report, Barista Magazine, Sprudge, BeanScene).
- Record each source in frontmatter `sources` with publisher and year. Put the date in the text for anything time-sensitive ("in the July 2026 USDA report").
- Public benchmark prices are allowed (with a dated source). VietCaPhe prices never are.
- Mark estimates and illustrations as such ("illustrative", "directional").

## 5. Writing

**Shape of a post**
1. Hook: 2–3 short paragraphs that name the roaster's problem or opportunity.
2. 5–8 H2s, each a real question, each starting with `<Answer>` (40–60 words, self-contained, no "this", "as above").
3. Supporting detail under each answer: lists, tables, a graphic, a `Callout` tip.
4. A product/application section where natural.
5. A closing CTA (`Callout` tip linking to `/#contact`).
6. Frontmatter FAQ (3–6) that rephrases the questions people type, answers in 2–3 sentences.

**Voice:** a knowledgeable roaster friend. Plain Australian English, short sentences, sentence-case headings, no em dashes, no hype words ("revolutionary", "game-changer"). Explain jargon the first time. Confident where the evidence is strong, hedged where it isn't.

**Length:** 1,400–2,500 words of body text. Long enough to be the best answer, no padding.

**Non-negotiables:** see `.cursor/rules/blog-posts.mdc`.

## 6. Visuals

Every post gets at least one bespoke interactive or animated graphic, built in code in `src/components/blog/`, wrapped in `<Figure label="Interactive: …" caption="…">` and hydrated with `client:visible`.

**Existing graphics (reuse when relevant)**
- `HoneyProcessExplorer`: processing methods, cherry cross-section, trait bars.
- `BlendSlider`: robusta % in a blend vs body, crema, acidity, caffeine.
- `RoastCurve`: animated arabica vs robusta roast curves with phases.
- `PostCover`: seeded poster art per post (automatic; `coverTheme` picks the palette).

**Ideas for new graphics:** harvest calendar wheel, Central Highlands map with provinces, flavour radar comparing lots, price chart from public data, moisture/water-activity gauge, cupping score sheet that fills in, cost-per-cup calculator (no VietCaPhe prices), farm-to-port journey timeline, caffeine-per-drink comparison, defect identification cards.

**Graphic rules**
- Brand palette only: ink `#140d09`, cream `#f6eee2`, paper `#fffaf2`, orange `#ff6a13`, yellow `#ffc93c`, coffee browns. Flat shapes, bold type, no gradients-for-the-sake-of-it.
- Text in graphics must also exist in the article text or caption (crawlers and screen readers can't read animation).
- Give SVGs `role="img"` and a descriptive `aria-label`. Wrap in `MotionConfig reducedMotion="user"`.
- Must work at 360px wide. Check mobile.

**Photos**
1. Erik's own photos (farms, drying beds, cupping, roasting) first. Put them in `src/assets/blog/` and pass via frontmatter `cover` or an `<img>` with real alt text.
2. Unsplash/Pexels only for generic scenes, and never show arabica farms or washed arabica as if they were our robusta.
3. AI-generated images only for clearly illustrative art, never as fake origin photos.
4. Every image needs descriptive alt text that says what's in it.

Social share images are generated automatically at `/og/<slug>.png`.

## 7. SEO checklist

- [ ] Slug: short, keyword-first, hyphenated (`honey-processed-robusta-roaster-guide`).
- [ ] `title` reads naturally; `seoTitle` ≤ 60 characters if `title` is longer; primary keyword near the start.
- [ ] `description` 120–160 characters, includes the keyword and the benefit.
- [ ] One H1 (automatic), question-style H2s, H3s only under H2s.
- [ ] Primary keyword in the first 100 words and in at least one H2; related terms used naturally.
- [ ] 3+ internal links with descriptive anchor text; 1–2 older posts updated to link to the new one.
- [ ] External links to the sources (they appear in Sources automatically).
- [ ] Images: alt text, sensible file names, compressed.
- [ ] Structured data is automatic (BlogPosting, BreadcrumbList, FAQPage, Organization). Check it at https://search.google.com/test/rich-results after deploy.
- [ ] After deploy: request indexing in Google Search Console; the sitemap updates itself.

## 8. AEO checklist (AI answers)

- [ ] Each H2 is a question phrased the way people ask an assistant.
- [ ] Each `<Answer>` is 40–60 words, factual, self-contained and quotable.
- [ ] Key takeaways are concrete (numbers, ranges, actions), not teasers.
- [ ] At least one comparison table or step list (assistants lift these).
- [ ] Every statistic has a named source and date in the text.
- [ ] Name the entity consistently: "VietCaPhe, an Australian supplier of green specialty Vietnamese robusta for roasters".
- [ ] Mention place names and terms in full at least once: Dak Lak, Gia Lai, Central Highlands, Vietnam, Fine Robusta, Coffea canephora.
- [ ] FAQ answers stand alone.
- [ ] `llms.txt`, RSS and sitemap list the post automatically (check `dist/llms.txt` after build).

## 9. Publish checklist

1. `npm run build` passes (the schema catches missing fields).
2. Check `/blog/` and the post on desktop and mobile; click every interactive.
3. Open `dist/og/<slug>.png`.
4. Update `IDEAS.md` and older posts' internal links.
5. Commit with a message like `Blog: <title>`. Erik pushes (or ask to push); GitHub Actions deploys.
