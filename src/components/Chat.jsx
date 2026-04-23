import { useState, useRef, useEffect } from 'react'
import { chatWithAnalysis } from '../api/claude'

const SUGGESTIONS = [
  'Explique-moi l\'entrée',
  'Quel est le R:R exact ?',
  'Risques principaux ?',
  'Comment gérer la position ?',
  'Invalidation du setup ?',
  'Avis sur le timing ?',
]

const sigColor = s => s === 'LONG' ? '#00ff88' : s === 'SHORT' ? '#ff4444' : '#ffd700'

function renderMd(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>').replace(/\n/g, '<br/>')
}

export default function Chat({ apiKey, analysis, goToAnalyze }) {
  const [messages, setMessages] = useState(() =>
    analysis ? [{
      role: 'assistant',
      content: `✅ Analyse chargée : **${analysis.symbole}** (${analysis.timeframe})\n\n📊 Signal **${analysis.signal}** — ${analysis.probabilite}% de probabilité\n\n💬 Pose-moi toutes tes questions sur ce setup !`
    }] : []
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || !analysis || loading) return
    const userMsg = { role: 'user', content: msg }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)
    try {
      const reply = await chatWithAnalysis(apiKey, analysis, newMsgs)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur de connexion. Réessaie.' }])
    }
    setLoading(false)
  }

  if (!analysis) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <div style={{ fontSize: 13, color: '#3a5a7a', marginBottom: 20 }}>Aucune analyse en cours</div>
      <button onClick={goToAnalyze} style={{
        padding: '12px 24px', borderRadius: 10,
        background: 'linear-gradient(135deg,#00ff88,#00c4f0)',
        border: 'none', color: '#000', cursor: 'pointer',
        fontSize: 12, fontWeight: 800, fontFamily: 'inherit'
      }}>📊 Analyser un chart</button>
    </div>
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#0d1117', borderBottom: '1px solid #131c2b', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{analysis.symbole} <span style={{ color: '#3a5a7a', fontSize: 10 }}>{analysis.timeframe}</span></span>
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, background: `${sigColor(analysis.signal)}15`, border: `1px solid ${sigColor(analysis.signal)}35`, color: sigColor(analysis.signal) }}>{analysis.signal} · {analysis.probabilite}%</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: 'linear-gradient(135deg,#00ff88,#00c4f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 7, marginTop: 2 }}>🎯</div>
            )}
            <div
              style={{
                maxWidth: '80%', padding: '10px 12px', fontSize: 11, lineHeight: 1.7,
                borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                background: m.role === 'user' ? 'linear-gradient(135deg,#00c4f018,#00ff8812)' : '#0d1520',
                border: m.role === 'user' ? '1px solid #00ff8820' : '1px solid #131c2b',
                color: m.role === 'user' ? '#c0e8d0' : '#b0c8e0'
              }}
              dangerouslySetInnerHTML={{ __html: renderMd(m.content) }}
            />
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#00ff88,#00c4f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🎯</div>
            <div style={{ padding: '10px 14px', background: '#0d1520', border: '1px solid #131c2b', borderRadius: '12px 12px 12px 3px', display: 'flex', gap: 5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: `pulse 1s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div style={{ padding: '0 14px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{
              padding: '5px 11px', borderRadius: 20,
              background: '#0a1520', border: '1px solid #1a2d40',
              color: '#4a7aaa', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit'
            }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ padding: '10px 14px', borderTop: '1px solid #131c2b', background: '#08090f', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Pose ta question..."
          style={{
            flex: 1, background: '#0d1520', border: '1px solid #1a2d40',
            borderRadius: 10, padding: '10px 12px', color: '#c0d8f0',
            fontSize: 12, outline: 'none'
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} style={{
          padding: '10px 14px', borderRadius: 10, border: 'none',
          background: input.trim() && !loading ? 'linear-gradient(135deg,#00ff88,#00c4f0)' : '#0f1520',
          color: input.trim() && !loading ? '#000' : '#2a3f5a',
          cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
          fontSize: 16
        }}>➤</button>
      </div>
    </div>
  )
}
