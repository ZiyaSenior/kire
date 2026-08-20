# Yaddas — Kire layihəsi üçün iş qeydləri

## 1) Layihəni necə işə salmaq olar

### Backend
cd /home/12807@holbertonstudents.com/kire
export PATH="$HOME/.local/node/bin:$PATH"
npm start

### Frontend
cd /home/12807@holbertonstudents.com/kire/frontend
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev -- --host 0.0.0.0 --port 5176

Not: Əgər 5176 məşğul olsa, Vite avtomatik olaraq növbəti boş portu seçir. Bu səbəbdən frontend linki bəzən 5177, 5178 və s. ola bilər.

## 2) Live linklər
- Backend: http://localhost:5000
- Frontend: http://localhost:5178 (və ya Vite-in seçdiyi növbəti port)

## 3) Əhəmiyyətli məlumatlar
- Proyektin kök qovluğu: /home/12807@holbertonstudents.com/kire
- Hər npm əmri əvvəlində Node yolunu export etmək vacibdir:
  export PATH="$HOME/.local/node/bin:$PATH"
- Backend Express + JSON-backed auth sistemi ilə işləyir.
- Frontend React + Vite ilə işləyir.
- Keçmiş problem: bəzi elanlarda tags və metadata yox idi; app crash edirdi.
- Düzəliş: render etmədən əvvəl verilənləri normalize etmək.

## 4) GitHub repozitoriyası
- Repo: https://github.com/ZiyaSenior/kire.git
- Branch: main

## 5) Push etmək üçün standart komanda
cd /home/12807@holbertonstudents.com/kire
git add .
git commit -m "Update project notes"
git push origin main

## 6) Hazır vəziyyət
- Backend işləyir.
- Frontend işləyir.
- Proyekt GitHub-a yüklənib.
- Bu sənəd hər dəfə qaldığınız yerdən davam etmək üçün əsas referans olacaq.

## 7) Növbəti dəfə başlamaq üçün qısa xülasə
1. Backend-i aç.
2. Frontend-i aç.
3. Browserda localhost linkini aç.
4. Dəyişikliklərdə bu faylı yenilə.
5. GitHub-a push et.

## 8) 2026-08-20 son vəziyyət
- İş qovluğu Windows-da: `C:\Users\DELL\kire`
- Frontend qovluğu: `C:\Users\DELL\kire\frontend`
- Frontend localhost: http://127.0.0.1:5173/
- Frontend Vite development server-i işləyir: `npm run dev -- --host 127.0.0.1`
- `AuthContext.jsx` daxilində `login(identifier, password)` iki arqument gözləyir.
- Əvvəlki xəta: `identifier` obyekt kimi ötürüldüyünə görə `(identifier || '').trim is not a function` xətası yaranırdı.
- Düzəliş: `frontend/src/App.tsx` daxilində çağırış `login(authForm.identifier, authForm.password)` formasına salındı.
- Yoxlama: `Push-Location .\kire\frontend; npm run build; Pop-Location` uğurla tamamlandı.
- Davam etmək üçün PowerShell:
  `Set-Location C:\Users\DELL\kire\frontend`
  `npm run dev -- --host 127.0.0.1`
- Repo branch-i: `main`
- Repo: https://github.com/ZiyaSenior/kire.git
