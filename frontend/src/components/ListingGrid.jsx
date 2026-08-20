import React, { useMemo } from 'react'
import ListingCard from './ListingCard'

const ListingGrid = ({ items, filters, onContact }) => {
  const safeItems = Array.isArray(items) ? items : []
  const safeFilters = filters || {}

  const filtered = useMemo(() => {
    try {
      const search = (safeFilters.search || '').toLowerCase().trim()
      const cat = safeFilters.category || 'all'
      const city = safeFilters.city || 'all'
      const min = Number(safeFilters.minPrice) || 0
      const max = safeFilters.maxPrice ? Number(safeFilters.maxPrice) || Infinity : Infinity
      const period = safeFilters.period || 'all'

      return safeItems.filter((it) => {
        if (!it) return false
        if (cat !== 'all' && (it.category || '') !== cat) return false
        if (city !== 'all' && (it.city || '').toLowerCase() !== city.toLowerCase()) return false
        const price = Number(it.price) || 0
        if (price < min || price > max) return false
        if (period !== 'all' && (it.period || '') !== period) return false
        if (search) {
          const hay = [it.title, it.description, it.subcategory, it.tags?.join(' ')].filter(Boolean).join(' ').toLowerCase()
          if (!hay.includes(search)) return false
        }
        return true
      })
    } catch (err) {
      console.error('Filter error', err)
      return safeItems
    }
  }, [safeItems, safeFilters])

  return (
    <div className="listing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
      {filtered.map((item) => (
        <ListingCard key={item?.id ?? Math.random()} item={item} onContact={onContact} />
      ))}
    </div>
  )
}

export default ListingGrid
