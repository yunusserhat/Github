---
title: "9. Hafta: Ağaçlar (Trees) ve İkili Ağaç Mimarisi"
linkTitle: "9. Hafta - Ağaçlar (Trees)"
date: "2026-09-01"
type: book
weight: 100
draft: true
---

## 🌳 Hiyerarşik Veri Yapıları: Ağaçlar

Ağaç (Tree), doğrusal olmayan, düğümler ve onları birbirine bağlayan kenarlardan (edges) oluşan hiyerarşik bir veri yapısıdır.

<!--more-->

### Temel Ağaç Terminolojisi
- **Kök (Root):** Ağacın en üstündeki, ebeveyni olmayan tek düğüm.
- **Düğüm (Node):** Veri ve çocuk referanslarını tutan eleman.
- **Yaprak (Leaf):** Hiç çocuğu olmayan uç düğümler.
- **Yükseklik (Height):** Kökten en derin yaprağa giden en uzun yoldaki kenar sayısı.
- **Derinlik (Depth):** Bir düğümden köke olan mesafe.

---

## 🌲 İkili Ağaç (Binary Tree) ve Gezinme (Tree Traversal)

Her düğümün en fazla 2 çocuğu (`left`, `right`) bulunabilen ağaç türüdür.

### Derinlik Öncelikli Gezinme Yöntemleri:
1. **Preorder (Kök - Sol - Sağ):** Ağacı kopyalamak ve serileştirmek için idealdir.
2. **Inorder (Sol - Kök - Sağ):** Arama ağaçlarında elemanları küçükten büyüğe sıralı verir!
3. **Postorder (Sol - Sağ - Kök):** Ağacı bellekten silmek ve alt ağaç büyüklüklerini hesaplamak için kullanılır.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    if root:
        inorder_traversal(root.left)
        print(root.val, end=" ")
        inorder_traversal(root.right)
```
