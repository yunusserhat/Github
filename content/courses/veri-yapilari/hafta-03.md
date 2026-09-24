---
title: "3. Hafta: Bağlı Listeler I: Tek Yönlü Bağlı Liste (Singly Linked List)"
linkTitle: "3. Hafta - Bağlı Listeler I"
date: "2026-09-01"
type: book
weight: 40
draft: true
---

## 🔗 Neden Bağlı Liste?

Dizilerin en büyük dezavantajı eleman eklemek veya silmek için diğer tüm elemanları kaydırma ($O(n)$) zorunluluğudur. 

<!--more-->

Bağlı liste (Linked List), elemanların bellekte ardışık olma zorunluluğunu ortadan kaldırır. Her eleman bir **Düğüm (Node)** içinde saklanır ve her düğüm kendisinden sonraki düğümün bellek adresini (pointer/reference) tutar.

---

## 🧩 Düğüm (Node) Mimarisi

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None  # Bir sonraki düğüme işaret eder
```

---

## ⚙️ Temel İşlemler ve Karmaşıklıkları

1. **Başa Ekleme (Prepend):** $O(1)$
2. **Sona Ekleme (Append):** Tail pointer varsa $O(1)$, yoksa $O(n)$
3. **Arama:** $O(n)$ (Rastgele erişim yapılamaz, baştan itibaren gezilmelidir)
4. **Referansı Bilinen Düğümün Ardına Ekleme:** $O(1)$

```python
class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def display(self):
        current = self.head
        elements = []
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements) + " -> None")
```
