import { useRef, useState } from 'react'
import { analyzeChart } from '../api/claude'

const sigColor = s => s === 'LONG' ? '#00ff88' : s === 'SHORT' ? '#ff4444' : '#ffd700'

export default function Analyze({ apiKey, analysis, setAnalysis, saveAnalysis, goToChat, goToSettings }) {
  const [image, setImage] = useState(null)
  const [b64, setB64] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()

  const loadFile = file => {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setImage(e.target.result)
      setB64(e.target.result.split(',')[1])
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const analyze = async () => {
    if (!apiKey) { setError('⚙️ Configure ta clé API dans Réglages d\'abord.'); return }
    if (!b64) return
    setLoading(true); setError(null)
    try {
      const result = await analyzeChart(apiKey, b64)
      setAnalysis(result)
      saveAnalysis(result, image)
    } catch (e) {
      setError(e.message.includes('401') ? '🔑 Clé API invalide. Vérifie dans Réglages.' : '❌ Analyse échouée. Réessaie.')
    }
    setLoading(false)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]) }}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          style={{
            border: `2px dashed ${drag ? '#00ff88' : image ? '#1a3050' : '#131c2b'}`,
            borderRadius: 14, cursor: 'pointer',
            background: drag ? 'rgba(0,255,136,0.04)' : '#0a0e17',
            overflow: 'hidden', marginBottom: 10,
            minHeight: image ? 0 : 160,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
          }}
        >
          {image
            ? <img src={image} alt="chart" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 12, padding: 4 }} />
            : <>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
              <div style={{ fontSize: 12, color: '#3a5a7a' }}>DÉPOSE TON CHART ICI</div>
              <div style={{ fontSize: 10, color: '#1e2d40', marginTop: 4 }}>ou clique pour choisir</div>
            </>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => loadFile(e.target.files[0])} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {image && (
            <button onClick={() => { setImage(null); setB64(null) }} style={{
              padding: '12px 14px', borderRadius: 10, background: '#0a0e17',
              border: '1px solid #131c2b', color: '#3a5a7a', cursor: 'pointer', fontSize: 12
            }}>✕</button>
          )}
          <button onClick={analyze} disabled={!b64 || loading} style={{
            flex: 1, padding: '13px', borderRadius: 10,
            background: b64 && !loading ? 'linear-gradient(135deg,#00ff88,#00c4f0)' : '#0f1520',
            border: 'none', color: b64 && !loading ? '#000' : '#2a3f5a',
            cursor: b64 && !loading ? 'pointer' : 'not-allowed',
            fontSize: 13, fontWeight: 800, fontFamily: 'inherit', letterSpacing: 2
          }}>
            {loading ? '⏳ ANALYSE EN COURS...' : '⚡ ANALYSER LE CHART'}
          </button>
        </div>

        {error && (
          <div style={{ padding: 12, background: '#1a0808', border: '1px solid #ff444430', borderRadius: 10, color: '#ff6b6b', fontSize: 11, marginBottom: 10 }}>
            {error}
            {error.includes('API') && (
              <button onClick={goToSettings} style={{ display: 'block', marginTop: 8, color: '#00c4f0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
                → Aller dans Réglages
              </button>
            )}
          </div>
        )}

        {analysis && (
          <div>
            <div style={{
              background: '#0d1117', border: `1px solid ${sigColor(analysis.signal)}30`,
              borderRadius: 14, padding: '16px', marginBottom: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{analysis.symbole}</div>
                  <div style={{ fontSize: 10, color: '#3a5a7a' }}>{analysis.timeframe} · {analysis.pattern_detecte}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: sigColor(analysis.signal) }}>{analysis.probabilite}%</div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                    background: `${sigColor(analysis.signal)}15`, border: `1px solid ${sigColor(analysis.signal)}40`,
                    color: sigColor(analysis.signal)
                  }}>{analysis.signal}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#8aaecc', lineHeight: 1.6, padding: '10px 12px', background: '#060810', borderRadius: 8 }}>
                {analysis.resume_simple}
              </div>
            </div>

            {analysis.signal !== 'PAS DE TRADE' && (
              <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
                <div style={{ background: '#0a0e17', border: '1px solid #1a2535', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, color: '#4a6fa5', letterSpacing: 2, marginBottom: 4 }}>ENTRÉE · {analysis.entree?.type}</div>
                  <div style={{ fontSize: 12, color: '#fff' }}>{analysis.entree?.zone}</div>
                  <div style={{ fontSize: 10, color: '#3a5a7a', marginTop: 3 }}>{analysis.entree?.raison}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ background: '#150a0a', border: '1px solid #ff444418', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 9, color: '#ff4444', letterSpacing: 2, marginBottom: 4 }}>STOP LOSS</div>
                    <div style={{ fontSize: 12, color: '#ff6b6b' }}>{analysis.stop_loss?.zone}</div>
                  </div>
                  <div style={{ background: '#081510', border: '1px solid #00ff8818', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 9, color: '#00ff88', letterSpacing: 2, marginBottom: 4 }}>TAKE PROFITS</div>
                    {analysis.take_profits?.map((tp, i) => (
                      <div key={i} style={{ fontSize: 10, color: '#7dffb8', marginBottom: 2 }}>TP{i+1}: {tp.niveau} ({tp.ratio})</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: '#0a0e17', border: '1px solid #00ff8818', borderRadius: 12, padding: '14px', marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: '#00ff88', letterSpacing: 2, marginBottom: 8 }}>CONFLUENCES ({analysis.confluences?.length})</div>
              {analysis.confluences?.map((c, i) => (
                <div key={i} style={{ fontSize: 11, color: '#8ac8a0', paddingLeft: 10, borderLeft: '2px solid #00ff8830', marginBottom: 5 }}>✓ {c}</div>
              ))}
            </div>

            <div style={{ background: '#080c14', border: '1px solid #1e3a5f', borderRadius: 12, padding: '14px', marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: '#3a5a7a', letterSpacing: 2, marginBottom: 6 }}>INVALIDATION</div>
              <div style={{ fontSize: 11, color: '#c0d8f0', lineHeight: 1.6 }}>{analysis.invalidation}</div>
              <div style={{ fontSize: 9, color: '#3a5a7a', letterSpacing: 2, marginTop: 10, marginBottom: 6 }}>VERDICT</div>
              <div style={{ fontSize: 11, color: '#8aaac8', lineHeight: 1.6, fontStyle: 'italic' }}>"{analysis.verdict}"</div>
            </div>

            <button onClick={goToChat} style={{
              width: '100%', padding: '13px', borderRadius: 12,
              background: 'linear-gradient(135deg,#0f1e30,#1a2535)',
              border: '1px solid #00c4f030',
              color: '#00c4f0', cursor: 'pointer', fontSize: 12,
              fontFamily: 'inherit', fontWeight: 700
            }}>
              💬 Discuter de cette analyse →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
