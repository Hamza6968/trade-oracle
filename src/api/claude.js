const MODEL = 'claude-sonnet-4-20250514'

const ANALYZE_SYSTEM = `Tu es un analyste de trading d'élite avec 20 ans d'expérience.
Ta mission : analyser le chart fourni et identifier les setups à haute probabilité.
RÈGLE : Si pas de setup clair → signal "PAS DE TRADE".
Analyse : structure de marché, supports/résistances, patterns, confluences, volume, FVG.
Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "symbole": "...",
  "timeframe": "...",
  "probabilite": 0-100,
  "signal": "LONG"|"SHORT"|"PAS DE TRADE",
  "tendance_globale": "HAUSSIÈRE"|"BAISSIÈRE"|"RANGE",
  "pattern_detecte": "...",
  "resume_simple": "...",
  "entree": { "zone": "...", "type": "MARKET|LIMIT|STOP", "raison": "..." },
  "stop_loss": { "zone": "...", "raison": "..." },
  "take_profits": [
    { "niveau": "...", "ratio": "1:X" },
    { "niveau": "...", "ratio": "1:X" },
    { "niveau": "...", "ratio": "1:X" }
  ],
  "confluences": ["..."],
  "points_vigilance": ["..."],
  "invalidation": "...",
  "gestion_trade": "...",
  "verdict": "..."
}`

export const analyzeChart = async (apiKey, b64Image) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: ANALYZE_SYSTEM,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64Image } },
          { type: 'text', text: 'Analyse ce chart. JSON uniquement.' }
        ]
      }]
    })
  })
  if (!res.ok) throw new Error(`API Error ${res.status}`)
  const data = await res.json()
  const raw = data.content?.find(b => b.type === 'text')?.text || ''
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}

export const chatWithAnalysis = async (apiKey, analysis, messages) => {
  const system = `Tu es un analyste de trading expert. Analyse en cours :
${JSON.stringify(analysis, null, 2)}
Réponds en français, de façon concise et professionnelle. Max 120 mots sauf question complexe.
Utilise des emojis pour la lisibilité mobile.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  })
  if (!res.ok) throw new Error(`API Error ${res.status}`)
  const data = await res.json()
  return data.content?.find(b => b.type === 'text')?.text || ''
}
