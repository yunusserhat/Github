---
title: "4. Hafta: Bağlı Listeler II: Çift Yönlü ve Dairesel Listeler"
linkTitle: "4. Hafta - Bağlı Listeler II"
date: "2026-09-01"
type: book
weight: 50
draft: true
---

## ↔️ Çift Yönlü Bağlı Liste (Doubly Linked List)

Tek yönlü bağlı listelerde geriye doğru gitmek mümkün değildir. Çift yönlü bağlı listede her düğüm iki adet işaretçi tutar:
1. `next`: Bir sonraki düğüme işaret eder.
2. `prev`: Bir önceki düğüme işaret eder.

<!--more-->

```python
class DoublyNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None
```

### Avantajları ve Dezavantajları
- **Avantaj:** Herhangi bir düğümün silinmesi, o düğümün referansı elimizdeyse $O(1)$ sürede tamamlanır! (Önceki düğümü bulmak için liste taranmak zorunda kalınmaz).
- **Dezavantaj:** Ekstra işaretçi belleği (pointer overhead) ve işaretçi güncelleme karmaşıklığı.

---

## 🔄 Dairesel Bağlı Liste (Circular Linked List)

Son düğümün `next` işaretçisi `None` yerine listenin `head` (ilk) düğümüne bağlanır. 

### Kullanım Alanları:
- İşletim sistemlerinde CPU zaman paylaşımı (Round-Robin Zamanlama).
- Müzik çalarlarda çalma listesini sürekli döngüde oynatma.
- Çok oyunculu sıra tabanlı oyunlarda oyuncu sırasını belirleme.
