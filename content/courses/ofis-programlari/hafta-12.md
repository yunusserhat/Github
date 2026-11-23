---
title: "12. Hafta. SQLite'da temel SQL sorguları, filtreleme ve veri güncelleme"
linkTitle: "12. Hafta. Temel SQL sorguları"
summary: "SELECT, WHERE, ORDER BY, LIMIT ile veri filtreleyin ve güvenli UPDATE ile DELETE işlemleri uygulayın."
date: "2026-12-15"
type: book
weight: 130
---

## Hedef

Geçen hafta oluşturduğunuz `etkinlik.db` veritabanından istediğiniz kayıtları `SELECT` komutlarıyla seçecek, koşullara göre filtreleyecek ve sıralayacaksınız. Dersin ikinci bölümünde mevcut bir kaydı `UPDATE` ile güncellemeyi ve hatalı bir kaydı `DELETE` ile güvenli biçimde silmeyi uygulayacaksınız.

## Sorgu kartı

```sql
SELECT katilimci_kodu, birim, oturum_kodu, materyal_tl
FROM etkinlik_kayitlari
WHERE durum = 'Onaylandı'
ORDER BY katilimci_kodu ASC;
```

- `SELECT` hangi sütunların gösterileceğini belirtir.
- `FROM` verinin hangi tablodan okunacağını belirler.
- `WHERE` satırları filtreleyen koşuldur. Birden fazla koşul `AND` veya `OR` ile birleştirilir.
- `IN (...)` birden çok değer listesi içinde eşleşme arar.
- `LIKE` metin içinde kalıp araması yapar (`%` sıfır veya daha fazla karakteri temsil eder).
- `ORDER BY` sonuçları artan (`ASC`) veya azalan (`DESC`) sırada düzenler. `LIMIT` gösterilecek en fazla satır sayısını sınırlar.

## Güvenli güncelleme ve silme kuralı

`UPDATE` ve `DELETE` komutları tablodaki veriyi kalıcı olarak değiştirir. Bu komutları **asla `WHERE` koşulu olmadan çalıştırmayın**. Koşul yazılmazsa tablodaki bütün satırlar değişir veya silinir. Güvenli alışkanlık olarak bir satırı güncellemeden veya silmeden önce aynı `WHERE` koşulunu `SELECT *` ile çalıştırıp ekranda tam olarak hedef satırı gördüğünüzü doğrulayın.

## Laboratuvar görevi

Geçen hafta Google Drive'a yüklediğiniz `etkinlik.db` dosyasını bilgisayarınıza indirip **DB Browser for SQLite** ile açın. **SQL Çalıştır (Execute SQL)** sekmesinde aşağıdaki görevleri sırayla yazıp çalıştırın.

### Bölüm A. Veri seçme, filtreleme ve sıralama

1. **Onaylı kayıtlar.** Durumu `'Onaylandı'` olan kayıtların `katilimci_kodu`, `birim`, `oturum_kodu` ve `materyal_tl` sütunlarını katılımcı koduna göre sıralı listeleyin. **8 satır** beklenir.
2. **İki koşullu filtre.** `oturum_kodu = 'EXL'` ve `durum = 'Onaylandı'` koşulunu birlikte sağlayan katılımcıları listeleyin. **3 satır** (`K003`, `K006`, `K011`) beklenir.
3. **Liste içinde arama (`IN`).** Oturum kodu `'EXL'` veya `'VTB'` olan tüm kayıtları `IN ('EXL', 'VTB')` kullanarak getirin ve oturum koduna göre sıralayın. **7 satır** beklenir.
4. **Sıralama ve sınırlandırma (`ORDER BY` ve `LIMIT`).** `materyal_tl >= 180` olan kayıtları materyal tutarına göre büyükten küçüğe (`DESC`), eşitlikte katılımcı koduna göre artan sıralayarak yalnızca ilk **5 satırı** gösterin.
5. **Metin kalıbı (`LIKE`).** Birim adı `'Sek'` ile başlayan kayıtları `WHERE birim LIKE 'Sek%'` koşuluyla listeleyin. **4 satır** beklenir.

### Bölüm B. Güvenli `UPDATE` ve `DELETE`

6. **Önce kontrol, sonra `UPDATE`.** `K002` kodlu katılımcının durumu `'Bekliyor'` görünüyor. Önce `SELECT * FROM etkinlik_kayitlari WHERE katilimci_kodu = 'K002';` ile tek satırı görün. Ardından şu güncellemeyi çalıştırın.

```sql
UPDATE etkinlik_kayitlari
SET durum = 'Onaylandı'
WHERE katilimci_kodu = 'K002';
```

7. **Önce kontrol, sonra `DELETE`.** İptal edilmiş son test kaydı olan `K012` satırını silmek için önce `SELECT * FROM etkinlik_kayitlari WHERE katilimci_kodu = 'K012';` komutunu çalıştırın. Tek satır gördükten sonra silme işlemini yapın.

```sql
DELETE FROM etkinlik_kayitlari
WHERE katilimci_kodu = 'K012';
```

8. **Son durum kontrolü.** `SELECT COUNT(*) AS toplam_kayit FROM etkinlik_kayitlari;` komutunu çalıştırın. Sonuç **11** olmalıdır.
9. **Kaydetme ve yükleme.** Üst araç çubuğundan **Değişiklikleri Yaz (Write Changes)** düğmesine basın. Yazdığınız sekiz sorguyu yorum satırlarıyla birlikte `02_temel_sorgular.sql` olarak kaydedin. Hem `02_temel_sorgular.sql` dosyasını hem de güncellenmiş `etkinlik.db` dosyasını Google Drive'daki `Ofis_Programlari/04_Veritabani/` klasörüne yükleyin.

## Laboratuvar kontrolü

- `K002` kaydının durumu `'Onaylandı'` oldu mu ve `K012` silindi mi?
- Tabloda toplam **11 kayıt** kaldı mı?
- **Değişiklikleri Yaz** düğmesine basılarak güncel `etkinlik.db` Drive'a yüklendi mi?

**Google Drive teslimi.** `Ofis_Programlari/04_Veritabani/02_temel_sorgular.sql` ve güncellenmiş `Ofis_Programlari/04_Veritabani/etkinlik.db`.
