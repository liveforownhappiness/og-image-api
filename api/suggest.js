const FREE_LIMIT = 10 // suggestions per IP per day (no license)
const PRO_LIMIT = 500 // per license per day

const usage = {} // { "key:date": count }

function getId(req) {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket?.remoteAddress ||
        "anon"
    return ip
}

function today() {
    return new Date().toISOString().slice(0, 10)
}

function checkLimit(key, limit) {
    const id = `${key}:${today()}`
    const count = usage[id] || 0
    if (count >= limit) return false
    usage[id] = count + 1
    for (const k of Object.keys(usage)) {
        if (!k.endsWith(today())) delete usage[k]
    }
    return true
}

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

async function callClaude(prompt) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 400,
            messages: [{ role: "user", content: prompt }],
        }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `Claude error ${res.status}`)
    }
    const data = await res.json()
    return data.content[0].text.trim()
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") return res.status(200).end()
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" })

    const { context = "", licenseKey = "" } = req.body || {}
    if (!context.trim()) {
        return res.status(400).json({ error: "Context is required" })
    }

    const isPro = await validateLicense(licenseKey)
    const rateKey = isPro ? licenseKey : getId(req)
    const limit = isPro ? PRO_LIMIT : FREE_LIMIT

    if (!checkLimit(rateKey, limit)) {
        return res.status(429).json({
            error: isPro
                ? "Daily limit reached."
                : "Free daily limit reached (10/day). Upgrade to Pro for 500/day.",
        })
    }

    const prompt = `You write Open Graph (OG) image copy that gets clicks on social media.

Given this page context, generate ONE concise title and ONE short subtitle suitable for a 1200x630 OG image.

Rules:
- Title: 4-10 words, punchy, high-impact, no punctuation at the end
- Subtitle: 6-14 words, supporting the title, adds value or a benefit
- Do NOT wrap in quotes
- Do NOT include any other text
- Return JSON: {"title": "...", "subtitle": "..."}

Context: ${context.slice(0, 2000)}`

    try {
        const raw = await callClaude(prompt)
        // Extract JSON
        const match = raw.match(/\{[\s\S]*?\}/)
        if (!match) throw new Error("Invalid response format")
        const parsed = JSON.parse(match[0])
        return res
            .status(200)
            .json({
                title: parsed.title || "",
                subtitle: parsed.subtitle || "",
                isPro,
            })
    } catch (e) {
        return res
            .status(500)
            .json({ error: e.message || "Suggestion failed" })
    }
}
