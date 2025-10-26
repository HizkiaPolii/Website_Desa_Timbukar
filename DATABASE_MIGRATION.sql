-- ============================================
-- SQL Migration untuk menambah field kategori
-- Database: PostgreSQL
-- ============================================

-- Jika Anda ingin menggunakan ENUM TYPE (lebih baik):
-- Buat tipe ENUM terlebih dahulu
CREATE TYPE kategori_enum AS ENUM (
    'pemimpin_desa',
    'perangkat_desa',
    'perangkat_penunjang'
);

-- Tambahkan kolom kategori dengan tipe ENUM
ALTER TABLE pemerintahan ADD COLUMN kategori kategori_enum NOT NULL DEFAULT 'perangkat_desa';

-- ============================================
-- ALTERNATIF: Jika Anda ingin menggunakan VARCHAR
-- ============================================
-- Jalankan ini jika perintah ENUM di atas error:

-- ALTER TABLE pemerintahan ADD COLUMN kategori VARCHAR(50) NOT NULL DEFAULT 'perangkat_desa';

-- ============================================
-- Update data kategori untuk pegawai existing
-- ============================================

-- Set kategori untuk Kepala Desa / Hukum Tua
UPDATE pemerintahan 
SET kategori = 'pemimpin_desa' 
WHERE jabatan ILIKE '%kepala desa%' 
   OR jabatan ILIKE '%hukum tua%'
   OR jabatan ILIKE '%lurah%';

-- Set kategori untuk Sekretaris Desa, Bendahara, dan Staff
UPDATE pemerintahan 
SET kategori = 'perangkat_desa' 
WHERE jabatan ILIKE '%sekretaris%' 
   OR jabatan ILIKE '%bendahara%'
   OR jabatan ILIKE '%staff%'
   OR jabatan ILIKE '%kaur%';

-- Set kategori untuk Kepala Dusun dan RT/RW (Perangkat Penunjang)
UPDATE pemerintahan 
SET kategori = 'perangkat_penunjang' 
WHERE jabatan ILIKE '%kepala dusun%' 
   OR jabatan ILIKE '%ketua rt%'
   OR jabatan ILIKE '%ketua rw%';

-- ============================================
-- Verifikasi
-- ============================================
-- Cek apakah kolom sudah ada dan berisi data:
SELECT COUNT(*) as total, kategori, COUNT(DISTINCT kategori) as unique_kategori
FROM pemerintahan
GROUP BY kategori;

-- Lihat beberapa sampel data:
SELECT id, nama, jabatan, kategori FROM pemerintahan LIMIT 10;
