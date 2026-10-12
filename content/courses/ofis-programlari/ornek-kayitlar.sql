-- Yalnızca size ayrılmış boş uygulama veritabanında bir kez çalıştırın.
-- Veriler kurgusaldır; gerçek öğrenci veya çalışan bilgisi girmeyin.

CREATE TABLE etkinlik_kayitlari (
    kayit_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    katilimci_kodu text NOT NULL UNIQUE,
    birim text NOT NULL,
    oturum text NOT NULL,
    durum text NOT NULL CHECK (durum IN ('Onaylandı', 'Bekliyor', 'İptal'))
);

INSERT INTO etkinlik_kayitlari (katilimci_kodu, birim, oturum, durum) VALUES
('K001', 'Sekreterlik', 'Yazışma', 'Onaylandı'),
('K002', 'Muhasebe', 'Excel', 'Bekliyor'),
('K003', 'Sekreterlik', 'Excel', 'Onaylandı'),
('K004', 'İnsan Kaynakları', 'Yazışma', 'İptal'),
('K005', 'Sekreterlik', 'Sunum', 'Onaylandı'),
('K006', 'Muhasebe', 'Excel', 'Onaylandı'),
('K007', 'İnsan Kaynakları', 'Sunum', 'Bekliyor'),
('K008', 'Sekreterlik', 'Yazışma', 'Onaylandı');

-- Öğrenci sorguları: her birini ayrı çalıştırın.
SELECT kayit_id, katilimci_kodu, birim, oturum, durum
FROM etkinlik_kayitlari
ORDER BY kayit_id;

SELECT katilimci_kodu, oturum
FROM etkinlik_kayitlari
WHERE durum = 'Onaylandı'
ORDER BY katilimci_kodu;

SELECT COUNT(*) AS onayli_excel_sayisi
FROM etkinlik_kayitlari
WHERE oturum = 'Excel' AND durum = 'Onaylandı';
