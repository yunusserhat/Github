---
title: "4. Hafta: Yığınlar (Stacks) ve LIFO Mimarisi"
linkTitle: "4. Hafta - Yığınlar (Stacks)"
date: "2026-09-01"
type: book
weight: 50
draft: false
---

## 📊 Ders Sunumu ve Slaytlar

Ders sunumunu tarayıcıda doğrudan inceleyebilir veya indirebilirsiniz.

{{< cta cta_text="📄 4. Hafta Slaytları (PDF)" cta_link="/courses/veri-yapilari/hafta-04-slayt.pdf" cta_new_tab="true" >}}

1. [4. Hafta Slaytları (PDF olarak aç ve incele)](/courses/veri-yapilari/hafta-04-slayt.pdf)

---

## 🥞 Yığın (Stack) Mantığı: LIFO

Yığın, eleman ekleme ve çıkarma işlemlerinin yalnızca tek bir uçtan (**Top - Tepe / Üst**) yapıldığı doğrusal bir veri yapısıdır. **LIFO (Last In, First Out - Son Giren İlk Çıkar)** ilkesine dayanır.

<!--more-->

### Temel İşlemler
- `push(item)`: Tepeye/üste yeni eleman ekler ($O(1)$).
- `pop()`: Tepedeki/üstteki elemanı yığından çıkarır ve döndürür ($O(1)$).
- `peek()` / `top()`: Tepedeki/üstteki elemanı çıkarmadan değerini okur ($O(1)$).
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

---

{{< cta cta_text="➡️ 5. Haftaya Geç: Kuyruklar (Queues)" cta_link="/courses/veri-yapilari/hafta-05/" >}}
