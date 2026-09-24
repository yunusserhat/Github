---
title: "5. Hafta: Yığınlar (Stacks) ve LIFO Mimarisi"
linkTitle: "5. Hafta - Yığınlar (Stacks)"
date: "2026-09-01"
type: book
weight: 60
draft: true
---

## 🥞 Yığın (Stack) Mantığı: LIFO

Yığın, eleman ekleme ve çıkarma işlemlerinin yalnızca tek bir uçtan (**Top - Tepe**) yapıldığı doğrusal bir veri yapısıdır. **LIFO (Last In, First Out - Son Giren İlk Çıkar)** ilkesine dayanır.

<!--more-->

### Temel İşlemler
- `push(item)`: Tepeye yeni eleman ekler ($O(1)$).
- `pop()`: Tepedeki elemanı yığından çıkarır ve döndürür ($O(1)$).
- `peek()` / `top()`: Tepedeki elemanı çıkarmadan değerini okur ($O(1)$).
- `is_empty()`: Yığının boş olup olmadığını kontrol eder ($O(1)$).

---

## 🛠️ Gerçekleme: Python ile Stack Sınıfı

```python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack boş!")
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack boş!")
        return self._items[-1]

    def is_empty(self):
        return len(self._items) == 0
```

---

## 💡 Pratik Uygulamalar
1. **Geri Al (Undo / Redo):** Metin düzenleyicilerinde Ctrl+Z geçmişi.
2. **Çağrı Yığını (Call Stack):** Fonksiyon çağrıları ve yerel değişkenlerin yönetimi.
3. **Dengeli Parantez Eşleme (Balanced Parentheses):** Derleyicilerin sözdizimi kontrolü (`{[()]}`).
