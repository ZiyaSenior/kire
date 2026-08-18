import { useEffect, useMemo, useRef, useState } from 'react'
import { mockListings } from './data/mockListings'
import './App.css'

const API_URL = 'http://localhost:5000'

const stats = [
  { value: '3,200+', label: 'aktiv elan' },
  { value: '45 min', label: 'orta cavab vaxtı' },
  { value: '96%', label: 'müştəri memnuniyyəti' },
]

const categories = [
  { emoji: '🏠', title: 'Mənzillər', subtitle: '1+1, 2+1, penthouse' },
  { emoji: '🏢', title: 'Ofis', subtitle: 'Biznes sahələri və ofislər' },
  { emoji: '🛏️', title: 'Qaraj və otaq', subtitle: 'Dostluq üçün rahat seçim' },
  { emoji: '🌆', title: 'Viya', subtitle: 'Şəhərin mərkəzində' },
]

const steps = [
  { number: '01', title: 'Axtarış et', text: 'Ərazi, kateqoriya və qiyməti seçərək ən uyğun variantları gör.' },
  { number: '02', title: 'Təhlükəsiz əlaqə', text: 'Kirayəçi və sahibinə daha rahat və etibarlı şəkildə əlaqə qur.' },
  { number: '03', title: 'Sözleşməni imzala', text: 'Bütün məlumatlar açıq şəkildə görünsün, razılaşma sürətli olsun.' },
]

const amenityOptions = ['Wi‑Fi', 'Parkinq', 'Balcony', 'Furnished', 'Elevator', 'Garden', 'Security', 'Pool']

const emptyProfile = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
}

const emptyListing = {
  title: '',
  description: '',
  price: '',
  category: 'apartment',
  city: 'Bakı',
  district: '',
  rooms: '1',
  floor: '1',
  area: '35',
  period: 'monthly',
  imageUrl: '',
}

const defaultFilters = {
  search: '',
  city: 'Bakı',
  district: '',
  period: 'all',
  minPrice: '',
  maxPrice: '',
  rooms: 'all',
  floor: 'all',
  area: 'all',
  amenities: [],
}

function App() {
  const [listings, setListings] = useState([])
  const [searchForm, setSearchForm] = useState({ search: '', city: 'Bakı', category: '' })
  const [authForm, setAuthForm] = useState({ ...emptyProfile })
  const [loginForm, setLoginForm] = useState({ identifier: 'safaraliyevziya@gmail.com', password: 'Admin123!' })
  const [listingForm, setListingForm] = useState({ ...emptyListing })
  const [token, setToken] = useState(localStorage.getItem('kireToken') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('kireUser') || 'null'))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentView, setCurrentView] = useState('home')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [filters, setFilters] = useState(defaultFilters)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setListings(mockListings)
      setIsLoadingListings(false)
    }, 450)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!searchTimeoutRef.current) {
      searchTimeoutRef.current = setTimeout(() => {
        setSearchForm((prev) => ({ ...prev, search: filters.search }))
      }, 300)
    }

    return () => {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }, [filters.search])

  const saveAuthState = (authToken, authUser) => {
    localStorage.setItem('kireToken', authToken)
    localStorage.setItem('kireUser', JSON.stringify(authUser))
    setToken(authToken)
    setUser(authUser)
  }

  const clearAuthState = () => {
    localStorage.removeItem('kireToken')
    localStorage.removeItem('kireUser')
    setToken('')
    setUser(null)
  }

  const handleAuthChange = (setter) => (event) => {
    const { name, value } = event.target
    setter((prev) => ({ ...prev, [name]: value }))
  }

  const handleFiltersChange = (event) => {
    const { name, value, type, checked } = event.target

    if (name === 'amenity') {
      setFilters((prev) => {
        const nextAmenities = checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((item) => item !== value)

        return { ...prev, amenities: nextAmenities }
      })
      return
    }

    if (type === 'checkbox') {
      setFilters((prev) => ({ ...prev, [name]: checked }))
      return
    }

    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginForm.identifier,
          password: loginForm.password,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Giriş alınmadı')
      }

      saveAuthState(data.token, data.user)
      setSuccess('Giriş uğurla tamamlandı.')
      setLoginForm({ identifier: '', password: '' })
      setCurrentView('home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: authForm.fullName,
          email: authForm.email,
          phone: authForm.phone,
          password: authForm.password,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Qeydiyyat uğursuz oldu')
      }

      saveAuthState(data.token, data.user)
      setSuccess('Qeydiyyat uğurla tamamlandı.')
      setAuthForm({ ...emptyProfile })
      setCurrentView('home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateListing = (event) => {
    event.preventDefault()

    const title = listingForm.title.trim()
    const description = listingForm.description.trim()
    const price = Number(listingForm.price)

    if (!title || !description || Number.isNaN(price) || price <= 0) {
      setError('Zəhmət olmasa başlıq, təsvir və düzgün qiymət daxil edin.')
      return
    }

    const nextListing = {
      id: Date.now(),
      title,
      description,
      price,
      period: listingForm.period,
      category: listingForm.category,
      city: listingForm.city,
      district: listingForm.district || 'Mərkəz',
      address: `${listingForm.district || 'Mərkəz'} küç., ${listingForm.city}`,
      rooms: Number(listingForm.rooms),
      floor: Number(listingForm.floor),
      area: Number(listingForm.area),
      amenities: ['Wi‑Fi', 'Parkinq'].filter((item) => item),
      images: [
        listingForm.imageUrl || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt: new Date().toISOString(),
      isVIP: true,
      location: {
        city: listingForm.city,
        district: listingForm.district || 'Mərkəz',
        address: `${listingForm.district || 'Mərkəz'} küç., ${listingForm.city}`,
      },
    }

    setListings((prev) => [nextListing, ...prev])
    setListingForm({ ...emptyListing })
    setIsModalOpen(false)
    setSuccess('Yeni elan uğurla əlavə edildi.')
    setError('')
  }

  const filteredListings = useMemo(() => {
    const phrase = filters.search.trim().toLowerCase()
    const minPrice = Number(filters.minPrice) || 0
    const maxPrice = Number(filters.maxPrice) || Number.POSITIVE_INFINITY

    return listings.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.city,
        item.district,
        item.address,
        item.location?.district,
        item.location?.address,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch = !phrase || haystack.includes(phrase)
      const matchesCity = !filters.city || item.city === filters.city
      const matchesDistrict = !filters.district || item.district === filters.district
      const matchesPeriod = filters.period === 'all' || item.period === filters.period
      const matchesMinPrice = item.price >= minPrice
      const matchesMaxPrice = item.price <= maxPrice
      const matchesRooms = filters.rooms === 'all' || item.rooms >= Number(filters.rooms)
      const matchesFloor = filters.floor === 'all' || item.floor <= Number(filters.floor)
      const matchesArea = filters.area === 'all' || item.area >= Number(filters.area)
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity) => item.amenities.includes(amenity))

      return (
        matchesSearch &&
        matchesCity &&
        matchesDistrict &&
        matchesPeriod &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRooms &&
        matchesFloor &&
        matchesArea &&
        matchesAmenities
      )
    })
  }, [filters, listings])

  if (currentView === 'login' || currentView === 'register') {
    const isLogin = currentView === 'login'

    return (
      <div className="page-shell auth-page-shell">
        <header className="topbar container">
          <div className="brand-wrap">
            <div className="brand-mark">K</div>
            <div>
              <div className="brand-name">Kire</div>
              <div className="brand-sub">Smart rental</div>
            </div>
          </div>

          <div className="nav-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setCurrentView('home')}>Ana səhifə</button>
            <button type="button" className="btn btn-primary" onClick={() => setCurrentView(isLogin ? 'register' : 'login')}>
              {isLogin ? 'Qeydiyyat' : 'Giriş'}
            </button>
          </div>
        </header>

        <main className="auth-shell container">
          <div className="auth-card">
            <div className="auth-topbar">
              <span className="eyebrow">Hesab</span>
              <h1>{isLogin ? 'Giriş' : 'Qeydiyyat'}</h1>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="form-box auth-form">
                <label>
                  Email və ya telefon
                  <input name="identifier" value={loginForm.identifier} onChange={handleAuthChange(setLoginForm)} placeholder="safaraliyevziya@gmail.com" />
                </label>
                <label>
                  Şifrə
                  <input type="password" name="password" value={loginForm.password} onChange={handleAuthChange(setLoginForm)} placeholder="••••••••" />
                </label>
                <button type="submit" className="btn btn-primary" disabled={loading}>Giriş et</button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="form-box auth-form">
                <label>
                  Ad soyad
                  <input name="fullName" value={authForm.fullName} onChange={handleAuthChange(setAuthForm)} />
                </label>
                <label>
                  Email
                  <input type="email" name="email" value={authForm.email} onChange={handleAuthChange(setAuthForm)} />
                </label>
                <label>
                  Telefon
                  <input name="phone" value={authForm.phone} onChange={handleAuthChange(setAuthForm)} placeholder="+99450..." />
                </label>
                <label>
                  Şifrə
                  <input type="password" name="password" value={authForm.password} onChange={handleAuthChange(setAuthForm)} />
                </label>
                <button type="submit" className="btn btn-secondary" disabled={loading}>Qeydiyyatdan keç</button>
              </form>
            )}

            {(error || success) && (
              <div className="status-message auth-message">
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <header className="topbar container">
        <div className="brand-wrap">
          <div className="brand-mark">K</div>
          <div>
            <div className="brand-name">Kire</div>
            <div className="brand-sub">Smart rental</div>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#explore">Axtarış</a>
          <a href="#categories">Kateqoriyalar</a>
          <a href="#how-it-works">Necə işləyir</a>
          <a href="#dashboard">Admin</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-badge">{user.fullName}</span>
              <button type="button" className="btn btn-ghost" onClick={clearAuthState}>Çıxış</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setCurrentView('login')}>Giriş</button>
              <button type="button" className="btn btn-primary" onClick={() => setCurrentView('register')}>Qeydiyyat</button>
            </>
          )}
          <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Yeni Elan</button>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">Müasir kirayə platforması</span>
            <h1>İstədiyin ev və ofisi daha tez tap.</h1>
            <p>
              Kire ilə ev, ofis və yaşayış sahələri axtarışını asanlaşdırır, kirayəçi və sahibə
              arasında etibarlı əlaqə qurur.
            </p>

            <div className="cta-row">
              <button type="button" className="btn btn-primary large">Əmlak tap</button>
              <button type="button" className="btn btn-secondary large" onClick={() => setIsModalOpen(true)}>Kirayə ver</button>
            </div>

            <ul className="trust-list">
              <li>⭐ 4.9/5 orta qiymət</li>
              <li>🔒 Güvənli ödəniş və doğrulama</li>
            </ul>
          </div>

          <div className="hero-panel" aria-label="Rental search panel">
            <div className="panel-header">
              <span className="status-dot"></span>
              Aktiv axtarış
            </div>

            <form className="search-box" onSubmit={(event) => event.preventDefault()}>
              <label>
                <span>Axtarış</span>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                  placeholder="Mənzil, ofis, ev..."
                />
              </label>

              <label>
                <span>Şəhər</span>
                <select name="city" value={filters.city} onChange={handleFiltersChange}>
                  <option value="Bakı">Bakı</option>
                  <option value="Gəncə">Gəncə</option>
                  <option value="Sumqayıt">Sumqayıt</option>
                </select>
              </label>

              <label>
                <span>Kategoriya</span>
                <select name="category" value={searchForm.category} onChange={handleAuthChange(setSearchForm)}>
                  <option value="">Hamısı</option>
                  <option value="apartment">Mənzil</option>
                  <option value="office">Ofis</option>
                  <option value="villa">Villa</option>
                  <option value="room">Otaq</option>
                </select>
              </label>

              <button type="button" className="btn btn-primary" onClick={() => setFilters(defaultFilters)}>Filtri sıfırla</button>
            </form>
          </div>
        </section>

        <section className="stats container" aria-label="Platform statistics">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section id="categories" className="categories container">
          <div className="section-heading">
            <span className="eyebrow">Kateqoriyalar</span>
            <h2>Kirayə üçün lazım olan hər şey burada</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article className="category-card" key={category.title}>
                <div className="category-icon">{category.emoji}</div>
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="explore" className="featured container">
          <div className="section-heading inline">
            <div>
              <span className="eyebrow">Tövsiyə olunan elanlar</span>
              <h2>Bu həftə ən çox baxılanlar</h2>
            </div>
          </div>

          <div className="listing-tools">
            <div className="filter-panel">
              <div className="filter-row">
                <label>
                  <span>Kirayə tipi</span>
                  <select name="period" value={filters.period} onChange={handleFiltersChange}>
                    <option value="all">Hamısı</option>
                    <option value="daily">Günlük</option>
                    <option value="monthly">Aylıq</option>
                  </select>
                </label>

                <label>
                  <span>Min qiymət</span>
                  <input name="minPrice" type="number" value={filters.minPrice} onChange={handleFiltersChange} placeholder="0" />
                </label>

                <label>
                  <span>Max qiymət</span>
                  <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFiltersChange} placeholder="5000" />
                </label>
              </div>

              <div className="filter-row">
                <label>
                  <span>Otaq sayı</span>
                  <select name="rooms" value={filters.rooms} onChange={handleFiltersChange}>
                    <option value="all">Hamısı</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </label>

                <label>
                  <span>Kateqoriya</span>
                  <select name="category" value={searchForm.category} onChange={handleAuthChange(setSearchForm)}>
                    <option value="">Hamısı</option>
                    <option value="apartment">Mənzil</option>
                    <option value="villa">Villa</option>
                    <option value="office">Ofis</option>
                    <option value="house">Ev</option>
                  </select>
                </label>

                <label>
                  <span>Rayon</span>
                  <input name="district" value={filters.district} onChange={handleFiltersChange} placeholder="Nəsimi" />
                </label>
              </div>

              <div className="filter-row">
                <label>
                  <span>Floor</span>
                  <select name="floor" value={filters.floor} onChange={handleFiltersChange}>
                    <option value="all">Hamısı</option>
                    <option value="3">3-dən aşağı</option>
                    <option value="5">5-dən aşağı</option>
                    <option value="10">10-dən aşağı</option>
                  </select>
                </label>

                <label>
                  <span>Area (m²)</span>
                  <select name="area" value={filters.area} onChange={handleFiltersChange}>
                    <option value="all">Hamısı</option>
                    <option value="50">50m² +</option>
                    <option value="80">80m² +</option>
                    <option value="120">120m² +</option>
                  </select>
                </label>
              </div>

              <div className="amenities-row">
                {amenityOptions.map((amenity) => (
                  <label key={amenity} className="checkbox-pill">
                    <input type="checkbox" name="amenity" value={amenity} checked={filters.amenities.includes(amenity)} onChange={handleFiltersChange} />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="listing-grid">
            {isLoadingListings ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div className="listing-skeleton" key={`skeleton-${index}`} />
              ))
            ) : filteredListings.length === 0 ? (
              <div className="empty-state-card">
                <h3>Heç bir nəticə tapılmadı</h3>
                <p>Axtarış parametrlərini dəyişdirərək daha çox elan görmək üçün yenidən yoxlayın.</p>
              </div>
            ) : (
              filteredListings.map((listing) => (
                <article className="listing-card" key={listing.id || listing.title}>
                  <div className="listing-image-wrap">
                    <img src={listing.images?.[0]} alt={listing.title} loading="lazy" className="listing-image" />
                    <span className="listing-badge">{listing.period === 'daily' ? 'Günlük' : 'Aylıq'}</span>
                    {listing.isVIP && <span className="vip-badge">VIP</span>}
                  </div>
                  <div className="listing-body">
                    <div className="listing-head">
                      <h3>{listing.title}</h3>
                      <span className="listing-price">₼ {Number(listing.price).toLocaleString()}</span>
                    </div>
                    <p className="location">{listing.location?.district || listing.district || 'Bakı'} • {listing.location?.city || listing.city}</p>
                    <p className="meta">{listing.rooms} otaq • {listing.area} m² • {listing.floor}. mərtəbə</p>
                    <p className="description">{listing.description}</p>
                    <div className="amenity-list">
                      {listing.amenities.slice(0, 3).map((item) => (
                        <span key={`${listing.id}-${item}`}>{item}</span>
                      ))}
                    </div>
                    <div className="listing-footer">
                      <span>{listing.address || listing.location?.address}</span>
                      <button type="button" className="btn btn-primary small">Ətraflı</button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section id="how-it-works" className="process container">
          <div className="section-heading center-text">
            <span className="eyebrow">Necə işləyir</span>
            <h2>3 addımda kirayə prosesini başa çatdırın</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="support" className="cta-panel container">
          <div>
            <span className="eyebrow">Başlamaq üçün hazırıq</span>
            <h2>Kirayə axtarışını və ya elan yerləşdirməyi indi başlat.</h2>
          </div>
          <button type="button" className="btn btn-primary large" onClick={() => setIsModalOpen(true)}>Başla</button>
        </section>
      </main>

      <footer className="footer container">
        <div className="brand-wrap">
          <div className="brand-mark">K</div>
          <div>
            <div className="brand-name">Kire</div>
            <div className="brand-sub">Smart rental</div>
          </div>
        </div>

        <div className="footer-links">
          <a href="#">Haqqımızda</a>
          <a href="#">Müqavilə</a>
          <a href="#">Əlaqə</a>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">Yeni elan</span>
                <h3>Kirayə obyektini əlavə et</h3>
              </div>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form className="form-box listing-form" onSubmit={handleCreateListing}>
              <div className="two-col-grid">
                <label>
                  Başlıq
                  <input name="title" value={listingForm.title} onChange={handleAuthChange(setListingForm)} placeholder="Modern 2+1 mənzil" />
                </label>

                <label>
                  Kateqoriya
                  <select name="category" value={listingForm.category} onChange={handleAuthChange(setListingForm)}>
                    <option value="apartment">Mənzil</option>
                    <option value="villa">Villa</option>
                    <option value="office">Ofis</option>
                    <option value="house">Ev</option>
                  </select>
                </label>
              </div>

              <div className="two-col-grid">
                <label>
                  Qiymət (AZN)
                  <input name="price" type="number" value={listingForm.price} onChange={handleAuthChange(setListingForm)} placeholder="1500" />
                </label>

                <label>
                  Kirayə müddəti
                  <select name="period" value={listingForm.period} onChange={handleAuthChange(setListingForm)}>
                    <option value="monthly">Aylıq</option>
                    <option value="daily">Günlük</option>
                  </select>
                </label>
              </div>

              <div className="two-col-grid">
                <label>
                  Şəhər
                  <input name="city" value={listingForm.city} onChange={handleAuthChange(setListingForm)} />
                </label>

                <label>
                  Rayon
                  <input name="district" value={listingForm.district} onChange={handleAuthChange(setListingForm)} placeholder="Nəsimi" />
                </label>
              </div>

              <div className="two-col-grid">
                <label>
                  Otaq sayı
                  <input name="rooms" type="number" min="1" value={listingForm.rooms} onChange={handleAuthChange(setListingForm)} />
                </label>

                <label>
                  Mərtəbə
                  <input name="floor" type="number" min="1" value={listingForm.floor} onChange={handleAuthChange(setListingForm)} />
                </label>
              </div>

              <div className="two-col-grid">
                <label>
                  Sahə (m²)
                  <input name="area" type="number" min="10" value={listingForm.area} onChange={handleAuthChange(setListingForm)} />
                </label>

                <label>
                  Şəkil URL
                  <input name="imageUrl" value={listingForm.imageUrl} onChange={handleAuthChange(setListingForm)} placeholder="https://..." />
                </label>
              </div>

              <label>
                Təsvir
                <textarea name="description" rows="4" value={listingForm.description} onChange={handleAuthChange(setListingForm)} placeholder="Obyekt haqqında ətraflı məlumat..." />
              </label>

              {(error || success) && (
                <div className="status-message">
                  {error && <p className="error">{error}</p>}
                  {success && <p className="success">{success}</p>}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Ləğv et</button>
                <button type="submit" className="btn btn-primary">Elan yerləşdir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
