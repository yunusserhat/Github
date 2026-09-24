---
title: "14. Hafta: Çizgelere Giriş (Graphs) ve Temel Gezinmeler"
linkTitle: "14. Hafta - Çizgeler (Graphs)"
date: "2026-09-01"
type: book
weight: 150
draft: true
---

## 🕸️ Graf Nedir? $G = (V, E)$

Graf (Çizge); düğümler kümesi ($V$ - Vertices) ve bu düğümleri birbirine bağlayan kenarlar kümesinden ($E$ - Edges) oluşan genel ağ yapısıdır.

<!--more-->

### Graf Türleri
- **Yönlü (Directed) vs. Yönsüz (Undirected)**
- **Ağırlıklı (Weighted) vs. Ağırlıksız (Unweighted)**
- **Döngülü (Cyclic) vs. Döngüsüz (Acyclic - DAG)**

---

## 💾 Graf Gösterim Yöntemleri

### 1. Komşuluk Matrisi (Adjacency Matrix)
$V \times V$ boyutunda iki boyutlu dizi. İki düğüm arasında kenar olup olmadığını $O(1)$ sürede söyler ancak $O(V^2)$ bellek kaplar.

### 2. Komşuluk Listesi (Adjacency List)
Her düğümün sadece doğrudan bağlı olduğu komşuları bir listede tutmasıdır. Seyrek (sparse) graflarda çok daha az bellek ($O(V + E)$) harcar.

```python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
```

---

## 🧭 Temel Gezinme Algoritmaları

### 1. Genişlik Öncelikli Arama (BFS - Breadth-First Search)
- **Veri Yapısı:** Kuyruk (Queue - FIFO).
- Ağırlıksız graflarda iki düğüm arasındaki **en kısa yolu** bulur!

### 2. Derinlik Öncelikli Arama (DFS - Depth-First Search)
- **Veri Yapısı:** Yığın (Stack - LIFO) veya Rekürsiyon.
- Döngü tespiti, topolojik sıralama ve yol bulma için kullanılır.
