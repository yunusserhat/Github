---
title: "1. Hafta: Veri Yapılarına Giriş ve Algoritma Analizi"
linkTitle: "1. Hafta - Algoritma Analizi"
date: "2026-09-01"
type: book
weight: 20
draft: true
---

## ⏱️ Neden Algoritma Analizi?

Bir problemi çözen birden fazla algoritma olduğunda, hangisinin "daha iyi" olduğunu belirlemek için çalışma süresini saat tutarak ölçmek yanıltıcıdır. Çünkü çalışma süresi kullanılan bilgisayarın işlemcisine, işletim sistemine ve o anki arka plan yüküne bağlıdır.

<!--more-->

Bu nedenle algoritmalar, girdi boyutu ($n$) sonsuza yaklaşırken harcanan temel işlem sayısı cinsinden incelenir. Buna **Asimptotik Analiz** denir.

---

## 📈 Asimptotik Notasyonlar

### 1. Big O ($O$) - Üst Sınır (Worst-case)
Bir algoritmanın en kötü durumda ne kadar yavaşlayabileceğini ifade eder. Pratikte en çok kullanılan notasyondur.

### 2. Big Omega ($\Omega$) - Alt Sınır (Best-case)
Algoritmanın en iyi durumda harcayacağı minimum süreyi gösterir.

### 3. Big Theta ($\Theta$) - Sıkı Sınır (Average-case)
Algoritmanın hem alt hem üst sınırının aynı büyüme hızında olduğunu ifade eder.

---

## 📊 Yaygın Karmaşıklık Sınıfları

| Karmaşıklık | İsim | Örnek Algoritma |
| :--- | :--- | :--- |
| $O(1)$ | Sabit Zaman (Constant) | Dizi elemanına indekse göre erişim |
| $O(\log n)$ | Logaritmik | İkili Arama (Binary Search) |
| $O(n)$ | Doğrusal (Linear) | Dizide baştan sona eleman arama |
| $O(n \log n)$ | Doğrusal Logaritmik | Hızlı Sıralama (Quicksort), Birleştirmeli Sıralama (Mergesort) |
| $O(n^2)$ | Karesel (Quadratic) | İkili iç içe döngüler, Bubble Sort |
| $O(2^n)$ | Üstel (Exponential) | Saf özyinelemeli Fibonacci |

---

## 💻 Örnek Kod Analizi (Python)

```python
# O(1) - Sabit Zaman
def get_first_element(arr):
    return arr[0] if arr else None

# O(n) - Doğrusal Zaman
def linear_search(arr, target):
    for index, val in enumerate(arr):
        if val == target:
            return index
    return -1

# O(n^2) - Karesel Zaman
def print_all_pairs(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n):
            print(arr[i], arr[j])
```
