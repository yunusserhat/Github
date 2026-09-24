---
title: "2. Hafta: Diziler (Arrays) ve Dinamik Diziler"
linkTitle: "2. Hafta - Diziler"
date: "2026-09-01"
type: book
weight: 30
draft: true
---

## 🧱 Dizilerin Bellek Modeli (Contiguous Memory)

Dizi (Array), aynı türden verilerin bellekte ardışık (bitişik) adreslerde saklandığı en temel veri yapısıdır.

<!--more-->

### Adres Hesaplama Formülü
Bir dizinin $i$. elemanının bellek adresi:
$$\text{Adres}(A[i]) = \text{Başlangıç Adresi} + i \times \text{Eleman Boyutu}$$

Bu matematiksel formül sayesinde indeksi bilinen bir dizi elemanına doğrudan $O(1)$ zamanda erişilir!

---

## 🔄 Sabit vs. Dinamik Diziler (Dynamic Arrays)

- **Statik Dizi (C Tarzı):** Boyutu derleme anında veya oluşturulurken belirlenir, sonradan değiştirilemez.
- **Dinamik Dizi (Python `list`, C++ `std::vector`, Java `ArrayList`):** Eleman sayısı doldukça kapasitesini otomatik olarak genellikle 2 katına çıkaran yapıdır.

### İki Katına Çıkarma (Geometric Resizing) ve Amortized Analiz
Dinamik dizi dolduğunda:
1. Bellekte $2 \times \text{Kapasite}$ boyutunda yeni bir alan tahsis edilir.
2. Eski dizideki $n$ eleman yeni diziye kopyalanır ($O(n)$ maliyet).
3. Eski alan serbest bırakılır.

Bu kopyalama seyrek gerçekleştiği için $n$ adet ekleme işleminin ortalama maliyeti işlem başına $O(1)$ amortized zamandır.

---

## ⚡ Temel İşlem Karmaşıklıkları

- **İndeksle Erişim:** $O(1)$
- **Sona Ekleme (Append):** $O(1)$ amortized
- **Araya / Başa Ekleme:** $O(n)$ (elemanların sağa ötelenmesi gerekir)
- **Aradan / Baştan Silme:** $O(n)$ (elemanların sola kaydırılması gerekir)
