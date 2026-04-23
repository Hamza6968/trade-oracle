const sigColor = s => s === 'LONG' ? '#00ff88' : s === 'SHORT' ? '#ff4444' : '#ffd700'

export default function History({ history, setHistory, setAnalysis, goToChat }) {
  const clear = () => {
    if (confirm('Vider tout l\'historique ?')) {
      setHistory([])
      localStorage.removeItem('to_history')
    }
  }

  if (!history.length) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🗂</div>
      <div style={{ fontSize: 13, color: '#3a5a7a' }}>Aucune analyse sauvegardée</div>
      <div style={{ fontSize: 10, color: '#1e2d40', marginTop: 6 }}>Tes analyses apparaîtront ici automatiquement</div>
    </div>
  )

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: '#3a5a7a', letterSpacing: 2 }}>{history.length} ANALYSE{history.length > 1 ? 'S' : ''}</span>
          <button onClick={clear} style={{ padding: '6px 12px', borderRadius: 8, background: 'none', border: '1px solid #ff444430', color: '#ff4444', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>🗑 Vider</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map((entry, i) => (
            <div key={i} style={{ background: '#0a0e17', border: `1px solid ${sigColor(entry.signal)}20`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{entry.symbole}</div>
                  <div style={{ fontSize: 9, color: '#3a5a7a', marginTop: 2 }}>{new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 9, fontWeight: 800, background: `${sigColor(entry.signal)}15`, border: `1px solid ${sigColor(entry.signal)}35`, color: sigColor(entry.signal) }}>{entry.signal}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: sigColor(entry.signal) }}>{entry.probabilite}%</span>
                </div>
              </div>
              {entry.image && (
                <img src={entry.image} alt="" style={{ width: '100%', maxHeight: 130, objectFit: 'contain', borderRadius: 8, marginBottom: 8, opacity: 0.75 }} />
              )}
              <div style={{ fontSize: 11, color: '#6a8aaa', lineHeight: 1.5, marginBottom: 10 }}>{entry.resume_simple}</div>
              <button onClick={() => { setAnalysis(entry); goToChat() }} style={{
                width: '100%', padding: '9px', borderRadius: 8,
                background: '#0d1520', border: '1px solid #1a2535',
                color: '#4a7aaa', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit'
              }}>💬 Reprendre le chat sur cette analyse</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
