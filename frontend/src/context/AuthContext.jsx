import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Yaddaşdan mövcud istifadəçini oxu
    try {
      const savedUser = localStorage.getItem('multirent_current_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, []);

  // Giriş funksiyası (Sırf Lokal)
  const login = (identifier, password) => {
    setError('')
    const cleanId = (identifier || '').trim().toLowerCase()
    console.log('Login Attempt:', cleanId)

    // 2. Qeydiyyatdan keçmiş istifadəçiləri yoxla
    const users = JSON.parse(localStorage.getItem('multirent_users') || '[]')
    console.log('Users in LocalStorage:', users)

    if (!cleanId) {
      setError('E-poçt və ya telefon tələb olunur')
      return { success: false, error: 'E-poçt və ya telefon tələb olunur' }
    }

    // 1. Xüsusi Admin Girişi (keçid üçün xüsusi e-poçt)
    if (cleanId === 'safaraliyevziya@gmail.com') {
      const adminUser = {
        id: 'admin-1',
        name: 'Ziya',
        surname: 'Səfərəliyev',
        email: 'safaraliyevziya@gmail.com',
        role: 'admin',
      }
      setUser(adminUser)
      // immediately persist
      localStorage.setItem('multirent_current_user', JSON.stringify(adminUser))
      return { success: true }
    }

    const foundUser = users.find((u) => {
      const ue = (u?.email || '').trim().toLowerCase()
      const up = (u?.phone || '').trim()
      return ue === cleanId || up === (identifier || '').trim()
    })

    if (!foundUser) {
      setError('Bu e-poçt və ya telefon nömrəsi ilə istifadəçi tapılmadı!')
      return { success: false, error: 'İstifadəçi tapılmadı' }
    }

    if ((foundUser.password || '') !== (password || '')) {
      setError('Daxil edilən şifrə yanlışdır!')
      return { success: false, error: 'Yanlış şifrə' }
    }

    setUser(foundUser)
    // immediately persist updated current user
    try {
      localStorage.setItem('multirent_current_user', JSON.stringify(foundUser))
    } catch (e) {
      console.warn('Failed to persist current user', e)
    }

    return { success: true }
  };

  // Qeydiyyat funksiyası
  const register = (userData) => {
    setError('');
    const users = JSON.parse(localStorage.getItem('multirent_users') || '[]');

    const email = (userData?.email || '').trim().toLowerCase()
    const phone = (userData?.phone || '').trim()

    const exists = users.some((u) => (u.email || '').trim().toLowerCase() === email)
    if (exists) {
      setError('Bu e-poçt ünvanı artıq qeydiyyatdan keçib!')
      return { success: false }
    }

    const role = email === 'safaraliyevziya@gmail.com' ? 'admin' : 'user'
    const newUser = {
      id: Date.now().toString(),
      name: (userData?.name || '').trim(),
      surname: (userData?.surname || '').trim(),
      fullName: `${(userData?.name || '').trim()} ${(userData?.surname || '').trim()}`.trim(),
      email,
      phone,
      password: userData?.password || '',
      role,
    }

    users.push(newUser)
    localStorage.setItem('multirent_users', JSON.stringify(users))
    // Auto-login new user
    setUser(newUser)
    localStorage.setItem('multirent_current_user', JSON.stringify(newUser))
    return { success: true }
  };

  // Nümunə Qısayol Düymələri üçün (Tək tıkla giriş)
  const loginAsAdmin = () => {
    login('safaraliyevziya@gmail.com', 'admin123');
  };

  const loginAsDemoUser = () => {
    const demoUser = { id: 'demo-1', name: 'Demo', surname: 'İstifadəçi', email: 'user@multirent.az', role: 'user' };
    setUser(demoUser);
    localStorage.setItem('multirent_current_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('multirent_current_user');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loginAsAdmin, loginAsDemoUser, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext
