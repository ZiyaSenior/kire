import React, { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'

const categoryConfig = {
  'real-estate': { label: 'Əmlak', fields: ['rooms', 'floor', 'area', 'furnished'] },
  vehicles: { label: 'Avtomobil', fields: ['brand', 'model', 'year', 'transmission', 'fuel'] },
  electronics: { label: 'Elektronika', fields: ['brand', 'model', 'ram', 'storage', 'condition'] },
  'books-hobbies': { label: 'Kitab', fields: ['author', 'genre', 'condition'] },
  'fashion-events': { label: 'Geyim', fields: ['size', 'gender', 'condition'] },
  'home-garden': { label: 'Ev & Bağ', fields: ['brand', 'type', 'power', 'condition'] },
  'services-industrial': { label: 'Xidmət', fields: ['brand', 'power', 'usage', 'condition'] },
}

const NewListingModal = ({ visible, onClose, onCreate }) => {
  const { isAuthenticated, user } = useAuth() || {}
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'real-estate', city: 'Bakı', district: '', image: '', metadata: {} })
  const [error, setError] = useState('')

  const fields = useMemo(() => categoryConfig[form.category]?.fields || [], [form.category])

  const handleSubmit = (e) => {
    e?.preventDefault()
    setError('')
    if (!isAuthenticated) {
      setError('Zəhmət olmasa əvvəlcə daxil olun.')
      return
    }
    if (!form.title.trim() || !form.price || !form.category) {
      setError('Başlıq, qiymət və kateqoriya tələb olunur.')
      return
    }
    if (!form.image) {
      setError('Minimum 1 şəkil URL daxil edin.')
      return
    }

    const newItem = {
      id: Date.now().toString(),
      title: form.title,
      category: form.category,
      price: Number(form.price) || 0,
      period: 'günlük',
      location: { city: form.city || 'Bakı', district: form.district || '' },
      date: 'İndi',
      image: form.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
      isVIP: false,
      specs: { ...(form.metadata || {}) },
      description: form.description || '',
      createdAt: new Date().toISOString(),
      userEmail: user?.email || null,
    }

    onCreate && onCreate(newItem)
    setForm({ title: '', description: '', price: '', category: 'real-estate', city: 'Bakı', district: '', image: '', metadata: {} })
    onClose && onClose()
  }

  if (!visible) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Yeni Elan</span>
            <h3>Elan yaradın</h3>
          </div>
          <button onClick={onClose}>✕</button>
        </div>
        <form className="form-box" onSubmit={handleSubmit}>
          <label className="field-block">
            <span>Başlıq</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>

          <label className="field-block">
            <span>Kateqoriya</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {Object.keys(categoryConfig).map((k) => (
                <option key={k} value={k}>{categoryConfig[k].label}</option>
              ))}
            </select>
          </label>

          <label className="field-block">
            <span>Qiymət (AZN)</span>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>

          <label className="field-block">
            <span>Şəhər</span>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </label>

          <label className="field-block">
            <span>Rayon</span>
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </label>

          <label className="field-block">
            <span>Şəkil URL</span>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </label>

          {fields.map((f) => (
            <label key={f} className="field-block">
              <span>{f}</span>
              <input value={form.metadata[f] ?? ''} onChange={(e) => setForm({ ...form, metadata: { ...(form.metadata || {}), [f]: e.target.value } })} />
            </label>
          ))}

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Ləğv et</button>
            <button type="submit" className="btn btn-primary">Elanı dərc et</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewListingModal
