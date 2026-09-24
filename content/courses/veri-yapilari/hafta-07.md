---
title: "7. Hafta: Özyineleme (Recursion) ve Böl-Yönet"
linkTitle: "7. Hafta - Özyineleme (Recursion)"
date: "2026-09-01"
type: book
weight: 80
draft: true
---

## 🪞 Özyineleme (Recursion) Nedir?

Bir fonksiyonun kendi kendisini doğrudan veya dolaylı olarak çağırması prensibidir. Karmaşık problemleri aynı problemin daha küçük alt parçalarına bölerek çözmeyi sağlar.

<!--more-->

### İki Hayati Bileşen
1. **Temel Durum (Base Case):** Fonksiyonun kendini çağırmayı durdurup doğrudan bir sonuç döndürdüğü sonlandırma koşulu (Base case olmazsa sonsuz döngü ve `RecursionError: maximum recursion depth exceeded` / Stack Overflow oluşur!).
2. **Özyinelemeli Adım (Recursive Step):** Problemi her adımda temel duruma yaklaştıran çağrı.

---

## 💻 Faktöriyel ve Fibonacci Analizi

```python
# O(n) Zaman, O(n) Stack Belleği
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Saf Rekürsif Fibonacci: O(2^n) Üstel Zaman!
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

---

## ⚖️ Böl-Yönet (Divide and Conquer) Stratejisi

Problemi bağımsız alt problemlere bölüp ayrı ayrı çözme ve sonuçları birleştirme yaklaşımıdır.
- **Merge Sort (Birleştirmeli Sıralama):** Diziyi ikiye böler, her iki yarıyı sıralar ve $O(n)$ sürede birleştirir ($O(n \log n)$).
- **Hanoi Kuleleri Bulmacası:** $2^n - 1$ adımda çözüm.
