import { createServerFn, getRequest } from "@tanstack/react-start";
import { APICallError, createOpenAI, jsonSchema, Output, streamText } from "ai";

/**
 * Strict JSON schema for the model's recommendation payload.
 * Contract: single object root, every property required, no additional
 * properties, optionals modeled as nullable.
 */
const recommendationSchema = jsonSchema<{
  summary: string;
  recommendations: Array<{
    area: string;
    severity: "low" | "medium" | "high";
    issue: string;
    recommendation: string;
    designNote: string;
  }>;
  followUps: string[];
}>({
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary", "recommendations", "followUps"],
    properties: {
      summary: { type: "string" },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["area", "severity", "issue", "recommendation", "designNote"],
          properties: {
            area: { type: "string" },
            severity: { type: "string", enum: ["low", "medium", "high"] },
            issue: { type: "string" },
            recommendation: { type: "string" },
            designNote: { type: "string" },
          },
        },
      },
      followUps: { type: "array", items: { type: "string" } },
    },
  },
});

// Condensed description of the site's design system, kept server-side.
const SITE_DESIGN_SUMMARY = `
TopTenth is an editorial "Top 10" review site with a luxury noir-and-antique-gold identity.

Design tokens (Tailwind v4, oklch, semantic):
- Light theme: background ivory oklch(0.975 0.012 85), foreground oklch(0.18 0.01 60), card near-white oklch(0.99 0.008 85), primary/gold oklch(0.62 0.13 75), gold-soft = gold at 15% alpha, borders oklch(0.87 0.02 85), muted oklch(0.93 0.015 85).
- Dark theme (.dark): background oklch(0.13 0.005 60), card oklch(0.17 0.006 60), gold brightened to oklch(0.78 0.13 80), borders white at 9% alpha.
- "ink" token oklch(0.14 0.008 60) (dark: oklch(0.09 0.004 60)) with ivory "ink-foreground" is used for dark hero sections and dark cards on both themes.
- Typography: display headings "DM Serif Display" (font-display), body "Fira Sans" (font-sans). Headings use -0.01em letter-spacing.
- Radius base 0.75rem; pills are fully rounded (rounded-full); cards rounded-2xl / rounded-3xl; images rounded-2xl.

Signature patterns:
- Dark "ink" hero sections: full-bleed photo (object-cover) plus a left-side ink gradient scrim, gold uppercase kicker with wide tracking (0.3-0.4em), oversized serif headline with gold-gradient italic accent (text-gold-gradient shimmer utility), pill CTAs.
- "hero-fade" utility: an eased multi-stop gradient that dissolves the hero's bottom into the page background color (works in both themes; heights are responsive h-40 sm:h-56 md:h-80 style).
- "grain" utility adds a subtle film-grain noise overlay; "gold-line" is a horizontal gold glow rule.
- Reveal-on-scroll animations (opacity + 28px rise, 0.7s custom ease), marquee of category names, framer-motion crossfades in the hero slider.
- Cards: ListCard with photo, ink gradient overlay, gold "10" serif numeral top-right, category chip; VoteControl is a rounded pill with up/down chevrons; Stars are gold; reader quotes in bordered cards.
- Layout: max-w-7xl containers with px-5 gutters, section rhythm mt-24/mt-32, alternating ivory and ink-tinted (bg-card/40) bands.
- Admin: sidebar layout, stat cards, gold line/area chart, top-lists ranking.
`;

const INSTRUCTIONS = `You are the design assistant for the TopTenth website. Readers describe a page or a visual issue; you recommend specific, concrete design improvements grounded in the site's design system below.

Site design system:
${SITE_DESIGN_SUMMARY}

Rules:
- Recommend 2-6 improvements, most useful first. Reference actual tokens, utilities and patterns from the system (e.g. text-gold, hero-fade, ink, font-display, rounded-full, tracking-[0.35em]).
- Be specific and actionable: say what to change and where, not generic advice.
- designNote should give concrete style guidance (token names, sizes, spacing) a developer could apply directly.
- Keep the site's noir + antique gold identity; do not suggest redesigning away from it.
- Reply only with the JSON object matching the required schema.`;

export const getDesignRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: { page: string; issue: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured on this site yet. Please try again later." };
    }

    const { createLovableAiGatewayRunIdFetch, LOVABLE_AI_GATEWAY_URL } = await import("./design-ai.server");
    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const provider = createOpenAI({
      baseURL: LOVABLE_AI_GATEWAY_URL,
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const page = data.page.trim().slice(0, 200) || "the home page";
    const issue = data.issue.trim().slice(0, 2000);

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions: INSTRUCTIONS,
        messages: [
          {
            role: "user",
            content: `Page or area: ${page}\n\nWhat the reader described:\n${issue || "No specific issue described — review the page for design improvements."}`,
          },
        ],
        maxRetries: 0,
        abortSignal: getRequest().signal,
        output: Output.object({ schema: recommendationSchema, name: "design_recommendations" }),
        providerOptions: {
          openai: {
            store: false,
            forceReasoning: true,
            reasoningEffort: "medium",
            reasoningSummary: "auto",
            include: ["reasoning.encrypted_content"],
          },
        },
      });

      const parsed = await result.output;
      return { ok: true as const, ...parsed };
    } catch (error) {
      if (APICallError.isInstance(error)) {
        const status = error.statusCode ?? 0;
        const transient = status === 429 || status >= 500;
        const detail = typeof error.message === "string" ? error.message.slice(0, 300) : "";
        if (transient) {
          return { ok: false as const, error: "The AI assistant is busy right now — please try again in a moment." };
        }
        return { ok: false as const, error: detail || "The AI assistant could not process this request." };
      }
      if (error instanceof Error && error.name === "AbortError") {
        return { ok: false as const, error: "Request cancelled." };
      }
      return { ok: false as const, error: "Something went wrong while getting recommendations. Please try again." };
    }
  });

export type DesignRecommendationResult = Awaited<ReturnType<typeof getDesignRecommendations>>;
