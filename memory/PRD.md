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
- Auth: POST /api/auth/login, /logout; GET /api/auth/me

## Implemented (13 Sep 2026)
- Landing: Navbar (glass, putih), Hero (masked line reveal, parallax, 3D tilt), Stats bar, Marquee, Program bento grid, Tentang Kami (numbered manifesto), Pengajar, Paket (Terpopuler badge), FAQ accordion, Form pendaftaran → WhatsApp, Footer
- Admin: login, dashboard ringkasan, Pengaturan Situs (hero, tentang, stats, poin, kontak), CRUD Program/Pengajar/Paket/FAQ, daftar Pendaftaran (status & hapus), logout
- Testing: iteration_1 — 13/13 backend, semua alur frontend lulus

## Backlog
- P1: Upload gambar (object storage) untuk logo/foto tutor (saat ini URL)
- P1: Testimoni orang tua (section + CRUD)
- P2: Ganti password admin dari panel
- P2: Notifikasi email/WA saat pendaftaran baru
- P2: Halaman detail program / blog
