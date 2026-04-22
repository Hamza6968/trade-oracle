import { useState } from 'react'

export default function Settings({ apiKey, setApiKey }) {
  const [key, setKey] = useState(apiKey)
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState(false)

  const save = () => {
    localStorage.setItem('to_apikey', key)
    setApiKey(key)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#3a5a7a', letterSpacing: 3, marginBottom: 20 }}>CONFIGURATION</div>

        <div style={{ background: '#0a0e17', border: '1px solid #1a2535', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 9, color: '#4a6fa5', letterSpacing: 2, marginBottom: 12 }}>CLÉ API ANTHROPIC</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              style={{
                flex: 1, background: '#060810', border: '1px solid #1a2535',
                borderRadius: 8, padding: '10px 12px', color: '#c0d0e0',
                fontSize: 12, outline: 'none'
              }}
            />
            <button onClick={() => setShow(!show)} style={{
              padding: '10px 12px', background: '#0d1520', border: '1px solid #1a2535',
              borderRadius: 8, color: '#4a6fa5', cursor: 'pointer', fontSize: 14
            }}>{show ? '🙈' : '👁'}</button>
          </div>
          <button onClick={save} style={{
            width: '100%', padding: '12px',
            background: key ? 'linear-gradient(135deg,#00ff88,#00c4f0)' : '#0f1520',
            border: 'none', borderRadius: 8,
            color: key ? '#000' : '#2a3f5a',
            cursor: key ? 'pointer' : 'not-allowed',
            fontSize: 12, fontWeight: 800, fontFamily: 'inherit'
          }}>
            {saved ? '✓ Sauvegardée !' : '💾 Sauvegarder'}
          </button>
        </div>

        <div style={{ background: '#080c14', border: '1px solid #1e3a5f', borderRadius: 14, padding: '20px', marginTop: 12 }}>
          <div style={{ fontSize: 9, color: '#4a6fa5', letterSpacing: 2, marginBottom: 12 }}>COMMENT OBTENIR TA CLÉ GRATUITE</div>
          {[
            { n: '1', t: 'Créer un compte', d: 'console.anthropic.com → Sign up (gratuit)' },
            { n: '2', t: '$5 de crédit offert', d: '≈ 1500 analyses gratuites au démarrage' },
            { n: '3', t: 'Générer la clé', d: 'API Keys → Create Key → copier' },
            { n: '4', t: 'Coller ici', d: 'Colle ta clé ci-dessus et sauvegarde' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#00ff88,#00c4f0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#000'
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{s.t}</div>
                <div style={{ fontSize: 10, color: '#4a6fa5', marginTop: 2 }}>{s.d}</div>
              </div>
            </div>
          ))}
          <div style={{ padding: '10px 14px', background: '#0a1520', borderRadius: 8, border: '1px solid #1a3050', marginTop: 4 }}>
            <div style={{ fontSize: 10, color: '#4a7aaa', lineHeight: 1.7 }}>
              💡 Ta clé est stockée <strong style={{ color: '#fff' }}>uniquement sur ton téléphone</strong>. Elle ne transite jamais par un serveur tiers.
            </div>
          </div>
        </div>

        <div style={{ background: '#0a0e17', border: '1px solid #1a2535', borderRadius: 14, padding: '20px', marginTop: 12 }}>
          <div style={{ fontSize: 9, color: '#4a6fa5', letterSpacing: 2, marginBottom: 12 }}>COÛTS INDICATIFS</div>
          {[
            { label: '1 analyse chart', cost: '~$0.003' },
            { label: '1 message chat', cost: '~$0.001' },
            { label: 'Crédit offert ($5)', cost: '≈ 1600 analyses' },
            { label: 'Usage mensuel moyen', cost: '~$2–5/mois' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #0d1520' }}>
              <span style={{ fontSize: 11, color: '#4a6fa5' }}>{r.label}</span>
              <span style={{ fontSize: 12, color: '#00ff88', fontWeight: 700 }}>{r.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
