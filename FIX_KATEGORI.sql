-- ============================================
-- FIX KATEGORI DENNY ENGKA MENJADI PEMIMPIN DESA
-- ============================================

-- Update Denny Engka (Hukum Tua) dari perangkat_desa ke pemimpin_desa
UPDATE pemerintahan 
SET kategori = 'pemimpin_desa' 
WHERE nama = 'Denny Engka' AND jabatan = 'Hukum Tua';

-- Verifikasi
SELECT nama, jabatan, kategori FROM pemerintahan ORDER BY kategori, nama;

-- Jika ingin lihat breakdown per kategori:
SELECT 
  kategori,
  COUNT(*) as jumlah,
  STRING_AGG(nama || ' (' || jabatan || ')', ', ') as daftar_pegawai
FROM pemerintahan
GROUP BY kategori
ORDER BY kategori;
