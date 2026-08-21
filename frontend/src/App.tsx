import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { mockListings as defaultMockListings } from './data/mockListings'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import FilterBar from './components/FilterBar'
import ListingGrid from './components/ListingGrid'
import NewListingModal from './components/NewListingModal'

// Defensive wrapper for mock listings
const safeMockListings = Array.isArray(defaultMockListings) ? defaultMockListings : []

const categories = [
  { key: 'all', icon: '🧭', label: 'Hamısı' },
  { key: 'real-estate', icon: '🏠', label: 'Əmlak' },
  { key: 'vehicles', icon: '🚗', label: 'Nəqliyyat' },
  { key: 'electronics', icon: '💻', label: 'Elektronika' },
  { key: 'home-garden', icon: '🛠️', label: 'Ev & Bağ' },
  { key: 'fashion-events', icon: '👗', label: 'Geyim' },
  { key: 'books-hobbies', icon: '📚', label: 'Kitab' },
  { key: 'services-industrial', icon: '🏗️', label: 'Xidmət' },
] as const

const periodOptions: Array<'all' | ListingPeriod> = ['all', 'daily', 'weekly', 'monthly', 'hourly']

const categoryConfig: Record<'all' | ListingCategory, {
  label: string
  icon: string
  description: string
  filters: Array<{ key: string; label: string; type: 'text' | 'select' | 'number'; options?: string[] }>
  formFields: Array<{ key: string; label: string; type: 'text' | 'number' | 'select'; options?: string[]; required?: boolean }>
}> = {
  all: {
    label: 'Hamısı',
    icon: '🧭',
    description: 'Bütün kateqoriyalar',
    filters: [],
    formFields: [],
  },
  'real-estate': {
    label: 'Əmlak',
    icon: '🏠',
    description: 'Mənzil, ev, ofis, kommersiya saxlama',
    filters: [
      { key: 'rooms', label: 'Otaq', type: 'select', options: ['1', '2', '3', '4'] },
      { key: 'area', label: 'Sahə (m²)', type: 'number' },
      { key: 'floor', label: 'Mərtəbə', type: 'number' },
      { key: 'furnished', label: 'Təmirli', type: 'select', options: ['all', 'true', 'false'] },
    ],
    formFields: [
      { key: 'rooms', label: 'Otaq sayı', type: 'number', required: true },
      { key: 'area', label: 'Sahə (m²)', type: 'number', required: true },
      { key: 'floor', label: 'Mərtəbə', type: 'number', required: true },
      { key: 'furnished', label: 'Təmirli', type: 'select', options: ['true', 'false'] },
    ],
  },
  vehicles: {
    label: 'Nəqliyyat',
    icon: '🚗',
    description: 'Avtomobil, motosikl, velosiped, skuter',
    filters: [
      { key: 'brand', label: 'Brend', type: 'text' },
      { key: 'year', label: 'İl', type: 'number' },
      { key: 'fuel', label: 'Yanacaq', type: 'select', options: ['Benzin', 'Dizel', 'Elektrik', 'Qaz'] },
      { key: 'transmission', label: 'Ötürücü', type: 'select', options: ['Mexanik', 'Avtomat'] },
    ],
    formFields: [
      { key: 'brand', label: 'Brend', type: 'text', required: true },
      { key: 'model', label: 'Model', type: 'text', required: true },
      { key: 'year', label: 'İl', type: 'number', required: true },
      { key: 'fuel', label: 'Yanacaq', type: 'select', options: ['Benzin', 'Dizel', 'Elektrik', 'Qaz'] },
      { key: 'transmission', label: 'Ötürücü', type: 'select', options: ['Mexanik', 'Avtomat'] },
    ],
  },
  electronics: {
    label: 'Elektronika',
    icon: '💻',
    description: 'Laptop, telefon, kamera, oyun konsolu',
    filters: [
      { key: 'brand', label: 'Brend', type: 'text' },
      { key: 'ram', label: 'RAM', type: 'text' },
      { key: 'storage', label: 'SSD/HDD', type: 'text' },
      { key: 'condition', label: 'Vəziyyət', type: 'select', options: ['Yeni', 'Çox yaxşı', 'Yaxşı', 'Köhnə'] },
    ],
    formFields: [
      { key: 'brand', label: 'Brend', type: 'text', required: true },
      { key: 'model', label: 'Model', type: 'text', required: true },
      { key: 'ram', label: 'RAM', type: 'text' },
      { key: 'storage', label: 'Saxlama', type: 'text' },
      { key: 'condition', label: 'Vəziyyət', type: 'select', options: ['Yeni', 'Çox yaxşı', 'Yaxşı', 'Köhnə'] },
    ],
  },
  'home-garden': {
    label: 'Ev & Bağ',
    icon: '🛠️',
    description: 'Alət, generator, mebel, bağ avadanlığı',
    filters: [
      { key: 'brand', label: 'Brend', type: 'text' },
      { key: 'type', label: 'Növ', type: 'text' },
      { key: 'power', label: 'Güc', type: 'text' },
      { key: 'condition', label: 'Vəziyyət', type: 'select', options: ['Yeni', 'Çox yaxşı', 'Yaxşı'] },
    ],
    formFields: [
      { key: 'brand', label: 'Brend', type: 'text', required: true },
      { key: 'type', label: 'Növ', type: 'text', required: true },
      { key: 'power', label: 'Güc', type: 'text' },
      { key: 'condition', label: 'Vəziyyət', type: 'select', options: ['Yeni', 'Çox yaxşı', 'Yaxşı'] },
    ],
  },
  'fashion-events': {
    label: 'Geyim & Aksessuar',
    icon: '👗',
    description: 'Tuxedo, paltar, aksesuar, tədbir geyimi',
    filters: [
      { key: 'size', label: 'Ölçü', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { key: 'gender', label: 'Cins', type: 'select', options: ['Male', 'Female', 'Unisex'] },
      { key: 'brand', label: 'Brend', type: 'text' },
      { key: 'color', label: 'Rəng', type: 'text' },
    ],
    formFields: [
      { key: 'size', label: 'Ölçü', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { key: 'gender', label: 'Cins', type: 'select', options: ['Male', 'Female', 'Unisex'] },
      { key: 'brand', label: 'Brend', type: 'text', required: true },
      { key: 'color', label: 'Rəng', type: 'text' },
    ],
  },
  'books-hobbies': {
    label: 'Kitab & Hobbilər',
    icon: '📚',
    description: 'Kitab, oyun, musiqi aləti, idman avadanlığı',
    filters: [
      { key: 'author', label: 'Müəllif', type: 'text' },
      { key: 'genre', label: 'Janr', type: 'text' },
      { key: 'cover', label: 'Üzlük', type: 'select', options: ['Hardcover', 'Paperback', 'Audio'] },
      { key: 'language', label: 'Dil', type: 'text' },
    ],
    formFields: [
      { key: 'author', label: 'Müəllif', type: 'text' },
      { key: 'genre', label: 'Janr', type: 'text' },
      { key: 'cover', label: 'Üzlük', type: 'select', options: ['Hardcover', 'Paperback', 'Audio'] },
      { key: 'language', label: 'Dil', type: 'text' },
    ],
  },
  'services-industrial': {
    label: 'Xidmət & Avadanlıq',
    icon: '🏗️',
    description: 'Tikinti avadanlığı, tədbir avadanlığı',
    filters: [
      { key: 'brand', label: 'Brend', type: 'text' },
      { key: 'power', label: 'Güc', type: 'text' },
      { key: 'usage', label: 'İstifadə', type: 'text' },
      { key: 'condition', label: 'Vəziyyət', type: 'select', options: ['Yeni', 'Çox yaxşı', 'Yaxşı'] },
    ],
    formFields: [
      { key: 'brand', label: 'Brend', type: 'text', required: true },
      { key: 'power', label: 'Güc', type: 'text' },
      { key: 'usage', label: 'İstifadə sahəsi', type: 'text' },
      { key: 'condition', label: 'Vəziyyət', type: 'select', options: ['Yeni', 'Çox yaxşı', 'Yaxşı'] },
    ],
  },
}

const cityOptions = ['Bakı', 'Gəncə', 'Sumqayıt', 'Şəki']
const amenityPool = ['Wi‑Fi', 'Parkinq', 'Balcony', 'Furnished', 'Elevator', 'Garden', 'Security', 'Pool']

const emptyListingForm = {
  title: '',
  category: 'real-estate' as ListingCategory,
  city: 'Bakı',
  district: '',
  price: '',
  period: 'monthly' as ListingPeriod,
  description: '',
  image: '',
  metadata: {
    rooms: '',
    area: '',
    floor: '',
    furnished: '',
    brand: '',
    model: '',
    year: '',
    fuel: '',
    transmission: '',
    ram: '',
    storage: '',
    condition: '',
    type: '',
    power: '',
    size: '',
    gender: '',
    color: '',
    author: '',
    genre: '',
    cover: '',
    language: '',
    usage: '',
  },
}

function AppInner() {
  const normalizedInitialListings = useMemo(() => safeMockListings.map((listing) => ({ ...(listing || {}), tags: Array.isArray(listing?.tags) ? listing.tags : [], metadata: listing?.metadata ?? {} })), [])

  const [allListings, setAllListings] = useState(() => normalizedInitialListings)
  const [selectedCategory, setSelectedCategory] = useState<'all' | ListingCategory>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | ListingPeriod>('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [city, setCity] = useState('Bakı')
  const [district, setDistrict] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [categorySpecificFilters, setCategorySpecificFilters] = useState<Record<string, string>>({})
  const [showModal, setShowModal] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [listingForm, setListingForm] = useState(emptyListingForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ fullName: '', identifier: '', password: '', phone: '' })
  const [authError, setAuthError] = useState('')

  const { isAuthenticated, login, register } = useAuth() || {}

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSuccess('')
    }, 2400)

    return () => window.clearTimeout(timer)
  }, [success])

  const activeCategoryConfig = categoryConfig[selectedCategory]

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const minValue = Number(priceMin) || 0
    const maxValue = Number(priceMax) || Number.POSITIVE_INFINITY

    return allListings.filter((listing) => {
      const categoryMatch = selectedCategory === 'all' || listing.category === selectedCategory
      const periodMatch = selectedPeriod === 'all' || listing.period === selectedPeriod
      const cityMatch = city === 'all' || listing.city === city
      const districtMatch = !district || listing.district.toLowerCase().includes(district.toLowerCase())
      const priceMatch = listing.price >= minValue && listing.price <= maxValue
      const safeTags = Array.isArray(listing.tags) ? listing.tags : []
      const safeMetadata = listing.metadata ?? {}

      const amenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((item) => safeTags.includes(item) || Object.values(safeMetadata).includes(item))

      const metadataMatch = Object.entries(categorySpecificFilters).every(([key, value]) => {
        if (!value || value === 'all') return true
        const itemValue = safeMetadata[key]
        if (typeof itemValue === 'string' || typeof itemValue === 'number' || typeof itemValue === 'boolean') {
          return String(itemValue).toLowerCase() === String(value).toLowerCase()
        }
        return true
      })

      const haystack = [
        listing.title,
        listing.description,
        listing.city,
        listing.district,
        listing.address,
        listing.subcategory,
        ...listing.tags,
      ]
        .join(' ')
        .toLowerCase()

      const searchMatch = !normalizedSearch || haystack.includes(normalizedSearch)

      return (
        categoryMatch &&
        periodMatch &&
        cityMatch &&
        districtMatch &&
        priceMatch &&
        amenitiesMatch &&
        metadataMatch &&
        searchMatch
      )
    })
  }, [allListings, selectedCategory, searchTerm, selectedPeriod, priceMin, priceMax, city, district, selectedAmenities, categorySpecificFilters])

  const dynamicFilterFields = useMemo(() => {
    return categoryConfig[selectedCategory]?.filters ?? []
  }, [selectedCategory])

  const dynamicFormFields = useMemo(() => {
    return categoryConfig[listingForm.category]?.formFields ?? []
  }, [listingForm.category])

  const handleChange = <T extends Record<string, any>>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T, value: T[keyof T]) => {
    setter((prev) => ({ ...prev, [key]: value }))
  }

  const handleCreateListing = (newItem) => {
    // robust append
    try {
      if (!newItem || !newItem.title) {
        setError('Etibarsız elan məlumatı')
        return
      }
      setAllListings((prev) => [newItem, ...(Array.isArray(prev) ? prev : [])])
      setShowModal(false)
      setListingForm(emptyListingForm)
      setWizardStep(1)
      setError('')
      setSuccess('Yeni elan uğurla əlavə edildi.')
    } catch (err) {
      console.error('append error', err)
      setError('Elanı əlavə edərkən xəta baş verdi')
    }
  }

  // (legacy handlers removed — creation handled by NewListingModal)
  const renderDynamicFilterInputs = () => {
    if (!dynamicFilterFields.length) return null

    return (
      <div className="dynamic-filters">
        {dynamicFilterFields.map((field) => (
          <label key={field.key} className="field-block">
            <span>{field.label}</span>
            {field.type === 'select' ? (
              <select
                value={categorySpecificFilters[field.key] ?? 'all'}
                onChange={(event) =>
                  setCategorySpecificFilters((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
              >
                <option value="all">Hamısı</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={categorySpecificFilters[field.key] ?? ''}
                onChange={(event) =>
                  setCategorySpecificFilters((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                placeholder={field.label}
              />
            )}
          </label>
        ))}
      </div>
    )
  }

  const renderDynamicFormInputs = () => {
    if (!dynamicFormFields.length) return null

    return (
      <div className="dynamic-form-grid">
        {dynamicFormFields.map((field) => (
          <label key={field.key} className="field-block">
            <span>{field.label}</span>
            {field.type === 'select' ? (
              <select
                value={listingForm.metadata[field.key] ?? ''}
                onChange={(event) =>
                  setListingForm((prev) => ({
                    ...prev,
                    metadata: { ...prev.metadata, [field.key]: event.target.value },
                  }))
                }
              >
                <option value="">Seçin</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={listingForm.metadata[field.key] ?? ''}
                onChange={(event) =>
                  setListingForm((prev) => ({
                    ...prev,
                    metadata: { ...prev.metadata, [field.key]: event.target.value },
                  }))
                }
                placeholder={field.label}
              />
            )}
          </label>
        ))}
      </div>
    )
  }
    return (
      <div className="page-shell">
      <header className="topbar container">
        <div className="brand-wrap">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">Multirent</div>
            <div className="brand-sub">Universal rental marketplace</div>
          </div>
        </div>

        <nav className="main-nav">
          <a href="#explore">Axtarış</a>
          <a href="#categories">Kateqoriyalar</a>
          <a href="#how-it-works">Necə işləyir</a>
          <a href="#publish">Yayımla</a>
        </nav>

          <div className="nav-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setShowLoginModal(true)}>Daxil ol / Qeydiyyat</button>
            <button type="button" className="btn btn-primary" onClick={() => {
              if (!isAuthenticated) setShowLoginModal(true)
              else setShowModal(true)
            }}>+ Yeni Elan</button>
          </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">Universal rental platform</span>
            <h1>Kirayə üçün hər şey bir yerdə.</h1>
            <p>
              Mənzil, avtomobil, laptop, kitab, alət və tədbir avadanlığı — yalnız bir axtarış paneli ilə tapın.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary large" onClick={() => setShowModal(true)}>Elan yerləşdir</button>
              <button type="button" className="btn btn-secondary large">Baxış</button>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-header">
              <span className="status-dot" />
              Axtarış motoru
            </div>

            <div className="search-box">
              <label className="field-block">
                <span>Axtarış</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="MacBook, mənzil, BMW, kitab..."
                />
              </label>

              <label className="field-block">
                <span>Kateqoriya</span>
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value as 'all' | ListingCategory)}>
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>{category.icon} {category.label}</option>
                  ))}
                </select>
              </label>

              <label className="field-block">
                <span>Şəhər</span>
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  <option value="Bakı">Bakı</option>
                  <option value="Gəncə">Gəncə</option>
                  <option value="Sumqayıt">Sumqayıt</option>
                  <option value="all">Hamısı</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="stats container">
          {[
            { value: '8+', label: 'kateqoriya' },
            { value: '1.2k+', label: 'aktiv elan' },
            { value: '24/7', label: 'dostluq sistemi' },
          ].map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section id="categories" className="categories container">
          <div className="section-heading">
            <span className="eyebrow">Kateqoriyalar</span>
            <h2>Hər ehtiyac üçün uyğun kirayə</h2>
          </div>

          <div className="category-grid">
            {categories
              .filter((category) => category.key !== 'all')
              .map((category) => {
                const config = categoryConfig[category.key as ListingCategory]
                return (
                  <article
                    key={category.key}
                    className={`category-card ${selectedCategory === category.key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.key as ListingCategory)}
                  >
                    <div className="category-icon">{config.icon}</div>
                    <h3>{config.label}</h3>
                    <p>{config.description}</p>
                  </article>
                )
              })}
          </div>
        </section>

        <section id="explore" className="featured container">
          <div className="section-heading inline">
            <div>
              <span className="eyebrow">Axtarış nəticələri</span>
              <h2>{selectedCategory === 'all' ? 'Bütün elanlar' : activeCategoryConfig.label}</h2>
            </div>
          </div>

          <FilterBar filters={{ search: searchTerm, category: selectedCategory, city, minPrice: priceMin, maxPrice: priceMax, period: selectedPeriod }} onChange={(f) => {
            setSearchTerm(f.search || '')
            setSelectedCategory(f.category || 'all')
            setCity(f.city || 'Bakı')
            setPriceMin(f.minPrice || '')
            setPriceMax(f.maxPrice || '')
            setSelectedPeriod(f.period || 'all')
          }} />

          <div style={{ padding: 12 }}>
            <ListingGrid items={allListings} filters={{ search: searchTerm, category: selectedCategory, city, minPrice: priceMin, maxPrice: priceMax, period: selectedPeriod }} onContact={(item) => {
              if (!isAuthenticated) setShowLoginModal(true)
              else alert('Contact owner for ' + (item.title || ''))
            }} />
          </div>
        </section>

        <section id="how-it-works" className="process container">
          <div className="section-heading center-text">
            <span className="eyebrow">Necə işləyir</span>
            <h2>3 addımda kirayə prosesi</h2>
          </div>

          <div className="steps-grid">
            {[
              { number: '01', title: 'Axtar', text: 'Yeni axtarış motoru ilə kateqoriya və xüsusiyyətləri seç.' },
              { number: '02', title: 'Filtrlə', text: 'Qiymət, rayon, otaq, marka və digər parametrləri tətbiq et.' },
              { number: '03', title: 'Kirayə et', text: 'İstədiyin elanlara dərhal bax və sifarişini et.' },
            ].map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="publish" className="cta-panel container">
          <div>
            <span className="eyebrow">Yeni elan</span>
            <h2>Multirent-də öz kirayə obyektini də yerləşdir.</h2>
          </div>
          <button type="button" className="btn btn-primary large" onClick={() => setShowModal(true)}>Yayımla</button>
        </section>
      </main>

      <footer className="footer container">
        <div className="brand-wrap">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">Multirent</div>
            <div className="brand-sub">Universal Rental</div>
          </div>
        </div>
        <div className="footer-links">
          <a href="#">Haqqımızda</a>
          <a href="#">Müqavilə</a>
          <a href="#">Əlaqə</a>
        </div>
      </footer>

      <NewListingModal visible={showModal} onClose={() => setShowModal(false)} onCreate={handleCreateListing} />

      {showLoginModal && (
        <div className="modal-backdrop" onClick={() => setShowLoginModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">{authMode === 'login' ? 'Daxil ol' : 'Qeydiyyat'}</span>
                <h3>{authMode === 'login' ? 'Hesabınıza daxil olun' : 'Yeni hesab yaradın'}</h3>
              </div>
              <button type="button" className="close-button" onClick={() => setShowLoginModal(false)}>✕</button>
            </div>

            <div className="form-box">
              {authMode === 'signup' && (
                <label className="field-block">
                  <span>Ad / Soyad</span>
                  <input value={authForm.fullName} onChange={(e) => setAuthForm((p) => ({ ...p, fullName: e.target.value }))} />
                </label>
              )}

              <label className="field-block">
                <span>Email / Telefon</span>
                <input value={authForm.identifier} onChange={(e) => setAuthForm((p) => ({ ...p, identifier: e.target.value }))} />
              </label>

              <label className="field-block">
                <span>Şifrə</span>
                <input type="password" value={authForm.password} onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))} />
              </label>

              {authMode === 'signup' && (
                <label className="field-block">
                  <span>Telefon</span>
                  <input value={authForm.phone} onChange={(e) => setAuthForm((p) => ({ ...p, phone: e.target.value }))} />
                </label>
              )}

              {authError && <p className="error">{authError}</p>}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowLoginModal(false)}>Ləğv et</button>
                <button type="button" className="btn btn-secondary" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>{authMode === 'login' ? 'Qeydiyyat' : 'Daxil ol'}</button>
                <button type="button" className="btn btn-primary" onClick={async () => {
                  setAuthError('')
                  if (authMode === 'login') {
                    const r = await (login ? login(authForm.identifier, authForm.password) : { success: false, message: 'Auth unavailable' })
                    if (!r.success) setAuthError(r.error || r.message || 'Login failed')
                    else setShowLoginModal(false)
                  } else {
                    const r = await (register ? register({ fullName: authForm.fullName, email: authForm.identifier, password: authForm.password, phone: authForm.phone }) : { success: false, message: 'Auth unavailable' })
                    if (!r.success) setAuthError(r.error || r.message || 'Register failed')
                    else setShowLoginModal(false)
                  }
                }}>{authMode === 'login' ? 'Giriş' : 'Qeydiyyat'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </AuthProvider>
  )
}
