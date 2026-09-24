---
title: "12. Hafta: Yığınlar (Heaps) ve Öncelikli Kuyruklar"
linkTitle: "12. Hafta - Heaps & Öncelikli Kuyruk"
date: "2026-09-01"
type: book
weight: 130
draft: true
---

## 🏔️ İkili Yığın (Binary Heap) Özellikleri

İkili yığın, tam bir ikili ağaç (complete binary tree) olup iki kurala uyar:
1. **Şekil Özelliği (Shape Property):** En alt seviye hariç tüm seviyeler tamamen doludur ve en alt seviyedeki düğümler soldan sağa doğru yerleştirilir.
2. **Yığın Özelliği (Heap Property):**
   - **Max-Heap:** Her ebeveyn düğümün değeri çocuklarının değerinden $\ge$ büyük veya eşittir (Kök daima maksimumdur).
   - **Min-Heap:** Her ebeveyn düğümün değeri çocuklarının değerinden $\le$ küçük veya eşittir (Kök daima minimumdur).

<!--more-->

---

## 💾 Dizi Üzerinde Ağaç Gerçekleme (Array Representation)

İkili yığın tam bir ağaç olduğu için işaretçilere gerek kalmadan doğrudan bir dizide saklanabilir:
- Bir $i$ indeksindeki düğüm için:
  - **Sol Çocuk:** $2i + 1$
  - **Sağ Çocuk:** $2i + 2$
  - **Ebeveyn (Parent):** $\lfloor (i - 1) / 2 \rfloor$

---

## ⚡ Temel İşlemler ve Heapsort

- **Maksimum/Minimumu Bulma:** Kök elemandır, $O(1)$.
- **Ekleme (Insert):** Sona eklenip yukarı doğru kaydırılır (Bubble-Up / Sift-Up), $O(\log n)$.
- **En Büyüğü/Küçüğü Çıkarma (Extract):** Kök çıkarılır, son eleman köke konur ve aşağı kaydırılır (Sift-Down / Heapify), $O(\log n)$.
- **Heapsort:** $n$ elemanlı bir yığın kurup sırayla kökü çıkararak $O(n \log n)$ sürede ve $O(1)$ ek bellek ile sıralama yapar.

```python
import heapq

# Python standart kütüphanesinde Min-Heap:
min_heap = []
heapq.heappush(min_heap, 10)
heapq.heappush(min_heap, 4)
heapq.heappush(min_heap, 15)

smallest = heapq.heappop(min_heap)  # 4 döner (O(log n))
```
