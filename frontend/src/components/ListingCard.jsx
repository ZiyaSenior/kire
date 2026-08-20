import React from 'react'
import { useAuth } from '../context/AuthContext'

const ListingCard = ({ item, onContact }) => {
  const safe = item || {}
  const { isAuthenticated } = useAuth() || {}

  return (
    <article className="listing-card" style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        <img src={safe.image || '/favicon.ico'} alt={safe.title || 'Listing'} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', left: 8, top: 8, background: '#fff', padding: '4px 8px', borderRadius: 6 }}>
          <strong>{safe.price ?? 0} AZN</strong>
          <span style={{ marginLeft: 6, fontSize: 12 }}> / {safe.period || 'gün'}</span>
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: '0 0 8px' }}>{safe.title || '—'}</h3>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{(safe.district || '') + (safe.city ? ' • ' + safe.city : '')}</div>
        <p style={{ fontSize: 14, color: '#333' }}>{safe.description || ''}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {(safe.tags || []).slice(0, 3).map((t, i) => (
            <span key={i} style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 16, fontSize: 12 }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <small style={{ color: '#999' }}>{new Date(safe.createdAt || Date.now()).toLocaleDateString()}</small>
          <button className="btn btn-primary" onClick={() => onContact && onContact(safe)}>{isAuthenticated ? 'Kontakt' : 'Daxil ol'}</button>
        </div>
      </div>
    </article>
  )
}

export default React.memo(ListingCard)
