---
title: "5. Hafta: Excel’de hücreler ve bütçe tablosu"
linkTitle: "5. Hafta — Excel’de hücreler ve bütçe tablosu"
summary: "Küçük bir bütçe tablosunu doğru veri türleriyle kurun."
date: "2026-09-28"
type: book
weight: 60
---

## Hedef

Excel web uygulamasında hücre, satır ve sütun kavramlarını kullanarak sekiz kalemlik kurgusal etkinlik bütçesi hazırlayacaksınız.

## Örnek veriyi açma

[Örnek bütçe dosyasını](../ornek-butce.xlsx) indirip OneDrive’daki `03_Excel` klasörüne yükleyin. Dosyada `Kalem`, `Tur`, `Adet` ve `Birim_Fiyat_TL` sütunları vardır. `Tur` alanındaki değerler kategoridir; `Adet` ve `Birim_Fiyat_TL` sayıdır. Her veri bir hücrede, her bütçe kalemi ayrı satırda olmalıdır.

## Laboratuvar görevi

1. Dosyayı `Etkinlik_Butcesi.xlsx` olarak yeniden adlandırın.
2. Beşinci sütuna `Tutar_TL` başlığını yazın. İlk veri satırına `=C2*D2` formülünü girin; sonucu aşağıdaki yedi satıra kopyalayın.
3. `Adet` sütununu tam sayı, fiyat ve tutar sütunlarını para birimi olarak biçimlendirin.
4. Bütün sekiz kalemin adını ve tutarını tek tek kontrol edin; boş veri satırı bırakmayın.

## Kontrol

İlk satırın tutarı **300 TL** olmalı. `C2` değerini geçici olarak değiştirip `E2` sonucunun da değiştiğini görün; sonra eski değeri geri yazın. Bu, formülün çalıştığını gösterir.

**Ürün:** `03_Excel/Etkinlik_Butcesi.xlsx`.
