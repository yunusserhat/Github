---
title: "10. Hafta: Matematiksel ve Mantıksal Fonksiyonlar"
linkTitle: "10. Hafta - Formüller & EĞER"
date: "2026-09-01"
type: book
weight: 110
draft: true
---

## 🔢 Temel Hesaplama ve İstatistik Fonksiyonları

Formüller her zaman `=` işaretiyle başlar:

<!--more-->

- `=TOPLA(A1:A10)` / `=SUM(A1:A10)`: Seçili aralığın toplamını alır.
- `=ORTALAMA(B1:B10)` / `=AVERAGE(B1:B10)`: Aritmetik ortalamayı hesaplar.
- `=MAK(C1:C10)` & `=MİN(C1:C10)`: En büyük ve en küçük değerleri bulur.
- `=BAĞ_DEĞ_SAY(D1:D10)`: Sayı içeren hücreleri sayar.

---

## 🔀 Mantıksal Fonksiyonlar: EĞER (IF) Ailesi

Ofis otomasyonunda kararlar mantıksal koşullara göre verilir:

### 1. Basit EĞER (IF)
```excel
=EĞER(Not>=50; "Geçti"; "Kaldı")
=IF(B2>=50, "Passed", "Failed")
```

### 2. İç İçe EĞER (Nested IF)
```excel
=EĞER(B2>=85; "AA"; EĞER(B2>=70; "BB"; EĞER(B2>=50; "CC"; "FF")))
```

### 3. Koşullu Hesaplama Fonksiyonları
- `=EĞERSAY(A1:A100; "Satış")`: Yalnızca belirtilen koşulu sağlayan hücreleri sayar.
- `=ETOPLA(A1:A100; "Satış"; C1:C100)`: Belirtilen kritere uyan tutarları toplar.

---

## 🛠️ Laboratuvar Uygulaması

1. Bir öğrenci not çizelgesi üzerinde vize (%40) ve final (%60) ağırlıklı ortalamasını hesaplayınız.
2. `EĞER` fonksiyonu kullanarak 60 ve üzeri not alanlara "Başarılı", altındakilere "Bütünleme" yazdırınız.
3. Koşullu Biçimlendirme (Conditional Formatting) ile "Bütünleme" kalan satırları açık kırmızı ile renklendiriniz.
