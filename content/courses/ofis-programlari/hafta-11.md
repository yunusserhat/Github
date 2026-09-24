---
title: "11. Hafta: İleri Arama ve Başvuru Fonksiyonları"
linkTitle: "11. Hafta - DÜŞEYARA & ÇAPRAZARA"
date: "2026-09-01"
type: book
weight: 120
draft: true
---

## 🔍 Veri Tabanı İlişkileri ve Arama Fonksiyonları

Büyük veri tablolarında bir anahtar değere (örn. TC Kimlik No, Ürün Kodu, Öğrenci No) göre başka bir tablodan ilgili bilgiyi çekmek için arama fonksiyonları kullanılır.

<!--more-->

### DÜŞEYARA (VLOOKUP) Mimarisi
```excel
=DÜŞEYARA(Aranan_Değer; Tablo_Dizisi; Sütun_İndis_Sayısı; [Aralık_Bak])
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```
- **Kritik Kural:** Aranan değer, arama tablosunun en sol sütununda olmalıdır.
- **Tam Eşleşme:** Dördüncü parametre mutlaka `YANLIŞ` veya `0` (FALSE) olmalıdır.

---

## 🚀 Yeni Nesil Fonksiyon: ÇAPRAZARA (XLOOKUP)

Modern Excel ve Google Sheets sürümlerinde `DÜŞEYARA`'nın sınırlılıklarını kaldıran süper fonksiyon:

```excel
=ÇAPRAZARA(Aranan_Değer; Arama_Dizisi; Döndürülen_Dizi; [Bulunamazsa]; [Eşleşme_Modu])
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
```
- Sol veya sağ fark etmeksizin her yönde arama yapar.
- Değer bulunamazsa hata mesajı (`#YOK`) yerine özel mesaj yazdırabilir.

---

## 🛠️ Laboratuvar Uygulaması

1. İki farklı sayfa oluşturunuz: `1. Sayfa: Siparişler`, `2. Sayfa: Ürün Kataloğu (Fiyat Listesi)`.
2. Siparişler sayfasındaki Ürün Koduna göre Kataloğdaki ürün adını ve birim fiyatını `DÜŞEYARA` veya `ÇAPRAZARA` ile otomatik getiriniz.
3. Hata kontrolü için `EĞERHATA (IFERROR)` fonksiyonunu ekleyiniz.
