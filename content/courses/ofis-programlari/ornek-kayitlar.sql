-- Kampus Ofis Becerileri Gunu - SQLite Uygulama Veritabani
-- DB Browser for SQLite icinde yeni bir veritabani (etkinlik.db) acip
-- "SQL Calistir" (Execute SQL) sekmesinde asama asama calistirin.
-- Veriler kurgusaldir, gercek kisi bilgisi icermez.

PRAGMA foreign_keys = ON;

-- 1. Oturumlar tablosu (ana referans tablosu)
CREATE TABLE oturumlar (
    oturum_kodu TEXT PRIMARY KEY,
    oturum_adi TEXT NOT NULL UNIQUE,
    salon TEXT NOT NULL,
    kontenjan INTEGER NOT NULL CHECK (kontenjan > 0),
    sure_dk INTEGER NOT NULL CHECK (sure_dk > 0)
);

-- 2. Etkinlik kayitlari tablosu (oturumlar tablosuna bagli kayit tablosu)
CREATE TABLE etkinlik_kayitlari (
    kayit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    katilimci_kodu TEXT NOT NULL UNIQUE,
    birim TEXT NOT NULL,
    oturum_kodu TEXT NOT NULL,
    durum TEXT NOT NULL CHECK (durum IN ('Onaylandı', 'Bekliyor', 'İptal')),
    kayit_tarihi TEXT NOT NULL,
    materyal_tl INTEGER NOT NULL DEFAULT 0 CHECK (materyal_tl >= 0),
    FOREIGN KEY (oturum_kodu) REFERENCES oturumlar(oturum_kodu)
);

-- Oturum kayitlarini ekle (4 oturum)
INSERT INTO oturumlar (oturum_kodu, oturum_adi, salon, kontenjan, sure_dk) VALUES
('YAZ', 'Resmi Yazışma', 'Lab-1', 30, 60),
('EXL', 'Excel ile Veri Analizi', 'Lab-2', 25, 90),
('SNM', 'Etkili Sunum', 'Konferans', 40, 60),
('VTB', 'Veritabanı Temelleri', 'Lab-2', 25, 90);

-- Katilimci kayitlarini ekle (12 kurgusal kayit)
INSERT INTO etkinlik_kayitlari (katilimci_kodu, birim, oturum_kodu, durum, kayit_tarihi, materyal_tl) VALUES
('K001', 'Sekreterlik', 'YAZ', 'Onaylandı', '2026-12-01', 120),
('K002', 'Muhasebe', 'EXL', 'Bekliyor', '2026-12-01', 200),
('K003', 'Sekreterlik', 'EXL', 'Onaylandı', '2026-12-01', 200),
('K004', 'İnsan Kaynakları', 'YAZ', 'İptal', '2026-12-02', 0),
('K005', 'Sekreterlik', 'SNM', 'Onaylandı', '2026-12-02', 150),
('K006', 'Muhasebe', 'EXL', 'Onaylandı', '2026-12-02', 200),
('K007', 'İnsan Kaynakları', 'SNM', 'Bekliyor', '2026-12-03', 150),
('K008', 'Sekreterlik', 'VTB', 'Onaylandı', '2026-12-03', 180),
('K009', 'Bilişim', 'VTB', 'Onaylandı', '2026-12-04', 180),
('K010', 'Muhasebe', 'VTB', 'Onaylandı', '2026-12-04', 180),
('K011', 'Bilişim', 'EXL', 'Onaylandı', '2026-12-05', 200),
('K012', 'İnsan Kaynakları', 'YAZ', 'İptal', '2026-12-05', 0);

-- Ornek kontrol sorgulari (her birini ayri calistirabilirsiniz)
SELECT * FROM oturumlar ORDER BY oturum_kodu;

SELECT kayit_id, katilimci_kodu, birim, oturum_kodu, durum, materyal_tl
FROM etkinlik_kayitlari
ORDER BY kayit_id;
