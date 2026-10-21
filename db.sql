-- =============================================================
-- Sentra Cendekia - MySQL Database Schema & Seed
-- Dibuat untuk backend Laravel & Frontend React
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `sentra_cendekia`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `sentra_cendekia`;

-- -----------------------------------------------------------------
-- 1. ADMIN USERS
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `email`          VARCHAR(191) NOT NULL UNIQUE,
    `password`       VARCHAR(255) NOT NULL,
    `admin_whatsapp` VARCHAR(30)  NULL,
    `created_at`     TIMESTAMP NULL DEFAULT NULL,
    `updated_at`     TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 2. SITE SETTINGS (satu baris, key = 'site')
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key`               VARCHAR(50)  NOT NULL UNIQUE DEFAULT 'site',
    `brand_name`        VARCHAR(255) NOT NULL DEFAULT 'Sentra Cendekia',
    `tagline`           VARCHAR(500) NULL,
    `logo_url`          TEXT NULL,
    `hero_badge`        VARCHAR(255) NULL,
    `hero_title`        TEXT NULL,
    `hero_subtitle`     TEXT NULL,
    `hero_image`        TEXT NULL,
    `hero_cta`          VARCHAR(255) NULL,
    `marquee_text`      TEXT NULL,
    `about_eyebrow`     VARCHAR(255) NULL,
    `about_title`       TEXT NULL,
    `about_description` TEXT NULL,
    `about_image`       TEXT NULL,
    `about_points`      JSON NULL,
    `stats`             JSON NULL,
    `whatsapp`          VARCHAR(30)  NULL,
    `whatsapp_message`  TEXT NULL,
    `email`             VARCHAR(191) NULL,
    `instagram`         VARCHAR(100) NULL,
    `address`           TEXT NULL,
    `footer_text`       TEXT NULL,
    `footer_copyright`  TEXT NULL,
    `wa_reply_template` TEXT NULL,
    `created_at`        TIMESTAMP NULL DEFAULT NULL,
    `updated_at`        TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 3. PROGRAMS
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `programs` (
    `id`          CHAR(36) NOT NULL PRIMARY KEY,
    `title`       VARCHAR(255) NOT NULL,
    `level`       VARCHAR(100) NULL,
    `description` TEXT NULL,
    `subjects`    JSON NULL,
    `icon`        VARCHAR(50)  NULL DEFAULT 'book',
    `order`       INT NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 4. TUTORS
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tutors` (
    `id`          CHAR(36) NOT NULL PRIMARY KEY,
    `name`        VARCHAR(255) NOT NULL,
    `subject`     VARCHAR(255) NULL,
    `education`   VARCHAR(255) NULL,
    `photo`       TEXT NULL,
    `bio`         TEXT NULL,
    `order`       INT NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 5. PACKAGES
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `packages` (
    `id`          CHAR(36)     NOT NULL PRIMARY KEY,
    `name`        VARCHAR(255) NOT NULL,
    `sessions`    INT          NOT NULL DEFAULT 4,
    `price`       BIGINT       NOT NULL DEFAULT 0,
    `price_sd`    BIGINT       NOT NULL DEFAULT 0,
    `price_smp`   BIGINT       NOT NULL DEFAULT 0,
    `price_sma`   BIGINT       NOT NULL DEFAULT 0,
    `duration`    VARCHAR(100) NULL,
    `description` TEXT NULL,
    `features`    JSON NULL,
    `popular`     TINYINT(1)   NOT NULL DEFAULT 0,
    `order`       INT          NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 6. FAQS
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faqs` (
    `id`          CHAR(36) NOT NULL PRIMARY KEY,
    `question`    TEXT     NOT NULL,
    `answer`      TEXT NULL,
    `order`       INT      NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 7. REGISTRATIONS (Pendaftaran siswa)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrations` (
    `id`         CHAR(36)     NOT NULL PRIMARY KEY,
    `name`       VARCHAR(255) NOT NULL,
    `phone`      VARCHAR(30)  NOT NULL,
    `level`      VARCHAR(100) NULL,
    `program`    VARCHAR(255) NULL,
    `package`    VARCHAR(255) NULL,
    `message`    TEXT NULL,
    `status`     ENUM('baru','dihubungi') NOT NULL DEFAULT 'baru',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    INDEX `idx_registrations_status`  (`status`),
    INDEX `idx_registrations_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 8. FILE UPLOADS
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `uploads` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `filename`   VARCHAR(255) NOT NULL,
    `original`   VARCHAR(255) NULL,
    `mime_type`  VARCHAR(100) NULL,
    `size`       BIGINT NULL,
    `url`        TEXT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------
-- 9. LARAVEL INFRASTRUCTURE TABLES (Sanctum Tokens, Sessions, Cache)
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id`   BIGINT UNSIGNED NOT NULL,
    `name`           VARCHAR(255) NOT NULL,
    `token`          VARCHAR(64)  NOT NULL UNIQUE,
    `abilities`      TEXT NULL,
    `last_used_at`   TIMESTAMP NULL DEFAULT NULL,
    `expires_at`     TIMESTAMP NULL DEFAULT NULL,
    `created_at`     TIMESTAMP NULL DEFAULT NULL,
    `updated_at`     TIMESTAMP NULL DEFAULT NULL,
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`),
    INDEX `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
    `id`             VARCHAR(255) NOT NULL PRIMARY KEY,
    `user_id`        BIGINT UNSIGNED NULL,
    `ip_address`     VARCHAR(45)  NULL,
    `user_agent`     TEXT NULL,
    `payload`        LONGTEXT NOT NULL,
    `last_activity`  INT NOT NULL,
    INDEX `sessions_user_id_index` (`user_id`),
    INDEX `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cache` (
    `key`        VARCHAR(255) NOT NULL PRIMARY KEY,
    `value`      MEDIUMTEXT NOT NULL,
    `expiration` INT NOT NULL,
    INDEX `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cache_locks` (
    `key`        VARCHAR(255) NOT NULL PRIMARY KEY,
    `owner`      VARCHAR(255) NOT NULL,
    `expiration` INT NOT NULL,
    INDEX `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SEED DATA
-- =============================================================

-- Admin default: email "admin@sentracendekia.id" & password "SentraAdmin2026!"
INSERT INTO `admins` (`id`, `email`, `password`, `admin_whatsapp`, `created_at`, `updated_at`)
VALUES (
    1,
    'admin@sentracendekia.id',
    '$2y$10$6CneMUiZsqCNQ8XP8HiRUOTPJT1cWXJEY9QYrHiSlow5tO4PoVPGu',
    '6281234567890',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `password` = VALUES(`password`),
    `admin_whatsapp` = VALUES(`admin_whatsapp`),
    `updated_at` = NOW();

-- Settings
INSERT INTO `settings` (
    `key`, `brand_name`, `tagline`, `logo_url`, `hero_badge`,
    `hero_title`, `hero_subtitle`, `hero_image`, `hero_cta`, `marquee_text`,
    `about_eyebrow`, `about_title`, `about_description`, `about_image`,
    `about_points`, `stats`, `whatsapp`, `whatsapp_message`, `email`,
    `instagram`, `address`, `footer_text`, `footer_copyright`,
    `wa_reply_template`, `created_at`, `updated_at`
) VALUES (
    'site',
    'Sentra Cendekia',
    'Membina Peradaban Unggul dalam Keilmuwan',
    'https://customer-assets-jai6qajn.emergentagent.net/job_2483318e-813e-451f-b1bd-de222c11db79/artifacts/pamxksi8_logo%20sentra%20hitam.png',
    'Les Privat Terpercaya di Indonesia',
    'Les Privat Guru\nke Rumah Terbaik\n& Terpercaya',
    'Dapatkan layanan les privat berkualitas tinggi langsung di rumah Anda.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    'Daftar Sekarang Yuk',
    'Les Privat SD * SMP * SMA * UTBK * Bahasa Asing * Tutor Datang ke Rumah * Kurikulum Personal',
    'Tentang Kami',
    'Mendidik dengan Hati,\nMeraih Prestasi Tertinggi',
    'Sentra Cendekia lahir dari semangat untuk memberikan solusi belajar yang adaptif dan nyaman.',
    'https://images.unsplash.com/photo-1664382953647-5c6c76dd63b9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    '[{"title":"Tutor Terseleksi Komprehensif","desc":"Hanya 10% pelamar terpilih melalui tes akademik, micro-teaching, dan wawancara karakter."},{"title":"Laporan Evaluasi Rutin","desc":"Orang tua menerima laporan perkembangan belajar terukur setiap minggu."},{"title":"Kurikulum Personal Adaptif","desc":"Pendekatan belajar disesuaikan dengan gaya dan kecepatan masing-masing anak."}]',
    '[{"value":"4.979","label":"Siswa Aktif"},{"value":"3.200","label":"Tutor Terseleksi"},{"value":"99","label":"Mata Pelajaran"}]',
    '6281234567890',
    'Halo Sentra Cendekia, saya ingin bertanya tentang program les privat.',
    'halo@sentracendekia.id',
    '@sentracendekia',
    'Jl. Pendidikan No. 12, Jakarta Selatan 12345',
    'Lembaga bimbingan belajar privat dengan tutor profesional yang datang ke rumah Anda.',
    'Seluruh hak cipta dilindungi.',
    'Halo {nama}, terima kasih sudah mendaftar di Sentra Cendekia{program_clause}{paket_clause}. Kami ingin membantu proses pendaftaran Anda lebih lanjut.',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `brand_name` = VALUES(`brand_name`),
    `tagline` = VALUES(`tagline`),
    `logo_url` = VALUES(`logo_url`),
    `hero_badge` = VALUES(`hero_badge`),
    `hero_title` = VALUES(`hero_title`),
    `hero_subtitle` = VALUES(`hero_subtitle`),
    `hero_image` = VALUES(`hero_image`),
    `hero_cta` = VALUES(`hero_cta`),
    `marquee_text` = VALUES(`marquee_text`),
    `about_eyebrow` = VALUES(`about_eyebrow`),
    `about_title` = VALUES(`about_title`),
    `about_description` = VALUES(`about_description`),
    `about_image` = VALUES(`about_image`),
    `about_points` = VALUES(`about_points`),
    `stats` = VALUES(`stats`),
    `whatsapp` = VALUES(`whatsapp`),
    `whatsapp_message` = VALUES(`whatsapp_message`),
    `email` = VALUES(`email`),
    `instagram` = VALUES(`instagram`),
    `address` = VALUES(`address`),
    `footer_text` = VALUES(`footer_text`),
    `footer_copyright` = VALUES(`footer_copyright`),
    `wa_reply_template` = VALUES(`wa_reply_template`),
    `updated_at` = NOW();

-- Programs
INSERT INTO `programs` (`id`, `title`, `level`, `description`, `subjects`, `icon`, `order`, `created_at`, `updated_at`)
VALUES
('ad7e4f2c-4ffe-41dd-8144-eca6b42e37ce', 'Les Privat SD', 'Jenjang SD', 'Pendampingan Calistung, PR sekolah, serta persiapan ujian sekolah dari kelas 1-6 dengan metode ramah anak.', '["Matematika","Bahasa Indonesia","IPA","IPS","Calistung"]', 'book', 0, NOW(), NOW()),
('de82ae68-05d4-4264-ac2a-7c722190b24a', 'Les Privat SMP', 'Jenjang SMP', 'Fokus pada pemahaman logika Matematika, IPA, Bahasa Inggris, serta persiapan menuju SMA favorit.', '["Matematika","IPA","Bahasa Inggris","IPS"]', 'school', 1, NOW(), NOW()),
('92ef71cb-d2e1-4618-8500-ee437f0a57a1', 'Les Privat SMA & UTBK', 'Jenjang SMA', 'Persiapan intensif lolos PTN impian: penguasaan konsep dasar Fisika, Kimia, Biologi, Ekonomi, dan strategi TPS UTBK.', '["Fisika","Kimia","Biologi","Ekonomi","TPS UTBK"]', 'graduation', 2, NOW(), NOW()),
('79285c8e-ea7a-4bf8-86e6-c3326a216bec', 'Program Bahasa Asing', 'Semua Umur', 'Penguasaan komunikasi aktif Bahasa Inggris, Mandarin, Jepang, dan Arab langsung dengan tutor native-level.', '["Inggris","Mandarin","Jepang","Arab"]', 'globe', 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `title` = VALUES(`title`),
    `level` = VALUES(`level`),
    `description` = VALUES(`description`),
    `subjects` = VALUES(`subjects`),
    `icon` = VALUES(`icon`),
    `order` = VALUES(`order`),
    `updated_at` = NOW();

-- Tutors
INSERT INTO `tutors` (`id`, `name`, `subject`, `education`, `photo`, `bio`, `order`, `created_at`, `updated_at`)
VALUES
('920ce40c-127c-43e6-b26c-6e64fb3c3a5f', 'Nadia Putri, S.Pd.', 'Matematika & Fisika', 'Universitas Indonesia', 'https://images.unsplash.com/photo-1758600587839-56ba05596c69?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', '8 tahun membimbing siswa SMA lolos PTN dengan pendekatan konsep yang sederhana.', 0, NOW(), NOW()),
('3ce94ed0-a67b-4ebc-a529-130dd2ee3155', 'Rizky Pratama, M.Sc.', 'Kimia & Biologi', 'Institut Teknologi Bandung', 'https://images.unsplash.com/photo-1561346745-5db62ae43861?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'Peraih medali OSN yang menyukai eksperimen sederhana untuk menjelaskan sains.', 1, NOW(), NOW()),
('6d14e6c7-a651-4cc1-9626-626db3d3a2df', 'Sarah Amelia, S.S.', 'Bahasa Inggris & Mandarin', 'Universitas Gadjah Mada', 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'IELTS 8.5 dan HSK 6, mengajar dengan metode conversational yang menyenangkan.', 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `subject` = VALUES(`subject`),
    `education` = VALUES(`education`),
    `photo` = VALUES(`photo`),
    `bio` = VALUES(`bio`),
    `order` = VALUES(`order`),
    `updated_at` = NOW();

-- Packages
INSERT INTO `packages` (`id`, `name`, `sessions`, `price`, `price_sd`, `price_smp`, `price_sma`, `duration`, `description`, `features`, `popular`, `order`, `created_at`, `updated_at`)
VALUES
('73f4da84-9f47-4937-b6ff-0fbdfdd8c398', 'Paket Reguler', 4, 400000, 680000, 750000, 880000, '60 menit / sesi', 'Rutin seminggu sekali untuk menjaga ritme belajar.', '["4x pertemuan privat","Tutor datang ke rumah","Modul & latihan soal","Laporan evaluasi bulanan"]', 0, 0, NOW(), NOW()),
('c07243a4-ca4f-4715-93a5-27f4bf4a2d61', 'Paket Intensif', 8, 800000, 1100000, 1250000, 1450000, '60 menit / sesi', 'Paling banyak dipilih untuk persiapan ujian.', '["8x pertemuan privat","Tutor datang ke rumah","Modul & bank soal eksklusif","Laporan evaluasi mingguan","Grup konsultasi orang tua"]', 1, 1, NOW(), NOW()),
('6d70f775-2f3a-4708-a426-212865c72ca6', 'Paket Prestasi', 12, 1200000, 1580000, 1800000, 2100000, '60 menit / sesi', 'Pendampingan maksimal untuk target nilai tertinggi.', '["12x pertemuan privat","Tutor datang ke rumah","Try-out & pembahasan","Laporan evaluasi mingguan","Ganti tutor gratis","Prioritas jadwal"]', 0, 2, NOW(), NOW()),
('b20ef4db-9e8b-4483-bb27-444288f327a8', 'Paket Platinum', 16, 1600000, 1440000, 1600000, 1920000, '60 menit / sesi', 'Bimbingan komprehensif intensif untuk hasil terbaik.', '["16x pertemuan privat","Tutor datang ke rumah","Modul & bank soal eksklusif","Try-out & pembahasan","Laporan evaluasi mingguan","Konsultasi orang tua","Prioritas jadwal","2x simulasi ujian"]', 0, 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `sessions` = VALUES(`sessions`),
    `price` = VALUES(`price`),
    `price_sd` = VALUES(`price_sd`),
    `price_smp` = VALUES(`price_smp`),
    `price_sma` = VALUES(`price_sma`),
    `duration` = VALUES(`duration`),
    `description` = VALUES(`description`),
    `features` = VALUES(`features`),
    `popular` = VALUES(`popular`),
    `order` = VALUES(`order`),
    `updated_at` = NOW();

-- FAQs
INSERT INTO `faqs` (`id`, `question`, `answer`, `order`, `created_at`, `updated_at`)
VALUES
('4dc681e9-9892-40d9-a17d-05da27516cca', 'Bagaimana cara mendaftar les privat di Sentra Cendekia?', 'Cukup isi formulir pendaftaran di website atau hubungi kami via WhatsApp. Tim kami akan menghubungi Anda dalam 1x24 jam untuk konsultasi kebutuhan belajar dan pencocokan tutor.', 0, NOW(), NOW()),
('211c46f5-afc9-4f1b-b520-9dbb48736281', 'Apakah tutor datang ke rumah?', 'Ya. Seluruh program kami dirancang dengan tutor yang datang langsung ke rumah siswa sesuai jadwal yang disepakati. Tersedia juga opsi online bila diperlukan.', 1, NOW(), NOW()),
('4567959a-fbca-49e9-bb4e-fcc1667b52bc', 'Bagaimana jika tidak cocok dengan tutor?', 'Kami menyediakan garansi ganti tutor gratis. Cukup informasikan ke tim kami dan kami akan mencarikan tutor pengganti yang lebih sesuai.', 2, NOW(), NOW()),
('3c61fab7-ee00-492c-80ca-1f7b47eb2ac6', 'Apakah jadwal bisa fleksibel?', 'Sangat fleksibel. Jadwal ditentukan bersama antara orang tua, siswa, dan tutor. Perubahan jadwal dapat dilakukan minimal 1 hari sebelumnya.', 3, NOW(), NOW()),
('63eb6a80-9ae3-4ccf-85c8-14e8ef3e8d9e', 'Bagaimana sistem pembayarannya?', 'Pembayaran dilakukan per paket di awal periode melalui transfer bank atau e-wallet. Invoice resmi akan dikirimkan ke email/WhatsApp Anda.', 4, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `question` = VALUES(`question`),
    `answer` = VALUES(`answer`),
    `order` = VALUES(`order`),
    `updated_at` = NOW();

SET FOREIGN_KEY_CHECKS = 1;