import React from 'react'

const FilterBar = ({ filters, onChange }) => {
  const safeFilters = filters || {}

  return (
    <div className="filter-bar container" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        aria-label="search"
        placeholder="MacBook, mənzil, BMW..."
        value={safeFilters.search || ''}
        onChange={(e) => onChange({ ...safeFilters, search: e.target.value })}
        style={{ flex: 1, minWidth: 180 }}
      />

      <select value={safeFilters.category || 'all'} onChange={(e) => onChange({ ...safeFilters, category: e.target.value })}>
        <option value="all">Bütün kateqoriyalar</option>
        <option value="real-estate">Əmlak</option>
        <option value="vehicles">Avtomobil</option>
        <option value="electronics">Elektronika</option>
        <option value="books-hobbies">Kitab</option>
        <option value="fashion-events">Geyim</option>
        <option value="home-garden">Ev & Bağ</option>
        <option value="services-industrial">Xidmətlər</option>
      </select>

      <select value={safeFilters.city || 'all'} onChange={(e) => onChange({ ...safeFilters, city: e.target.value })}>
        <option value="all">Bütün şəhərlər</option>
        <option value="Bakı">Bakı</option>
        <option value="Gəncə">Gəncə</option>
        <option value="Sumqayıt">Sumqayıt</option>
      </select>

      <input type="number" placeholder="Min AZN" value={safeFilters.minPrice ?? ''} onChange={(e) => onChange({ ...safeFilters, minPrice: e.target.value })} />
      <input type="number" placeholder="Max AZN" value={safeFilters.maxPrice ?? ''} onChange={(e) => onChange({ ...safeFilters, maxPrice: e.target.value })} />

      <select value={safeFilters.period || 'all'} onChange={(e) => onChange({ ...safeFilters, period: e.target.value })}>
        <option value="all">Hamısı</option>
        <option value="hourly">Saatlıq</option>
        <option value="daily">Günlük</option>
        <option value="monthly">Aylıq</option>
      </select>
    </div>
  )
}

export default React.memo(FilterBar)
