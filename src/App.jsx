import { useState } from 'react'
import Analyze from './components/Analyze'
import Chat from './components/Chat'
import History from './components/History'
import Settings from './components/Settings'

const TABS = [
  { id: 'analyze', icon: '📊', label: 'Analyse' },
  { id: 'chat',    icon: '💬', label: 'Chat' },
  { id: 'history', icon: '🗂',  label: 'Historique' },
  { id: 'settings',icon: '⚙️', label: 'Réglages' },
]

const sigColor = s => s === 'LONG' ? '#00ff88' : s === 'SHORT' ? '#ff4444' : '#ffd700'

export default function App() {
  const [tab, setTab] = useState('analyze')
  const [analysis, setAnalysis] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('to_history') || '[]') } catch { return [] }
  })
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('to_apikey') || '')

  const saveAnalysis = (a, img) => {
    const entry = { ...a, date: new Date().toISOString(), image: img }
    const updated = [entry, ...history].slice(0, 50)
    setHistory(updated)
    localStorage.setItem('to_history', JSON.stringify(updated))
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#060810' }}>
      <div style={{
        background: '#0d1117', borderBottom: '1px solid #131c2b',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        paddingTop: 'max(12px, env(safe-area-inset-top))'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg,#00ff88,#00c4f0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
        }}>🎯</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#fff' }}>TRADE ORACLE</div>
          <div style={{ fontSize: 8, color: '#2a4a6a', letterSpacing: 3 }}>AI CHART ANALYZER</div>
        </div>
        {analysis && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
              background: `${sigColor(analysis.signal)}15`,
              border: `1px solid ${sigColor(analysis.signal)}40`,
              color: sigColor(analysis.signal)
            }}>{analysis.signal}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#00ff88' }}>{analysis.probabilite}%</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'analyze'  && <Analyze apiKey={apiKey} analysis={analysis} setAnalysis={setAnalysis} saveAnalysis={saveAnalysis} goToChat={() => setTab('chat')} goToSettings={() => setTab('settings')} />}
        {tab === 'chat'     && <Chat apiKey={apiKey} analysis={analysis} goToAnalyze={() => setTab('analyze')} />}
        {tab === 'history'  && <History history={history} setHistory={setHistory} setAnalysis={setAnalysis} goToChat={() => setTab('chat')} />}
        {tab === 'settings' && <Settings apiKey={apiKey} setApiKey={setApiKey} />}
      </div>

      <div style={{
        background: '#0d1117', borderTop: '1px solid #131c2b',
        display: 'flex',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 4px 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{
              fontSize: 9, letterSpacing: 0.5, fontFamily: 'inherit',
              color: tab === t.id ? '#00ff88' : '#2a4a6a',
              fontWeight: tab === t.id ? 700 : 400
            }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 2, background: '#00ff88', borderRadius: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  )
}
