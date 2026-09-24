---
title: "6. Hafta: Kuyruklar (Queues) ve Çift Uçlu Kuyruk (Deque)"
linkTitle: "6. Hafta - Kuyruklar (Queues)"
date: "2026-09-01"
type: book
weight: 70
draft: true
---

## 🚶 Kuyruk (Queue) Mantığı: FIFO

Kuyruk, elemanların arka uçtan (**Rear / Back**) eklendiği ve ön uçtan (**Front**) çıkarıldığı veri yapısıdır. **FIFO (First In, First Out - İlk Giren İlk Çıkar)** ilkesine dayanır.

<!--more-->

### Temel İşlemler
- `enqueue(item)`: Kuyruğun sonuna eleman ekler ($O(1)$).
- `dequeue()`: Kuyruğun başındaki elemanı çıkarır ($O(1)$).
- `front()`: En öndeki elemanı okur ($O(1)$).

---

## ⭕ Dairesel Kuyruk (Circular Queue)

Dizilerle kuyruk gerçeklenirken baştan çıkarılan elemanlar bellekte boşluk oluşturur ve indeksler sağa doğru kayar. Dairesel kuyruk yapısında modulo ($%$) aritmetiği kullanılarak son indekse ulaşıldığında dizi başına dönülür:

$$\text{next\_index} = (\text{index} + 1) \% \text{Kapasite}$$

---

## ↔️ Çift Uçlu Kuyruk (Double-ended Queue - Deque)

Hem baştan hem sondan $O(1)$ sürede eleman ekleme ve çıkarma işlemlerini destekleyen genel yapıdır (Python `collections.deque`).

### Kullanım Alanları
- Yazıcı kuyrukları (Printer Spooling).
- İşletim sistemlerinde süreç zamanlama (CPU Scheduling).
- Graf algoritmalarında Genişlik Öncelikli Arama (BFS - Breadth-First Search).
