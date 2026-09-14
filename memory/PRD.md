# Sentra Cendekia — PRD

## Problem Statement (original)
Website lembaga les privat "Sentra Cendekia" dengan bagian Program, Tentang Kami, Pengajar, Paket (2x/4x/6x/8x pertemuan), FAQ, dan halaman Admin untuk mengedit/menghapus konten tanpa hardcode. Referensi UI: hero navy + CTA oranye; logo Sentra Cendekia (gradasi oranye-emas); palet #fae903, #ff6300, #172B4D, #5BC0EB.

## User Choices
- Auth admin: JWT email/password
- CTA: WhatsApp + form pendaftaran tersimpan di DB
- Harga paket: Rp 200.000 – 1.800.000 (2x 200k, 4x 750k, 6x 1.25jt, 8x 1.8jt — editable)
- Visual edit (13 Sep 2026): navbar putih + logo lebih besar; hero latar putih dengan teks gelap

## Architecture
- Backend: FastAPI + MongoDB (motor). `server.py` (auth, generic CRUD factory, settings, registrations, admin summary, seeding), `seed_data.py`.
- Frontend: React 19, Tailwind, shadcn/ui, framer-motion, lenis. Fonts: Playfair Display + Plus Jakarta Sans.
- Auth: bcrypt + PyJWT; token via httpOnly cookie + Bearer (localStorage `sc_admin_token`). Brute-force lockout 5x/15 menit.

## API
- Public: GET /api/content, /api/settings, /api/{programs|tutors|packages|faqs}; POST /api/registrations
- Admin: POST/PUT/DELETE /api/{programs|tutors|packages|faqs}; PUT /api/settings; GET/PATCH/DELETE /api/registrations; GET /api/admin/summary
- Auth: POST /api/auth/login, /logout; GET /api/auth/me; POST /api/auth/change-password
- Admin config: GET/PUT /api/admin/whatsapp (nomor WA admin untuk notifikasi)
- Upload: POST /api/upload (admin, object storage, max 5MB, jpg/png/webp/gif/svg) → {url}; GET /api/files/{path} (publik, serve gambar)

## Implemented (13 Sep 2026)
- Landing: Navbar (glass, putih), Hero (masked line reveal, parallax, 3D tilt), Stats bar, Marquee, Program bento grid, Tentang Kami (numbered manifesto), Pengajar, Paket (Terpopuler badge), FAQ accordion, Form pendaftaran → WhatsApp, Footer
- Admin: login, dashboard ringkasan, Pengaturan Situs (hero, tentang, stats, poin, kontak), CRUD Program/Pengajar/Paket/FAQ, daftar Pendaftaran (status & hapus), logout
- Testing: iteration_1 — 13/13 backend, semua alur frontend lulus

## Implemented (14 Sep 2026)
- Ganti Password admin dari panel (halaman /admin/account, verifikasi password lama, min 6 char, harus beda)
- Upload Gambar via panel (Emergent object storage) — tombol "Unggah Gambar" di semua field image (logo, hero, tentang, foto pengajar); tetap bisa tempel URL
- Dashboard admin: latar diubah menjadi putih (sebelumnya #F8FAFC)
- Nomor WhatsApp Admin: field & simpan di halaman /admin/account (disimpan di settings.admin_whatsapp, disanitasi ke digit) — nav "Akun & WhatsApp"
- Diverifikasi: curl backend (upload/serve 200, change-password validasi, GET/PUT admin/whatsapp) + e2e screenshot UI

## Implemented (14 Sep 2026 — batch 2)
- Chat Cepat Pendaftar: tombol "Balas" (WhatsApp hijau) di tiap baris Pendaftaran → wa.me + pesan sapaan otomatis (nama/program/paket)
- Hilangkan running teks (marquee): komponen Marquee.js dihapus, referensi di Home.js & field marquee_text di SettingsPage dibuang (field model backend tetap, harmless)
- Perketat keamanan kredensial admin:
  - Kebijakan password baru: min 8 karakter + wajib huruf & angka (validasi backend + klien)
  - Seed startup TIDAK lagi menimpa password jika admin sudah mengubahnya (flag users.password_custom=true) → menutup celah password .env default tetap valid
- Diverifikasi: curl (3 kasus validasi ditolak benar) + e2e screenshot (marquee hilang, tombol Balas + href wa.me benar)

## Backlog
- P1: Notifikasi WhatsApp OTOMATIS saat pendaftaran baru — MENUNGGU pilihan provider user (Twilio/Meta Cloud API + kredensial). Nomor tujuan sudah bisa dikonfigurasi via /admin/whatsapp.
- P1: Testimoni orang tua (section + CRUD)
- P2: Halaman detail program / blog
