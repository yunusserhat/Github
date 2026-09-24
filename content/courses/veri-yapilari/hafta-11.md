---
title: "11. Hafta: Dengeli Ağaçlar (Balanced Trees: AVL)"
linkTitle: "11. Hafta - Dengeli Ağaçlar (AVL)"
date: "2026-09-01"
type: book
weight: 120
draft: true
---

## ⚖️ Neden Kendi Kendini Dengeleyen Ağaçlar?

Normal bir BST'ye sıralı veriler ($1, 2, 3, 4, 5, \dots$) eklendiğinde ağaç sağa doğru bir çizgi haline gelir ve yükseklik $h = n$ olur. Bu durumda arama $O(n)$ süresine geriler.

<!--more-->

**AVL Ağacı** (Adelson-Velsky and Landis), her düğüm için sol ve sağ alt ağaçların yükseklik farkını kontrol altında tutan ilk kendi kendini dengeleyen ikili arama ağacıdır.

---

## 📐 Denge Faktörü (Balance Factor - BF)

$$\text{BF} = \text{Yükseklik}(\text{Sol Alt Ağaç}) - \text{Yükseklik}(\text{Sağ Alt Ağaç})$$

Bir AVL ağacında her düğümün denge faktörü mutlaka $\{-1, 0, +1\}$ kümesinde olmalıdır. Denge faktörü $+2$ veya $-2$ olduğunda ağaç bozulmuştur ve rotasyonlarla onarılır.

---

## 🔄 Dört Temel Rotasyon Türü

1. **Sol-Sol Durumu (LL):** Tek bir **Sağ Rotasyon (Right Rotation)** ile düzeltilir.
2. **Sağ-Sağ Durumu (RR):** Tek bir **Sol Rotasyon (Left Rotation)** ile düzeltilir.
3. **Sol-Sağ Durumu (LR):** Önce sola, ardından sağa çift rotasyon yapılır.
4. **Sağ-Sol Durumu (RL):** Önce sağa, ardından sola çift rotasyon yapılır.

Rotasyonların tamamı $O(1)$ sürede gerçekleşir; bu sayede AVL ağacında arama, ekleme ve silme işlemleri her zaman **kesin olarak $O(\log n)$** garantilidir.
