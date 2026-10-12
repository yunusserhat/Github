---
title: "11. Hafta: PostgreSQL’de basit sorgular"
linkTitle: "11. Hafta — PostgreSQL’de basit sorgular"
summary: "Kayıtları seçin, filtreleyin, sıralayın ve sayın."
date: "2026-09-28"
type: book
weight: 120
---

## Hedef

Veritabanındaki sekiz örnek kayıttan ihtiyaç duyduğunuz bilgiyi `SELECT` ile alacaksınız. Sorgu yazmak, tabloyu değiştirmek anlamına gelmez.

## Sorgu kartı

```sql
SELECT katilimci_kodu, oturum
FROM etkinlik_kayitlari
WHERE durum = 'Onaylandı'
ORDER BY katilimci_kodu;
```

`SELECT` sütunları, `FROM` tabloyu, `WHERE` koşulu, `ORDER BY` sıralamayı belirtir. Metin değerleri tek tırnak içinde yazılır; komut `;` ile biter.

## Laboratuvar ürünü 2

Kendi veritabanınızda şu dört soruyu ayrı sorgularla cevaplayın:

1. Tüm kayıtları katılımcı koduna göre sırala. **8 satır** beklenir.
2. Yalnızca `Onaylandı` durumundaki kayıtları göster. **5 satır** beklenir.
3. `Excel` oturumuna kayıtlı ve onaylı olanları göster. **2 satır** beklenir.
4. Üçüncü grubun sayısını `COUNT(*)` ile bul. Sonuç **2** olmalıdır.

Sorgularınızı `04_Veritabani/etkinlik_sorgulari.sql` dosyasına kaydedin. Sonuçların yanına birer cümleyle ne bulduğunuzu yazın; ekran görüntüsü tek başına sorgu yerine geçmez.

## Puanlama

Tablo ve sekiz kayıt **30**, iki doğru filtre **30**, sıralama **15**, `COUNT` **15**, sorgu dosyası ve açıklama **10** puan. Hata görürseniz veriyi tekrar eklemeden önce sütun adını, tırnağı ve noktalı virgülü kontrol edin.
