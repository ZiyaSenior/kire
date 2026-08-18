<?php
$apiBase = 'http://localhost:5000';
$successMessage = '';
$errorMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['fullName'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($fullName === '' || $email === '' || $password === '') {
        $errorMessage = 'Ad, email və şifrə mütləq daxil edilməlidir.';
    } else {
        $payload = json_encode([
            'fullName' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'password' => $password,
        ]);

        $ch = curl_init($apiBase . '/api/auth/signup');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        if ($httpCode === 201 && !empty($result['success'])) {
            $successMessage = 'Qeydiyyat uğurla tamamlandı.';
            session_start();
            $_SESSION['token'] = $result['token'];
            $_SESSION['user'] = $result['user'];
        } else {
            $errorMessage = $result['message'] ?? 'Qeydiyyat uğursuz oldu.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="az">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kire Register</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #eef4ff, #f7f8ff);
        display: grid;
        place-items: center;
        min-height: 100vh;
      }
      .card {
        width: min(500px, calc(100% - 30px));
        background: #fff;
        border-radius: 20px;
        padding: 30px 24px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      }
      h1 {
        margin: 0 0 20px;
        text-align: center;
      }
      form {
        display: grid;
        gap: 16px;
      }
      label {
        display: grid;
        gap: 8px;
        font-weight: 700;
      }
      input {
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid #d1d5db;
        font-size: 1rem;
      }
      button {
        border: none;
        border-radius: 12px;
        padding: 14px 16px;
        background: linear-gradient(135deg, #2563eb, #5b4ae2);
        color: white;
        font-weight: 800;
        cursor: pointer;
      }
      .msg {
        padding: 12px 14px;
        border-radius: 10px;
        margin-bottom: 16px;
      }
      .error {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }
      .success {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
      }
      .link {
        text-align: center;
        margin-top: 16px;
      }
      .link a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Register</h1>

      <?php if ($errorMessage): ?>
        <div class="msg error"><?php echo htmlspecialchars($errorMessage); ?></div>
      <?php endif; ?>

      <?php if ($successMessage): ?>
        <div class="msg success"><?php echo htmlspecialchars($successMessage); ?></div>
      <?php endif; ?>

      <form method="POST" action="./register.php">
        <label>
          Ad soyad
          <input type="text" name="fullName" placeholder="Ali Memmedov" required />
        </label>

        <label>
          Email
          <input type="email" name="email" placeholder="example@gmail.com" required />
        </label>

        <label>
          Telefon
          <input type="text" name="phone" placeholder="+99450..." />
        </label>

        <label>
          Şifrə
          <input type="password" name="password" placeholder="••••••••" required />
        </label>

        <button type="submit">Qeydiyyatdan keç</button>
      </form>

      <div class="link">
        <a href="./login.php">Artıq hesabınız var? Daxil olun</a>
      </div>
    </div>
  </body>
</html>
