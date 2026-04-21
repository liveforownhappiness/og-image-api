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
        case "glass":
        case "retro":
            // Fallback: reuse mesh for now; to be implemented as real variants
            return MeshTemplate(props)
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
