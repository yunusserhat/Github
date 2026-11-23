---
title: "13. Hafta. SQL'de özetleme, gruplama ve iki tablolu ilişkiler"
linkTitle: "13. Hafta. Gruplama ve tablo ilişkileri"
summary: "COUNT, SUM, AVG, GROUP BY, HAVING ve INNER JOIN ile iki ilişkili tablodan özet raporlar üretin."
date: "2026-12-22"
type: book
weight: 140
---

## Hedef

İlk yarıda Excel'de kullandığınız özetleme ve tablo eşleştirme işlemlerinin SQL karşılıklarını uygulayacaksınız. `GROUP BY` ve `HAVING` ile kategori bazlı özetler üretecek, ardından `INNER JOIN` kullanarak `etkinlik_kayitlari` ve `oturumlar` tablolarını ortak anahtar üzerinden birleştireceksiniz.

## Excel'den SQL'e köprü

İlk yarıda öğrendiğiniz Excel işlevlerinin veritabanındaki doğrudan karşılıkları şöyledir.

| Excel İşlevi | SQL Karşılığı | Kullanım Amacı |
| :--- | :--- | :--- |
| `=EĞERSAY(...)` | `COUNT(*)` ve `GROUP BY` | Kategorilere göre kayıt sayısını bulma |
| `=ETOPLA(...)` | `SUM(...)` ve `GROUP BY` | Kategorilere göre sayısal tutarları toplama |
| `=ORTALAMA(...)` | `AVG(...)` | Sayısal alanın ortalamasını hesaplama |
| `=MİN(...)` / `=MAK(...)` | `MIN(...)` / `MAX(...)` | En küçük ve en büyük değeri bulma |
| `=DÜŞEYARA(...)` | `INNER JOIN ... ON` | Ortak kod üzerinden başka tablodan bilgi getirme |

## Sorgu kartı

```sql
SELECT
    o.oturum_adi,
    o.salon,
    COUNT(k.kayit_id) AS onayli_katilimci,
    SUM(k.materyal_tl) AS toplam_materyal_tl
FROM etkinlik_kayitlari AS k
INNER JOIN oturumlar AS o ON k.oturum_kodu = o.oturum_kodu
WHERE k.durum = 'Onaylandı'
GROUP BY o.oturum_kodu, o.oturum_adi, o.salon
ORDER BY onayli_katilimci DESC;
```

- `WHERE` gruplamadan **önce** tek tek satırları filtreler.
- `HAVING` ise `GROUP BY` işleminden **sonra** grup özetlerini (örneğin `HAVING COUNT(*) >= 3`) filtreler.
- `AS k` ve `AS o` tablo takma adlarıdır, iki tabloda aynı sütun adı geçtiğinde karışıklığı önler.

## Laboratuvar görevi

Geçen hafta güncellediğiniz **11 kayıtlı** `etkinlik.db` dosyasını Google Drive'dan indirip **DB Browser for SQLite** ile açın. Aşağıdaki beş sorguyu sırayla çalıştırıp sonuçları doğrulayın.

1. **Duruma göre kayıt sayısı.** `etkinlik_kayitlari` tablosunu `durum` sütununa göre gruplayın ve her durumdaki kayıt sayısını bulun. Beklenen sonuçlar `Onaylandı` için **9**, `Bekliyor` için **1**, `İptal` için **1** şeklindedir.
2. **Birime göre onaylı katılımcı ve materyal toplamı.** Yalnızca `durum = 'Onaylandı'` olan kayıtları `birim` bazında gruplayın. Her birim için katılımcı sayısını (`COUNT(*)`), toplam materyal tutarını (`SUM(materyal_tl)`) ve ortalama tutarı (`ROUND(AVG(materyal_tl), 2)`) hesaplayın. Beklenen toplamlar `Sekreterlik` için **4 kişi ve 650 TL**, `Muhasebe` için **3 kişi ve 580 TL**, `Bilişim` için **2 kişi ve 380 TL** değerlerindedir.
3. **Grupları `HAVING` ile filtreleme.** İkinci sorguya `HAVING COUNT(*) >= 3` koşulunu ekleyerek en az 3 onaylı katılımcısı olan birimleri listeleyin. Yalnızca `Sekreterlik` (**4**) ve `Muhasebe` (**3**) satırları görünmelidir.
4. **İki tabloyu `INNER JOIN` ile birleştirme.** `etkinlik_kayitlari` ile `oturumlar` tablolarını `oturum_kodu` üzerinden birleştirin. Onaylı katılımcıların `katilimci_kodu`, `birim`, `oturum_adi` ve `salon` bilgilerini kod sırasıyla listeleyin. **9 satır** beklenir.
5. **Oturum bazlı yönetici özeti.** Dördüncü sorgudaki `INNER JOIN` yapısını `GROUP BY` ile birleştirerek her oturum için `oturum_adi`, `salon`, `kontenjan`, `onayli_katilimci` ve `toplam_materyal_tl` değerlerini hesaplayın. Beklenen sonuçlar şöyledir.
   - `Excel ile Veri Analizi` (`Lab-2`, kontenjan 25) için **4 katılımcı, 800 TL**.
   - `Veritabanı Temelleri` (`Lab-2`, kontenjan 25) için **3 katılımcı, 540 TL**.
   - `Etkili Sunum` (`Konferans`, kontenjan 40) için **1 katılımcı, 150 TL**.
   - `Resmi Yazışma` (`Lab-1`, kontenjan 30) için **1 katılımcı, 120 TL**.
6. Tüm beş sorguyu açıklamalı yorum satırlarıyla `03_ozet_ve_iliski.sql` dosyasına kaydedin ve Google Drive'daki `Ofis_Programlari/04_Veritabani/` klasörüne yükleyin.

## Laboratuvar kontrolü

- 12. haftadaki güncelleme ve silme işlemleri uygulanmış mı (`toplam 11 kayıt`, `9 Onaylandı`)?
- `WHERE` ve `HAVING` farkı 3. sorguda doğru biçimde çalıştı mı?
- 5. sorgunun genel onaylı materyal toplamı **1.610 TL** veriyor mu?
- `03_ozet_ve_iliski.sql` dosyası Google Drive'daki `04_Veritabani` klasörüne yüklendi mi?

**Google Drive teslimi.** `Ofis_Programlari/04_Veritabani/03_ozet_ve_iliski.sql`.
