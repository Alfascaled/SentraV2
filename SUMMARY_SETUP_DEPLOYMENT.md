# Rangkuman Status Proyek, Rencana Aksi, dan Strategi Deployment SentraV2

Dokumen ini merangkum hasil audit status proyek, langkah-langkah tindak lanjut untuk development lokal, serta analisis arsitektur deployment (Frontend di Vercel dan Backend di Hostinger).

---

## 1. Status Audit Proyek Saat Ini (Apa yang Belum Terinstall / Tersetup)

Berdasarkan pengecekan sistem dan repositori pada kondisi saat ini:

### A. Environment & Sistem (Windows / PowerShell)
- **PowerShell Execution Policy Masih Restricted**:
  - Script `.ps1` diblokir secara default.
  - Perintah `npm` dan `yarn` gagal jika dipanggil langsung tanpa `.cmd` (harus menggunakan `npm.cmd` / `yarn.cmd` atau mengubah policy dengan `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`).

### B. Database (MySQL & `db.sql`)
- **Service MySQL**: Service MySQL (port 3306 via XAMPP) sudah terdeteksi aktif.
- **Database `sentra_cendekia` Belum Dibuat**: Database tersebut belum ada di MySQL.
- **File `db.sql` Belum Di-import**: Schema dan seed data (tabel `admins`, `settings`, `programs`, `facilities`, `testimonials`, `tutors`, `faq`, `registrations`) belum dimasukkan ke database.

### C. Backend Laravel (`backend/`)
- **`APP_KEY` Kosong**: File `backend/.env` memiliki `APP_KEY=` kosong (`php artisan key:generate` belum dijalankan).
- **Konfigurasi Database `.env` Masih SQLite**: Secara default masih `DB_CONNECTION=sqlite`, sedangkan driver SQLite PHP lokal belum aktif dan proyek menggunakan MySQL.
- **Symlink Storage Belum Dibuat**: Folder `backend/public/storage` belum ada (`php artisan storage:link` belum dieksekusi).
- **Node Modules Backend Belum Terinstall**: Folder `backend/node_modules` belum ada (untuk Vite/Tailwind backend).
- **CORS Belum Dikonfigurasi**: Belum ada pengaturan CORS untuk mengizinkan request dari frontend React (`http://localhost:3000`).

### D. Implementasi Kode API Backend
- **Route API Masih Kosong**: File `backend/routes/api.php` baru berisi default bawaan `Route::get('/user')`.
- **Kebutuhan Endpoint Frontend yang Belum Tersedia**:
  - **Auth**: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `POST /api/auth/change-password`
  - **Settings**: `GET /api/settings`, `PUT /api/settings`
  - **Admin & Dashboard**: `GET /api/admin/summary`, `GET /api/admin/whatsapp`, `PUT /api/admin/whatsapp`
  - **Pendaftaran**: `GET /api/registrations`, `POST /api/registrations`, `PATCH /api/registrations/{id}`, `DELETE /api/registrations/{id}`
  - **Upload Berkas**: `POST /api/upload` (multipart/form-data)
  - **CRUD Modul**: `GET/POST/PUT/DELETE` untuk `/api/programs`, `/api/facilities`, `/api/testimonials`, `/api/tutors`, `/api/faq`
- **Model & Controller**: Model Eloquent dan Controller penangan endpoint di atas belum diimplementasikan di `backend/app/Models` dan `backend/app/Http/Controllers`.

### E. Frontend React (`frontend/`)
- Dependensi sudah ada di `frontend/node_modules`.
- File `.env` sudah mengarah ke `REACT_APP_BACKEND_URL=http://localhost:8000`.

### F. Status Server Development
- Laravel server (`php artisan serve` di port 8000) belum berjalan.
- React server (`yarn start` di port 3000) belum berjalan.

---

## 2. Langkah-Langkah Berikutnya (Next Steps) untuk Lokal

### Tahap 1: Setup Database & Konfigurasi Dasar
1. Buat database `sentra_cendekia` di MySQL (bisa via phpMyAdmin di `http://localhost/phpmyadmin` atau CLI).
2. Import file `db.sql` ke dalam database `sentra_cendekia`.
3. Sesuaikan `backend/.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sentra_cendekia
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Jalankan perintah di terminal:
   ```powershell
   cd backend
   php artisan key:generate
   php artisan storage:link
   ```

### Tahap 2: Implementasi Backend Laravel
1. Buat Model Eloquent di `backend/app/Models` (`Admin`, `Setting`, `Program`, `Facility`, `Testimonial`, `Tutor`, `Faq`, `Registration`).
2. Buat Controller penangan auth (Sanctum), CRUD settings, modul, pendaftaran, dan upload file.
3. Daftarkan endpoint di `backend/routes/api.php`.
4. Konfigurasikan CORS agar mengizinkan `http://localhost:3000`.

### Tahap 3: Menjalankan & Pengujian
1. Atur execution policy (sekali saja jika diperlukan):
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
2. Jalankan backend:
   ```powershell
   cd backend
   php artisan serve
   ```
3. Jalankan frontend di terminal terpisah:
   ```powershell
   cd frontend
   yarn start
   ```
4. Buka browser:
   - Halaman Publik: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

---

## 3. Strategi Deployment: Backend di Hostinger & Frontend di Vercel

### A. Kelayakan & Alasan Keamanan
Arsitektur terpisah (*Decoupled / Headless*) ini **sangat memungkinkan, populer, dan memiliki keunggulan keamanan**:
1. **Isolasi Database**: Database MySQL di Hostinger cukup diakses secara lokal (`localhost`), port 3306 tidak perlu dibuka ke internet publik.
2. **Perlindungan Terhadap DDoS**: Vercel bertindak sebagai CDN edge global yang menyerap lonjakan traffic/DDoS sebelum membebani server Hostinger.
3. **Pemisahan Kredensial**: File `.env` backend dan logic bisnis tidak pernah tersimpan di sisi klien/frontend.

### B. Pengaturan Domain (Kasus Domain `sentracendekia.id` di Hostinger)
Karena domain `sentracendekia.id` sudah berada di Hostinger, pengaturannya justru sangat mudah melalui **DNS Zone Editor Hostinger**:

| Komponen | Alamat Domain / URL | Lokasi Hosting | Konfigurasi DNS di Hostinger |
| :--- | :--- | :--- | :--- |
| **Frontend** | `sentracendekia.id` & `www.sentracendekia.id` | Vercel | Record `A` (`@`) diarahkan ke IP Vercel (`76.76.21.21`), Record `CNAME` (`www`) ke `cname.vercel-dns.com` |
| **Backend API** | `api.sentracendekia.id` | Hostinger | Buat Subdomain `api` di hPanel Hostinger, arahkan document root ke folder `backend/public` |
| **Email Domain** | `@sentracendekia.id` | Hostinger | **Tidak berubah/tidak terganggu** karena MX Record tetap mengarah ke server email Hostinger |

### C. Hal Wajib Diperhatikan untuk Skema Ini
1. **HTTPS / SSL di Kedua Sisi**:
   - Vercel otomatis HTTPS.
   - Subdomain backend (`api.sentracendekia.id`) di Hostinger **wajib dipasang SSL aktif**, untuk mencegah error *Mixed Content* di browser.
2. **Keamanan CORS di Laravel**:
   - Atur `allowed_origins` di Laravel secara ketat hanya ke `https://sentracendekia.id` dan `https://*.vercel.app`. Jangan gunakan wildcard `*`.
3. **Rate Limiting**:
   - Terapkan rate limiter pada endpoint publik seperti `/api/auth/login` (cegah brute force) dan `/api/registrations` (cegah spam form).
4. **URL Penyimpanan File Upload**:
   - Pastikan endpoint upload menghasilkan URL absolut publik (misal: `https://api.sentracendekia.id/storage/...`).

### D. Opsi Alternatif (Semua di Hostinger)
- Frontend di-build (`yarn build`), file statis dimasukkan ke Hostinger bersama backend.
- **Kelebihan**: Satu tempat pengelolaan, tidak perlu konfigurasi CORS antar domain.
- **Kekurangan**: Tidak mendapatkan keuntungan Edge CDN global gratis dari Vercel.
