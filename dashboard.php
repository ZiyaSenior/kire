<?php
$baseUrl = 'http://localhost:8000';
?>
<!DOCTYPE html>
<html lang="az">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kire Dashboard</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #eef4ff, #f7f8ff);
        color: #111827;
      }
      .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 48px 20px;
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        border-radius: 20px;
        padding: 16px 22px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }
      .brand {
        font-weight: 800;
        font-size: 1.5rem;
      }
      .actions {
        display: flex;
        gap: 12px;
      }
      .btn {
        display: inline-block;
        padding: 12px 20px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
        transition: 0.2s ease;
      }
      .btn-primary {
        background: linear-gradient(135deg, #2563eb, #5b4ae2);
        color: white;
      }
      .btn-secondary {
        background: #f3f4f6;
        color: #111827;
      }
      .hero {
        margin-top: 32px;
        background: #0f172a;
        color: #fff;
        border-radius: 24px;
        padding: 42px 32px;
      }
      .hero h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 3.2rem);
      }
      .hero p {
        margin: 0;
        color: #dbeafe;
        line-height: 1.7;
        max-width: 700px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        margin-top: 32px;
      }
      .card {
        background: #fff;
        border-radius: 20px;
        padding: 22px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
      }
      .card h3 {
        margin-top: 0;
      }
      .card p {
        color: #475569;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header class="topbar">
        <div class="brand">Kire</div>
        <div class="actions">
          <a class="btn btn-secondary" href="./login.php">Login</a>
          <a class="btn btn-primary" href="./register.php">Register</a>
        </div>
      </header>

      <section class="hero">
        <h1>İstədiyin kirayə və ya evini tap.</h1>
        <p>
          Bu dashboard ilə istifadəçi giriş və qeydiyyat prosesləri ayrı səhifələrdə işləyir.
          Login və Register butonları müvafiq PHP səhifələrinə yönləndirilir.
        </p>
      </section>

      <section class="grid">
        <article class="card">
          <h3>Giriş</h3>
          <p>Hazır hesabla daxil ol və əmlak axtarışını başlat.</p>
          <a class="btn btn-primary" href="./login.php">Daxil ol</a>
        </article>
        <article class="card">
          <h3>Qeydiyyat</h3>
          <p>Yeni hesab yarat və öz elanlarını yerləşdir.</p>
          <a class="btn btn-secondary" href="./register.php">Qeydiyyatdan keç</a>
        </article>
        <article class="card">
          <h3>Admin</h3>
          <p>Admin istifadəçisi elan yaratmaq üçün giriş edin.</p>
          <a class="btn btn-primary" href="./login.php">Admin login</a>
        </article>
      </section>
    </div>
  </body>
</html>
