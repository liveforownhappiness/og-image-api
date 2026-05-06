import { ImageResponse } from "@vercel/og"

export const config = { runtime: "edge" }

const FREE_TEMPLATES = ["gradient", "minimal", "bold"]
const PRO_TEMPLATES = ["split", "mesh", "photo", "glass", "retro"]

async function validateLicense(key) {
    if (!key) return false
    try {
        const res = await fetch(
            "https://api.lemonsqueezy.com/v1/licenses/validate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ license_key: key }),
            }
        )
        const data = await res.json()
        return data.valid === true
    } catch {
        return false
    }
}

/* ---------- Templates (React elements via createElement) ---------- */

function el(type, props = {}, ...children) {
    const flat = children
        .flat()
        .filter((c) => c !== null && c !== undefined && c !== false && c !== "")
    return { type, props: { ...props, children: flat }, key: null }
}

function GradientTemplate({ title, subtitle, colors, isPro }) {
    const { bg1, bg2, text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "80px",
                background: `linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)`,
                color: text,
                fontFamily: "sans-serif",
            },
        },
        // Accent dot
        el("div", {
            style: {
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: accent,
                marginBottom: 40,
                display: "flex",
            },
        }),
        // Title
        el(
            "div",
            {
                style: {
                    fontSize: 78,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    marginBottom: 28,
                    display: "flex",
                    flexWrap: "wrap",
                },
            },
            title
        ),
        // Subtitle
        subtitle
            ? el(
                  "div",
                  {
                      style: {
                          fontSize: 32,
                          fontWeight: 400,
                          lineHeight: 1.4,
                          opacity: 0.82,
                          display: "flex",
                          flexWrap: "wrap",
                      },
                  },
                  subtitle
              )
            : null,
        // Watermark (free only)
        !isPro
            ? el(
                  "div",
                  {
                      style: {
                          position: "absolute",
                          bottom: 32,
                          right: 40,
                          fontSize: 18,
                          opacity: 0.5,
                          display: "flex",
                      },
                  },
                  "Made with OG Image Generator"
              )
            : null
    )
}

function MinimalTemplate({ title, subtitle, colors, isPro }) {
    const { bg1, text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "100px",
                background: bg1,
                color: text,
                fontFamily: "sans-serif",
            },
        },
        el("div", {
            style: {
                width: 60,
                height: 4,
                background: accent,
                marginBottom: 36,
                display: "flex",
            },
        }),
        el(
            "div",
            {
                style: {
                    fontSize: 82,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    marginBottom: 24,
                    display: "flex",
                    flexWrap: "wrap",
                },
            },
            title
        ),
        subtitle
            ? el(
                  "div",
                  {
                      style: {
                          fontSize: 30,
                          fontWeight: 400,
                          lineHeight: 1.4,
                          opacity: 0.6,
                          display: "flex",
                          flexWrap: "wrap",
                      },
                  },
                  subtitle
              )
            : null,
        !isPro
            ? el(
                  "div",
                  {
                      style: {
                          position: "absolute",
                          bottom: 32,
                          right: 40,
                          fontSize: 18,
                          opacity: 0.4,
                          display: "flex",
                      },
                  },
                  "Made with OG Image Generator"
              )
            : null
    )
}

function BoldTemplate({ title, subtitle, colors, isPro }) {
    const { bg1, text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "80px",
                background: bg1,
                color: text,
                fontFamily: "sans-serif",
                position: "relative",
            },
        },
        // Big accent circle (decorative)
        el("div", {
            style: {
                position: "absolute",
                top: -120,
                right: -120,
                width: 480,
                height: 480,
                borderRadius: "50%",
                background: accent,
                opacity: 0.9,
                display: "flex",
            },
        }),
        el(
            "div",
            {
                style: {
                    marginTop: "auto",
                    fontSize: 96,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    marginBottom: 32,
                    display: "flex",
                    flexWrap: "wrap",
                },
            },
            title
        ),
        subtitle
            ? el(
                  "div",
                  {
                      style: {
                          fontSize: 34,
                          fontWeight: 500,
                          opacity: 0.85,
                          display: "flex",
                          flexWrap: "wrap",
                      },
                  },
                  subtitle
              )
            : null,
        !isPro
            ? el(
                  "div",
                  {
                      style: {
                          position: "absolute",
                          bottom: 24,
                          right: 40,
                          fontSize: 16,
                          opacity: 0.5,
                          display: "flex",
                      },
                  },
                  "Made with OG Image Generator"
              )
            : null
    )
}

/* Pro templates */

function SplitTemplate({ title, subtitle, colors }) {
    const { bg1, bg2, text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                fontFamily: "sans-serif",
            },
        },
        // Left side
        el(
            "div",
            {
                style: {
                    width: "58%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "70px",
                    background: bg1,
                    color: text,
                },
            },
            el("div", {
                style: {
                    width: 48,
                    height: 4,
                    background: accent,
                    marginBottom: 28,
                    display: "flex",
                },
            }),
            el(
                "div",
                {
                    style: {
                        fontSize: 64,
                        fontWeight: 800,
                        lineHeight: 1.08,
                        letterSpacing: "-0.03em",
                        marginBottom: 18,
                        display: "flex",
                        flexWrap: "wrap",
                    },
                },
                title
            ),
            subtitle
                ? el(
                      "div",
                      {
                          style: {
                              fontSize: 24,
                              opacity: 0.65,
                              lineHeight: 1.45,
                              display: "flex",
                              flexWrap: "wrap",
                          },
                      },
                      subtitle
                  )
                : null
        ),
        // Right side (accent block)
        el("div", {
            style: {
                width: "42%",
                height: "100%",
                background: `linear-gradient(135deg, ${accent} 0%, ${bg2} 100%)`,
                display: "flex",
            },
        })
    )
}

function MeshTemplate({ title, subtitle, colors }) {
    const { text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "80px",
                background: `
          radial-gradient(at 20% 30%, #ec4899 0%, transparent 50%),
          radial-gradient(at 80% 20%, #8b5cf6 0%, transparent 50%),
          radial-gradient(at 60% 80%, #f59e0b 0%, transparent 50%),
          radial-gradient(at 20% 80%, #3b82f6 0%, transparent 50%),
          #0f172a
        `,
                color: text,
                fontFamily: "sans-serif",
            },
        },
        el(
            "div",
            {
                style: {
                    marginTop: "auto",
                    fontSize: 78,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    marginBottom: 24,
                    textShadow: "0 2px 30px rgba(0,0,0,0.4)",
                    display: "flex",
                    flexWrap: "wrap",
                },
            },
            title
        ),
        subtitle
            ? el(
                  "div",
                  {
                      style: {
                          fontSize: 30,
                          opacity: 0.85,
                          lineHeight: 1.4,
                          display: "flex",
                          flexWrap: "wrap",
                      },
                  },
                  subtitle
              )
            : null,
        el("div", {
            style: {
                width: 60,
                height: 4,
                background: accent,
                marginTop: 28,
                display: "flex",
            },
        })
    )
}

function PhotoTemplate({ title, subtitle, colors }) {
    const { bg1, bg2, text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 80,
                fontFamily: "sans-serif",
                background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%), radial-gradient(at 25% 20%, ${bg2} 0%, transparent 55%), radial-gradient(at 80% 30%, ${accent} 0%, transparent 45%), ${bg1}`,
                color: text,
            },
        },
        // Top metadata strip
        el(
            "div",
            {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.85,
                },
            },
            el("div", {
                style: {
                    width: 32,
                    height: 3,
                    background: accent,
                    display: "flex",
                },
            }),
            el("div", { style: { display: "flex" } }, "Featured")
        ),
        // Bottom-left text block
        el(
            "div",
            {
                style: {
                    display: "flex",
                    flexDirection: "column",
                },
            },
            el("div", {
                style: {
                    width: 56,
                    height: 4,
                    background: accent,
                    marginBottom: 24,
                    display: "flex",
                },
            }),
            el(
                "div",
                {
                    style: {
                        fontSize: 78,
                        fontWeight: 900,
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                        marginBottom: 20,
                        textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                        display: "flex",
                        flexWrap: "wrap",
                    },
                },
                title
            ),
            subtitle
                ? el(
                      "div",
                      {
                          style: {
                              fontSize: 28,
                              fontWeight: 500,
                              opacity: 0.92,
                              lineHeight: 1.4,
                              display: "flex",
                              flexWrap: "wrap",
                          },
                      },
                      subtitle
                  )
                : null
        )
    )
}

function GlassTemplate({ title, subtitle, colors }) {
    const { bg1, bg2, text, accent } = colors
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 80,
                fontFamily: "sans-serif",
                position: "relative",
                background: `
          radial-gradient(circle at 20% 30%, ${bg2} 0%, transparent 55%),
          radial-gradient(circle at 80% 70%, ${accent} 0%, transparent 50%),
          linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)
        `,
            },
        },
        // Decorative orb behind card
        el("div", {
            style: {
                position: "absolute",
                top: 60,
                right: 80,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: accent,
                opacity: 0.45,
                display: "flex",
            },
        }),
        el("div", {
            style: {
                position: "absolute",
                bottom: 80,
                left: 100,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: bg2,
                opacity: 0.55,
                display: "flex",
            },
        }),
        // Frosted glass card
        el(
            "div",
            {
                style: {
                    width: "78%",
                    padding: "64px 72px",
                    borderRadius: 28,
                    background: "rgba(255, 255, 255, 0.18)",
                    border: "2px solid rgba(255, 255, 255, 0.45)",
                    boxShadow:
                        "0 30px 80px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
                    display: "flex",
                    flexDirection: "column",
                    color: text,
                    position: "relative",
                },
            },
            el(
                "div",
                {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 28,
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        opacity: 0.9,
                    },
                },
                el("div", {
                    style: {
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: accent,
                        display: "flex",
                    },
                }),
                el("div", { style: { display: "flex" } }, "New")
            ),
            el(
                "div",
                {
                    style: {
                        fontSize: 72,
                        fontWeight: 800,
                        lineHeight: 1.06,
                        letterSpacing: "-0.03em",
                        marginBottom: 22,
                        display: "flex",
                        flexWrap: "wrap",
                    },
                },
                title
            ),
            subtitle
                ? el(
                      "div",
                      {
                          style: {
                              fontSize: 28,
                              fontWeight: 500,
                              opacity: 0.85,
                              lineHeight: 1.4,
                              display: "flex",
                              flexWrap: "wrap",
                          },
                      },
                      subtitle
                  )
                : null
        )
    )
}

function RetroTemplate({ title, subtitle, colors }) {
    const { text, accent } = colors
    // Retro sunset palette (fixed for vibe consistency, accent overrides title underline)
    return el(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                fontFamily: "sans-serif",
                position: "relative",
                background:
                    "linear-gradient(180deg, #1a0b3d 0%, #4c1d95 22%, #db2777 50%, #f97316 72%, #1a0b3d 100%)",
                color: text,
                overflow: "hidden",
            },
        },
        // Sun (large half-disc)
        el("div", {
            style: {
                position: "absolute",
                top: 110,
                left: "50%",
                transform: "translateX(-50%)",
                width: 360,
                height: 360,
                borderRadius: "50%",
                background:
                    "linear-gradient(180deg, #fde047 0%, #f97316 50%, #db2777 100%)",
                boxShadow: "0 0 80px rgba(253, 224, 71, 0.6)",
                display: "flex",
            },
        }),
        // Horizon stripes (decorative bars across the sun)
        el(
            "div",
            {
                style: {
                    position: "absolute",
                    top: 320,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                },
            },
            ...[0.95, 0.7, 0.5, 0.35, 0.22].map((opacity, i) =>
                el("div", {
                    key: `stripe-${i}`,
                    style: {
                        width: `${360 - i * 6}px`,
                        height: 6,
                        background: "#1a0b3d",
                        opacity,
                        display: "flex",
                    },
                })
            )
        ),
        // Bottom grid pattern (perspective lines)
        el("div", {
            style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                display: "flex",
                background:
                    "linear-gradient(180deg, transparent 0%, rgba(26,11,61,0.95) 100%)",
            },
        }),
        // Color stripes at very bottom
        el(
            "div",
            {
                style: {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 12,
                    display: "flex",
                },
            },
            ...["#fde047", "#f97316", "#db2777", "#8b5cf6", "#06b6d4"].map(
                (c, i) =>
                    el("div", {
                        key: `bar-${i}`,
                        style: { flex: 1, background: c, display: "flex" },
                    })
            )
        ),
        // Text content (centered, on top of sun)
        el(
            "div",
            {
                style: {
                    marginTop: "auto",
                    marginBottom: 80,
                    padding: "0 80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 2,
                },
            },
            el("div", {
                style: {
                    width: 64,
                    height: 4,
                    background: accent || "#fde047",
                    marginBottom: 22,
                    display: "flex",
                },
            }),
            el(
                "div",
                {
                    style: {
                        fontSize: 72,
                        fontWeight: 900,
                        lineHeight: 1.02,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: 18,
                        textShadow:
                            "0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(253,224,71,0.3)",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    },
                },
                title
            ),
            subtitle
                ? el(
                      "div",
                      {
                          style: {
                              fontSize: 26,
                              fontWeight: 600,
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              opacity: 0.92,
                              display: "flex",
                              flexWrap: "wrap",
                              justifyContent: "center",
                          },
                      },
                      subtitle
                  )
                : null
        )
    )
}

function renderTemplate(template, props) {
    switch (template) {
        case "gradient":
            return GradientTemplate(props)
        case "minimal":
            return MinimalTemplate(props)
        case "bold":
            return BoldTemplate(props)
        case "split":
            return SplitTemplate(props)
        case "mesh":
            return MeshTemplate(props)
        case "photo":
            return PhotoTemplate(props)
        case "glass":
            return GlassTemplate(props)
        case "retro":
            return RetroTemplate(props)
        default:
            return GradientTemplate(props)
    }
}

export default async function handler(req) {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        })
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
    }

    let body
    try {
        body = await req.json()
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        })
    }

    const {
        title,
        subtitle = "",
        template = "gradient",
        colors = {},
        licenseKey = "",
    } = body

    if (!title || typeof title !== "string" || !title.trim()) {
        return new Response(JSON.stringify({ error: "Title is required" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
    }

    const isPro = await validateLicense(licenseKey)

    if (PRO_TEMPLATES.includes(template) && !isPro) {
        return new Response(
            JSON.stringify({
                error: "This template requires a Pro license.",
            }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        )
    }

    if (!FREE_TEMPLATES.includes(template) && !PRO_TEMPLATES.includes(template)) {
        return new Response(JSON.stringify({ error: "Unknown template" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        })
    }

    const defaultColors = {
        bg1: "#6C63FF",
        bg2: "#EC4899",
        text: "#FFFFFF",
        accent: "#FEF08A",
    }
    const finalColors = { ...defaultColors, ...colors }

    const element = renderTemplate(template, {
        title,
        subtitle,
        colors: finalColors,
        isPro,
    })

    try {
        return new ImageResponse(element, {
            width: 1200,
            height: 630,
            headers: {
                "Cache-Control": "public, max-age=0, must-revalidate",
                "Access-Control-Allow-Origin": "*",
            },
        })
    } catch (e) {
        return new Response(
            JSON.stringify({ error: e?.message || "Rendering failed" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        )
    }
}
