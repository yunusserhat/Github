---
title: "10. Hafta: İkili Arama Ağaçları (Binary Search Trees - BST)"
linkTitle: "10. Hafta - BST"
date: "2026-09-01"
type: book
weight: 110
draft: true
---

## 🎯 İkili Arama Ağacı (BST) Kuralı

Bir ikili ağacın BST olabilmesi için her düğüm $X$ için:
- $X$'in sol alt ağacındaki tüm düğümlerin değerleri $< X$'in değerinden küçük olmalıdır.
- $X$'in sağ alt ağacındaki tüm düğümlerin değerleri $> X$'in değerinden büyük olmalıdır.

<!--more-->

---

## ⚡ Arama ve Ekleme Algoritması

BST kuralı sayesinde her karşılaştırmada ağacın bir yarısı elenir (İkili Arama mantığı).

- **Dengeli Durumda (Balanced):** Arama, ekleme ve silme süresi $O(\log n)$'dir.
- **Bozulmuş Durumda (Degenerate / Skewed):** Ağaç tek bir bağlı listeye dönüşür ve arama süresi $O(n)$'e düşer!

```python
class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert_recursive(self.root, val)

    def _insert_recursive(self, node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert_recursive(node.left, val)
        elif val > node.val:
            node.right = self._insert_recursive(node.right, val)
        return node

    def search(self, val):
        current = self.root
        while current:
            if val == current.val:
                return True
            current = current.left if val < current.val else current.right
        return False
```

---

## ✂️ Düğüm Silme Durumları
1. **Düğüm yapraksa:** Doğrudan ebeveyninden koparılır.
2. **Tek çocuğu varsa:** Çocuğu silinen düğümün yerine geçirilir.
3. **İki çocuğu varsa:** Sağ alt ağacın en küçük elemanı (Inorder Successor) bulunur, değeri silinecek düğüme kopyalanır ve successor silinir.
